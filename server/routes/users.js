import express from 'express';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.patch('/allergy-profile', requireAuth, async (req, res) => {
  try {
    const { allergyProfile, allergyNotes } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Only update if provided
    if (allergyProfile !== undefined) user.allergyProfile = allergyProfile;
    if (allergyNotes !== undefined) user.allergyNotes = allergyNotes;

    await user.save();

    res.json({
      message: 'Allergy profile updated',
      allergyProfile: user.allergyProfile,
      allergyNotes: user.allergyNotes
    });
  } catch (error) {
    console.error('Update allergy profile error:', error);
    res.status(500).json({ error: 'Failed to update allergy profile' });
  }
});

// Public Leaderboard: Top 5 by karmaScore
router.get('/leaderboard', async (req, res) => {
  try {
    const heroes = await User.find({}, 'name karmaScore badgeLevel carbonSaved')
      .sort({ karmaScore: -1 })
      .limit(5);
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
