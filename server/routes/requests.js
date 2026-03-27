import express from 'express';
import { Request } from '../models/Request.js';
import { Donation } from '../models/Donation.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

router.post('/', optionalAuth, async (req, res) => {
  try {
    const { dietaryPref, numberOfPeople, isAnonymous, isSOS, allergiesToAvoid = [], allergyNotes, location } = req.body;
    let finalAllergies = allergiesToAvoid;
    let finalNotes = allergyNotes;

    // Optional override with user profile if logged in
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user && finalAllergies.length === 0) {
        finalAllergies = user.allergyProfile;
      }
      if (user && !finalNotes) {
        finalNotes = user.allergyNotes;
      }
    }

    const newRequest = new Request({
      neederId: req.user ? req.user.id : null,
      dietaryPref,
      numberOfPeople,
      isAnonymous,
      isSOS,
      allergiesToAvoid: finalAllergies,
      allergyNotes: finalNotes,
      location
    });

    const saved = await newRequest.save();

    res.status(201).json(saved);
  } catch (error) {
    console.error('Add Request error:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// GET requests (my requests OR all nearby pending)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { nearby } = req.query;

    if (nearby === 'true') {
      // Fetch all pending requests to show on map
      const requests = await Request.find({ status: 'pending' })
        .populate({ path: 'neederId', select: 'name phone role' })
        .sort({ createdAt: -1 });
      return res.json(requests);
    }

    // Default: fetch user's requests and requests claiming their donations (requireAuth logic)
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const userDonations = await Donation.find({ donorId: req.user.id }).select('_id');
    const donationIds = userDonations.map(d => d._id);

    const requests = await Request.find({
      $or: [
        { neederId: req.user.id },
        { linkedDonation: { $in: donationIds } }
      ]
    }).populate({
      path: 'linkedDonation',
      select: 'foodType quantity location description status'
    }).populate({
      path: 'neederId',
      select: 'name phone role'
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Fetch Requests error:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// APPROVE a claim
router.post('/:id/approve', requireAuth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('linkedDonation');
    if (!request) return res.status(404).json({ error: 'Request not found' });
    
    const donation = request.linkedDonation;
    if (!donation) return res.status(400).json({ error: 'Orphaned request' });

    // Verify ownership
    if (donation.donorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to approve this request' });
    }

    // Determine next step based on deliveryMethod
    if (request.deliveryMethod === 'delivery') {
      request.status = 'approved_for_delivery';
      donation.status = 'approved_for_delivery';
    } else {
      request.status = 'approved_for_pickup';
      donation.status = 'approved_for_pickup';
    }

    await request.save();
    await donation.save();

    res.json({ message: 'Request approved', request });
  } catch (error) {
    console.error('Approve Request error:', error);
    res.status(500).json({ error: 'Failed to approve request' });
  }
});

// ACCEPT DELIVERY (by Volunteer)
router.post('/:id/volunteer', requireAuth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('linkedDonation');
    if (!request || !request.linkedDonation) return res.status(404).json({ error: 'Request not found' });
    
    const donation = request.linkedDonation;

    if (request.status !== 'approved_for_delivery') {
      return res.status(400).json({ error: 'This request is not available for delivery' });
    }

    request.status = 'assigned_to_volunteer';
    donation.status = 'assigned_to_volunteer';
    donation.volunteerId = req.user.id;

    await request.save();
    await donation.save();

    res.json({ message: 'Delivery accepted successfully', request });
  } catch (error) {
    console.error('Volunteer Request error:', error);
    res.status(500).json({ error: 'Failed to accept delivery' });
  }
});

export default router;
