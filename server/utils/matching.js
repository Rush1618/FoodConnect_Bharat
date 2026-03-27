import { ALLERGEN_LIST } from '../constants/allergens.js';

export const isFullyCompatible = (userDietPref, allergiesToAvoid, donation) => {
  // 1. Dietary check
  if (userDietPref === 'jain' && donation.foodType !== 'jain') return false;
  if (userDietPref === 'veg' && donation.foodType === 'nonveg') return false;

  // 2. Allergen check
  if (allergiesToAvoid && allergiesToAvoid.length > 0) {
    for (const allergenId of allergiesToAvoid) {
      if (donation.ingredientsUsed.includes(allergenId)) {
        return false;
      }
    }
  }

  // 3. Expiry check (calculated on latest urgencyScore)
  if (donation.urgencyScore === 'expired') return false;

  return true;
};

export const getAllergenWarnings = (allergiesToAvoid, donation) => {
  if (!allergiesToAvoid || allergiesToAvoid.length === 0) return [];

  const warnings = [];
  for (const allergenId of allergiesToAvoid) {
    if (donation.ingredientsUsed.includes(allergenId)) {
      const allergen = ALLERGEN_LIST.find(a => a.id === allergenId);
      if (allergen) {
        warnings.push(allergen.label);
      }
    }
  }
  return warnings;
};
