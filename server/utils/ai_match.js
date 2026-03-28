import { Donation } from '../models/Donation.js';
import { Request } from '../models/Request.js';
import { isFullyCompatible } from './matching.js';

export const runMatchCycle = async () => {
  console.log('🤖 AI Match Cycle: Starting scan...');
  try {
    const pendingRequests = await Request.find({ status: 'pending' }).populate('neederId');
    const availableDonations = await Donation.find({ status: 'available' }).populate('donorId');

    if (pendingRequests.length === 0 || availableDonations.length === 0) {
      console.log('🤖 AI Match Cycle: No active pairs to match.');
      return;
    }

    let matchesFound = 0;

    for (const req of pendingRequests) {
      // Find first compatible donation
      const match = availableDonations.find(don => isFullyCompatible(req, don, 5));

      if (match) {
        console.log(`✨ AI MATCH: Request ${req._id} matched with Donation ${match._id}`);
        
        // Update states
        req.status = 'matched';
        req.matchedDonationId = match._id;
        
        match.status = 'claimed_pending_approval';
        // Auto-assign to the needer if it's a direct match?
        // Actually, let's keep it 'claimed' so the donor still sees it as a claim to approve.
        
        await req.save();
        await match.save();
        
        // Remove from current pool so it doesn't match twice in same cycle
        const idx = availableDonations.indexOf(match);
        if (idx > -1) availableDonations.splice(idx, 1);
        
        matchesFound++;
      }
    }

    console.log(`🤖 AI Match Cycle complete. Matches found: ${matchesFound}`);
  } catch (err) {
    console.error('❌ AI Match Cycle Error:', err.message);
  }
};
