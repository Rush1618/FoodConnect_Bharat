import express from 'express';
import { Donation } from '../models/Donation.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { calculateUrgency, getTimeLeftString } from '../utils/urgency.js';
import { isFullyCompatible, getAllergenWarnings } from '../utils/matching.js';
import { ALLERGEN_LIST } from '../constants/allergens.js';

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { dietPref, avoidAllergens, status = 'available' } = req.query;
    
    // Parse allergens
    const avoidList = avoidAllergens ? avoidAllergens.split(',') : [];

    // Find all matching initial status
    const filter = { status };
    const donations = await Donation.find(filter).populate('donorId', 'name phone').sort({ createdAt: -1 });

    const filteredDonations = donations.filter(donation => {
      // Recalculate urgency score on the fly
      donation.urgencyScore = calculateUrgency(donation.preparedAt, donation.estimatedFreshFor, donation.expiryTime);

      // Check fully compatible
      return isFullyCompatible(dietPref || 'any', avoidList, donation);
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
    const { foodType, isBhandara, quantity, description, ingredientsUsed, location, preparedAt, estimatedFreshFor } = req.body;

    // Jain validation
    if (foodType === 'jain') {
      if (ingredientsUsed?.includes('onion') || ingredientsUsed?.includes('garlic')) {
        return res.status(400).json({ error: 'Jain food cannot contain onion or garlic.' });
      }
    }

    const expiryTime = new Date(new Date(preparedAt).getTime() + estimatedFreshFor * 3600000);
    const urgencyScore = calculateUrgency(preparedAt, estimatedFreshFor, expiryTime);

    // Auto-generate ingredients summary string for WhatsApp
    let topAllergens = 'none';
    if (ingredientsUsed && ingredientsUsed.length > 0) {
      topAllergens = ingredientsUsed.slice(0, 4)
        .map(id => ALLERGEN_LIST.find(a => a.id === id)?.label || id)
        .join(', ');
    }
    
    const whatsappShareText = 
      `Free food near ${location.address}! ${foodType.toUpperCase()} — ${quantity}
Contains: ${topAllergens}
Good for ~${estimatedFreshFor} more hours.
FoodConnect Bharat 🍛`;

    const newDonation = new Donation({
      donorId: req.user.id,
      foodType,
      isBhandara,
      quantity,
      description,
      containsOnionGarlic: ingredientsUsed?.includes('onion') || ingredientsUsed?.includes('garlic'),
      ingredientsUsed,
      location,
      preparedAt,
      estimatedFreshFor,
      expiryTime,
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

export default router;
