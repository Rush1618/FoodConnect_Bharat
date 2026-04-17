import express from 'express';
import { Donation } from '../models/Donation.js';
import { Request } from '../models/Request.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { calculateUrgency, getTimeLeftString, calculateUrgencyScore } from '../utils/urgency.js';
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

    // Fetch all pending requests for proximity-weighted urgency scoring
    const allRequests = await Request.find({ status: 'pending' });

    const filteredDonations = donations.filter(donation => {
      const near = allRequests.filter(r => 
        getDistance(r.location.lat, r.location.lng, donation.location.lat, donation.location.lng) <= 5
      );
      
      // Phase 1.5: Integrated Urgency Score Calculation
      donation.urgencyScore = calculateUrgencyScore(
        donation, 
        near.length, 
        near.some(r => r.isSOS)
      );

      // Check fully compatible (diet + allergens + NOT expired)
      return isFullyCompatible(dietPref || 'any', avoidList, donation);
    });

    const result = filteredDonations.map(donation => {
      const donationObj = donation.toObject();
      return {
        ...donationObj,
        timeLeftString: getTimeLeftString(
          donation.preparedAt, 
          donation.estimatedFreshFor || 24, 
          donation.expiryTime
        ),
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
    const { 
      foodType, 
      foodCategory = 'ready-to-eat', 
      isBhandara, 
      quantity, 
      description, 
      ingredientsUsed = [], 
      location, 
      preparedAt, 
      donorCategory, 
      assignedToNgo,
      bhandaraName,
      bhandaraStartTime,
      bhandaraEndTime,
      expectedCrowd
    } = req.body;

    // Jain validation
    if (foodType === 'jain') {
      if (ingredientsUsed.includes('onion') || ingredientsUsed.includes('garlic')) {
        return res.status(400).json({ error: 'Jain food cannot contain onion or garlic.' });
      }
    }

    // Auto-calculate karma
    const karmaValue = parseInt(quantity) * 10 || 50;

    // WhatsApp summary
    const topIngredients = ingredientsUsed.slice(0, 4)
      .map(id => ALLERGEN_LIST.find(a => a.id === id)?.label)
      .filter(Boolean)
      .join(', ');
    
    let whatsappShareText = `Free food near ${location.address}! ${foodType.toUpperCase()} — ${quantity}. Contains: ${topIngredients || 'None'}. Good for ~${estimatedFreshFor} hrs. FoodConnect Bharat`;

    if (isBhandara) {
      whatsappShareText = `🍽️ BHANDARA ALERT: ${bhandaraName || 'Community Prasad Distribution'}! Join us for ${foodType} at ${location.address}. Expected for ${expectedCrowd || 'everyone'}. Jai Bharat! - FoodConnect Bharat`;
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
      ingredientsUsed,
      location,
      preparedAt,
      estimatedFreshFor,
      expiryTime,
      karmaValue,
      whatsappShareText,
      bhandaraName,
      bhandaraStartTime,
      bhandaraEndTime,
      expectedCrowd
    });

    const saved = await newDonation.save();
    
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

// NGO-Only route to manually claim
router.patch('/:id/assign-ngo', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ error: 'Only NGOs can claim donations this way.' });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    if (donation.status !== 'available') return res.status(400).json({ error: 'Donation not available' });

    donation.assignedToNgo = req.user.id;
    donation.status = 'claimed_pending_approval'; // Or a specific status for NGO assignment
    await donation.save();

    res.json({ message: 'Donation assigned to your NGO', donation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign donation' });
  }
});

// Volunteer-Only Verification Route
router.patch('/:id/verify', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ error: 'Only volunteers can verify food.' });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    if (donation.verifiedByVolunteer) return res.status(400).json({ error: 'This donation is already verified.' });

    donation.verifiedByVolunteer = req.user.id;
    // Potentially add image check here if needed (e.g., if (req.body.foodImages) donation.foodImages = req.body.foodImages)
    if (req.body.foodImages && Array.isArray(req.body.foodImages)) {
      donation.foodImages = req.body.foodImages;
    }
    await donation.save();

    // Award +5 Karma score to the volunteer
    await User.findByIdAndUpdate(req.user.id, { $inc: { karmaScore: 5 } });

    res.json({ message: 'Verified successfully! +5 Karma added to your profile.', donation });
  } catch (error) {
    res.status(500).json({ error: 'Server error during verification.' });
  }
});

// NGO Inventory Management (Phase 10)
router.get('/inventory', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') return res.status(403).json({ error: 'Denied' });
    const inventory = await Donation.find({ assignedToNgo: req.user.id }).populate('donorId');
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

router.patch('/:id/assign-volunteer', requireAuth, async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const donation = await Donation.findById(req.params.id);
    if (!donation || donation.assignedToNgo?.toString() !== req.user.id) {
       return res.status(403).json({ error: 'Unauthorized or not in inventory.' });
    }
    donation.volunteerId = volunteerId;
    donation.status = 'assigned_to_volunteer';
    await donation.save();
    res.json({ message: 'Assigned successfully', donation });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign' });
  }
});

// GET ASSIGNED DONATIONS (for Volunteers/NGOs)
router.get('/assigned', requireAuth, async (req, res) => {
  try {
    const { role, id } = req.user;
    const filter = role === 'ngo' 
      ? { assignedToNgo: id, status: { $ne: 'completed' } }
      : { volunteerId: id, status: { $ne: 'completed' } };
      
    const donations = await Donation.find(filter).populate('donorId').sort({ updatedAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assigned donations' });
  }
});

export default router;
