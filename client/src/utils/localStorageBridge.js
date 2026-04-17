/**
 * FoodConnect Prototype LocalStorage Bridge
 * 
 * Provides persistence for demo-only interactive features like:
 * - Donor-marked hunger spots
 * - Local-only demo injections
 * - Volunteer verification state (locally mirrored)
 */

const KEYS = {
  HUNGER_SPOTS: 'fc_hunger_spots',
  DEMO_INJECTIONS: 'fc_demo_injections',
  INVITE_CODES: 'fc_volunteer_invites'
};

export const localStorageBridge = {
  // --- Hunger Spots ---
  getHungerSpots: () => {
    const data = localStorage.getItem(KEYS.HUNGER_SPOTS);
    return data ? JSON.parse(data) : [];
  },

  addHungerSpot: (spot) => {
    const spots = localStorageBridge.getHungerSpots();
    const newSpot = {
      id: `spot_${Date.now()}`,
      status: 'pending', // pending -> confirmed
      reportedAt: new Date().toISOString(),
      verifiedAt: null,
      ...spot
    };
    spots.push(newSpot);
    localStorage.setItem(KEYS.HUNGER_SPOTS, JSON.stringify(spots));
    return newSpot;
  },

  confirmHungerSpot: (id, volunteerId) => {
    const spots = localStorageBridge.getHungerSpots();
    const spot = spots.find(s => s.id === id);
    if (spot) {
      spot.status = 'confirmed';
      spot.verifiedAt = new Date().toISOString();
      spot.verifiedBy = volunteerId;
      localStorage.setItem(KEYS.HUNGER_SPOTS, JSON.stringify(spots));
    }
  },

  // --- Demo Injections (Local only markers) ---
  getInjectedRecords: (type) => {
    const data = localStorage.getItem(KEYS.DEMO_INJECTIONS);
    const all = data ? JSON.parse(data) : { donations: [], requests: [] };
    return type ? (all[type] || []) : all;
  },

  injectDemoRecord: (type, record) => {
    const all = localStorageBridge.getInjectedRecords();
    all[type] = all[type] || [];
    all[type].push({
      _id: `demo_${Date.now()}`,
      isDemo: true,
      ...record
    });
    localStorage.setItem(KEYS.DEMO_INJECTIONS, JSON.stringify(all));
  },

  // --- Volunteer Invites ---
  generateInvite: (volunteerId) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const invites = JSON.parse(localStorage.getItem(KEYS.INVITE_CODES) || '[]');
    invites.push({ code, createdBy: volunteerId, createdAt: new Date().toISOString() });
    localStorage.setItem(KEYS.INVITE_CODES, JSON.stringify(invites));
    return code;
  },

  clearAll: () => {
    localStorage.removeItem(KEYS.HUNGER_SPOTS);
    localStorage.removeItem(KEYS.DEMO_INJECTIONS);
    localStorage.removeItem(KEYS.INVITE_CODES);
  }
};
