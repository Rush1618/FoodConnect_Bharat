import express from 'express';
import { Donation } from '../models/Donation.js';
import { Request } from '../models/Request.js';
import { getAIForecast } from '../utils/python_bridge.js';

const router = express.Router();

router.get('/impact', async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments({ status: { $ne: 'available' } });
    const totalRequests = await Request.countDocuments({ status: 'fulfilled' });
    const mealsFed = (totalDonations + totalRequests) * 2;
    res.json({
      mealsFed,
      carbonSaved: mealsFed * 0.5,
      peopleImpacted: (totalDonations + totalRequests) * 1.5,
      growth: [
        { month: 'Jan', count: 45 },
        { month: 'Feb', count: 82 },
        { month: 'Mar', count: 156 }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

router.get('/ai-forecast', async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments({ status: { $ne: 'available' } });
    const totalRequests = await Request.countDocuments({ status: 'fulfilled' });
    const mealsFed = (totalDonations + totalRequests) * 2;
    
    // Call Python AI Bridge
    const forecast = await getAIForecast({
      meals_fed: mealsFed,
      people_impacted: (totalDonations + totalRequests) * 1.5,
      co2_saved: mealsFed * 0.5,
      urgency_avg: 45 // Heuristic context
    });

    res.json(forecast);
  } catch (err) {
    console.error('AI Forecast error:', err);
    res.status(500).json({ error: 'AI Bridge Failed' });
  }
});

export default router;
