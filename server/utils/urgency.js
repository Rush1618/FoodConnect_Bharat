export function calculateUrgency(preparedAt, estimatedFreshFor, expiryTime) {
  const deadline = new Date(Math.min(
    new Date(preparedAt).getTime() + (estimatedFreshFor || 12) * 3600000,
    new Date(expiryTime).getTime()
  ));
  const h = (deadline - Date.now()) / 3600000;
  if (h <= 0) return 'expired';
  if (h <= 2) return 'critical';
  if (h <= 8) return 'moderate';
  return 'stable';
}

export function getTimeLeftString(preparedAt, estimatedFreshFor, expiryTime) {
  const deadline = new Date(Math.min(
    new Date(preparedAt).getTime() + (estimatedFreshFor || 12) * 3600000,
    new Date(expiryTime).getTime()
  ));
  const h = (deadline - Date.now()) / 3600000;
  if (h <= 0) return 'Expired';
  if (h < 1) return `${Math.max(1, Math.round(h * 60))} mins left`;
  if (h < 24) return `${Math.round(h)} hrs left`;
  return `${Math.round(h / 24)} days left`;
}

/**
 * Phase 1.5: Advanced Urgency Score (0-100)
 * Logic: Freshness (40), Proximity to Hunger (40), SOS Presence (20)
 */
export function calculateUrgencyScore(donation, nearbyRequestsCount = 0, hasNearbySOS = false) {
  let score = 0;
  
  // 1. Freshness (40 pts)
  const totalLife = (donation.estimatedFreshFor || 12);
  const deadline = new Date(Math.min(
    new Date(donation.preparedAt).getTime() + totalLife * 3600000,
    new Date(donation.expiryTime).getTime()
  ));
  const hoursLeft = (deadline - Date.now()) / 3600000;
  
  if (hoursLeft > 0) {
    // Inverse freshness (less time = more urgent)
    const freshPenalty = Math.max(0, 40 - (hoursLeft / totalLife) * 40);
    score += freshPenalty;
  } else {
    return 0; // Expired
  }

  // 2. Proximity to Hunger (40 pts)
  // Assume 10+ people waiting nearby = max 40 points
  const hungerScore = Math.min(40, nearbyRequestsCount * 4);
  score += hungerScore;

  // 3. SOS Presence (20 pts)
  if (hasNearbySOS) {
    score += 20;
  }

  return Math.min(100, Math.round(score));
}
