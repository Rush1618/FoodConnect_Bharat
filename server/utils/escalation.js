import { Donation } from '../models/Donation.js';
import { Request } from '../models/Request.js';
import { User } from '../models/User.js';
import { calculateUrgencyScore } from './urgency.js';

function getDistance(lat1, lon1, lat2, lon2) {
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  return 12742 * Math.asin(Math.sqrt(a));
}

/**
 * Phase 2: Ultra Emergency Escalation Engine
 * Handles Critical Surplus Expiry and Long-Pending Hunger Relief
 */
export async function processEscalations() {
  try {
    const ngos = await User.find({ role: 'ngo' });
    if (ngos.length === 0) return;

    // 1. Surplus Food Escalation (Critical Freshness)
    const criticalDonations = await Donation.find({ status: 'available' });
    for (const d of criticalDonations) {
      // Use the new 100-point score for ultra emergency detection (>80)
      const score = calculateUrgencyScore(d, 5, true); // Simulated params for check
      
      if (score >= 80) {
        let bestNgo = null, minDist = 15;
        ngos.forEach(ngo => {
          const dist = getDistance(d.location.lat, d.location.lng, ngo.location.lat, ngo.location.lng);
          if (dist < minDist) { minDist = dist; bestNgo = ngo; }
        });

        if (bestNgo) {
          d.assignedToNgo = bestNgo._id;
          d.status = 'claimed_pending_approval';
          await d.save();
          console.log(`[ESCALATION] Food Surrender: ${d.foodType} auto-assigned to ${bestNgo.name}`);
        }
      }
    }

    // 2. Hunger Request Escalation (Long-Pending)
    const pendingRequests = await Request.find({ status: 'pending' });
    for (const r of pendingRequests) {
      const hoursAgo = (Date.now() - new Date(r.createdAt).getTime()) / 3600000;
      
      if (hoursAgo >= 4 || r.isSOS) {
        // High priority escalation to nearest NGO
        let bestNgo = null, minDist = 20;
        ngos.forEach(ngo => {
          const dist = getDistance(r.location.lat, r.location.lng, ngo.location.lat, ngo.location.lng);
          if (dist < minDist) { minDist = dist; bestNgo = ngo; }
        });

        if (bestNgo) {
          // Alert NGO (Marking the request with a flag for specific NGO visibility)
          r.escalatedToNgo = bestNgo._id;
          await r.save();
          console.log(`[ESCALATION] Hunger Emergency: ${r.numberOfPeople} people need help, escalated to ${bestNgo.name}`);
        }
      }
    }

  } catch (err) {
    console.error('[ESCALATION] Critical Failure:', err);
  }
}
