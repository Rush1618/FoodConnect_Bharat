import express from 'express';
import { Donation } from '../models/Donation.js';
import { Request } from '../models/Request.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { calculateUrgency, getTimeLeftString } from '../utils/urgency.js';
import { isFullyCompatible, getAllergenWarnings } from '../utils/matching.js';
import { ALLERGEN_LIST } from '../constants/allergens.js';

function getDistance(lat1, lon1, lat2, lon2) {
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  return 12742 * Math.asin(Math.sqrt(a));
}

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { dietPref, avoidAllergens, status = 'available', lat, lng, radius = 20 } = req.query;
    
    // Parse allergens
    const avoidList = avoidAllergens ? avoidAllergens.split(',') : [];

    // Find all matching initial status
    const filter = { status };
    const donations = await Donation.find(filter).populate('donorId', 'name phone').sort({ createdAt: -1 });

    const filteredDonations = donations.filter(donation => {
      // Recalculate urgency score on the fly
      const refTime = donation.preparedAt || new Date();
      donation.urgencyScore = calculateUrgency(refTime, donation.estimatedFreshFor || 24, donation.expiryTime);

      // Check fully compatible
      if (!isFullyCompatible(dietPref || 'any', avoidList, donation)) {
        return false;
      }
      
      // Check distance if lat/lng are provided
      if (lat && lng && donation.location?.lat && donation.location?.lng) {
        const dist = getDistance(parseFloat(lat), parseFloat(lng), donation.location.lat, donation.location.lng);
        if (dist > parseFloat(radius)) {
          return false;
        }
      }
      
      return true;
    });

    const result = filteredDonations.map(donation => {
      const donationObj = donation.toObject();
      const now = new Date();
      const expiry = new Date(donation.expiryTime);
      const hoursLeft = (expiry.getTime() - now.getTime()) / 3600000;
      
      return {
        ...donationObj,
        timeLeftString: getTimeLeftString(hoursLeft),
        allergenWarnings: getAllergenWarnings(avoidList, donation)
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Fetch Donations error:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { foodType, foodCategory = 'ready-to-eat', isBhandara, quantity, description, ingredientsUsed, location, preparedAt, estimatedFreshFor, expiryTime, donorCategory, assignedToNgo } = req.body;

    // Jain validation
    if (foodType === 'jain') {
      if (ingredientsUsed?.includes('onion') || ingredientsUsed?.includes('garlic')) {
        return res.status(400).json({ error: 'Jain food cannot contain onion or garlic.' });
      }
    }

    let finalExpiryTime = expiryTime ? new Date(expiryTime) : null;
    if (foodCategory !== 'packed' && preparedAt && estimatedFreshFor) {
      finalExpiryTime = new Date(new Date(preparedAt).getTime() + estimatedFreshFor * 3600000);
    }
    const refTime = preparedAt ? new Date(preparedAt) : new Date();
    const urgencyScore = calculateUrgency(refTime, estimatedFreshFor || 24, finalExpiryTime);

    // Auto-generate ingredients summary string for WhatsApp
    let topAllergens = 'none';
    if (ingredientsUsed && ingredientsUsed.length > 0) {
      topAllergens = ingredientsUsed.slice(0, 4)
        .map(id => ALLERGEN_LIST.find(a => a.id === id)?.label || id)
        .join(', ');
    }
    
    let whatsappShareText = 
      `Free food near ${location.address}! ${foodType.toUpperCase()} — ${quantity}\nContains: ${topAllergens}\n`;
      
    if (foodCategory === 'packed') {
      whatsappShareText += `Expires at: ${finalExpiryTime?.toLocaleString()}\nFoodConnect Bharat 🍛`;
    } else {
      whatsappShareText += `Good for ~${estimatedFreshFor} more hours.\nFoodConnect Bharat 🍛`;
    }

    const newDonation = new Donation({
      donorId: req.user.id,
      donorCategory,
      assignedToNgo,
      foodType,
      foodCategory,
      isBhandara,
      quantity,
      description,
      containsOnionGarlic: ingredientsUsed?.includes('onion') || ingredientsUsed?.includes('garlic'),
      ingredientsUsed,
      location,
      preparedAt: foodCategory !== 'packed' ? preparedAt : undefined,
      estimatedFreshFor: foodCategory !== 'packed' ? estimatedFreshFor : undefined,
      expiryTime: finalExpiryTime,
      urgencyScore,
      whatsappShareText
    });

    const saved = await newDonation.save();
    
    // Broadcast via socket could happen here or in the controller.
    if (req.app.get('io')) {
      req.app.get('io').emit('new_donation', saved);
    }

    res.status(201).json(saved);
  } catch (error) {
    console.error('Add Donation error:', error);
    res.status(500).json({ error: 'Failed to create donation' });
  }
});

// Claim a donation directly from map
router.post('/:id/claim', requireAuth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    if (donation.status !== 'available') return res.status(400).json({ error: 'This donation is no longer available' });

    const { deliveryMethod = 'pickup', numberOfPeople = 1, isAnonymous = false, dietaryPref = 'any' } = req.body;

    // Create the linked request
    const newRequest = new Request({
      neederId: req.user.id,
      linkedDonation: donation._id,
      deliveryMethod,
      numberOfPeople,
      isAnonymous,
      dietaryPref,
      location: req.body.location || donation.location,
      status: 'pending' // pending approval from donor
    });
    
    await newRequest.save();

    // Update donation status
    donation.status = 'claimed_pending_approval';
    await donation.save();

    res.status(200).json({ message: 'Claim submitted successfully', request: newRequest });
  } catch (error) {
    console.error('Claim Donation error:', error);
    res.status(500).json({ error: 'Failed to claim donation' });
  }
});

export default router;
