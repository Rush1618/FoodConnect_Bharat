import express from 'express';
import { Request } from '../models/Request.js';
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

export default router;
