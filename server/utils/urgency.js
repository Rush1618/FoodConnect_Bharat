export const calculateUrgency = (preparedAt, estimatedFreshFor, expiryTime) => {
  const prepared = new Date(preparedAt);
  const expiry = new Date(expiryTime);
  const freshUntilByDonor = new Date(prepared.getTime() + estimatedFreshFor * 3600000);
  
  // Use the more conservative of the two time estimates
  const earlierDeadline = new Date(Math.min(freshUntilByDonor.getTime(), expiry.getTime()));
  const now = new Date();
  const hoursLeft = (earlierDeadline.getTime() - now.getTime()) / 3600000;

  if (hoursLeft <= 0) return 'expired';
  if (hoursLeft <= 2) return 'critical';
  if (hoursLeft <= 8) return 'moderate';
  return 'stable';
};

export const getTimeLeftString = (hoursLeft) => {
  if (hoursLeft <= 0) return "Expired";
  if (hoursLeft < 1) return `${Math.round(hoursLeft * 60)} mins left`;
  if (hoursLeft < 24) return `${Math.round(hoursLeft)} hrs left`;
  return `${Math.round(hoursLeft / 24)} days left`;
};
