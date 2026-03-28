import { ALLERGEN_LIST } from '../constants/allergens.js';

/**
 * Haversine formula for backend distance calculation
 */
export function getDistance(lat1, lon1, lat2, lon2) {
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  return 12742 * Math.asin(Math.sqrt(a));
}

export function isFullyCompatible(request, donation, maxDistKm = 5) {
  const { dietaryPref, allergiesToAvoid = [], numberOfPeople = 1, location: rLoc } = request;
  const { foodType, ingredientsUsed = [], quantity, location: dLoc, urgencyScore } = donation;

  // 1. Dietary Pref Check
  if (dietaryPref === 'jain' && foodType !== 'jain') return false;
  if (dietaryPref === 'veg' && foodType === 'nonveg') return false;
  
  // 2. Freshness Check
  if (urgencyScore === 'expired') return false;

  // 3. Allergen Check
  for (const allergenId of allergiesToAvoid) {
    if (ingredientsUsed.includes(allergenId)) return false;
  }

  // 4. Distance Check
  if (rLoc && dLoc) {
    const dist = getDistance(rLoc.lat, rLoc.lng, dLoc.lat, dLoc.lng);
    if (dist > maxDistKm) return false;
  }

  // 5. Quantity Check (Simple parsing)
  const dQty = parseInt(quantity) || 0;
  if (dQty > 0 && dQty < numberOfPeople) return false;

  return true;
}

export function getAllergenWarnings(allergiesToAvoid = [], donation) {
  if (!allergiesToAvoid.length) return [];
  return allergiesToAvoid
    .filter(id => donation.ingredientsUsed.includes(id))
    .map(id => ALLERGEN_LIST.find(a => a.id === id)?.label)
    .filter(Boolean);
}
