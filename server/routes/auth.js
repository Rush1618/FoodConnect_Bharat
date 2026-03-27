import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, role, dietaryPref, allergyProfile, allergyNotes } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this phone already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      name,
      phone,
      password: hashedPassword,
      role,
      dietaryPref,
      allergyProfile,
      allergyNotes
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        role: newUser.role,
        allergyProfile: newUser.allergyProfile
      }
    });

  } catch (error) {
    console.error('Registration Error', error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid phone or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        allergyProfile: user.allergyProfile
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});


// GET all NGOs
router.get('/ngos', async (req, res) => {
  try {
    const ngos = await User.find({ role: 'ngo' }).select('name phone _id');
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch NGOs' });
  }
});

// ── Demo account seeder ────────────────────────────────
const DEMO_USERS = [
  { name: 'Demo Donor', phone: '9000000001', password: 'demo123', role: 'donor', dietaryPref: 'any', allergyProfile: [] },
  { name: 'Demo Needer', phone: '9000000002', password: 'demo123', role: 'needer', dietaryPref: 'veg', allergyProfile: ['peanuts', 'milk'] },
  { name: 'Demo NGO', phone: '9000000003', password: 'demo123', role: 'ngo', dietaryPref: 'any', allergyProfile: [] },
  { name: 'Demo Volunteer', phone: '9000000004', password: 'demo123', role: 'volunteer', dietaryPref: 'any', allergyProfile: [] },
];

router.post('/seed-demo', async (_req, res) => {
  try {
    const created = [];
    for (const u of DEMO_USERS) {
      const exists = await User.findOne({ phone: u.phone });
      if (!exists) {
        const hashed = await bcrypt.hash(u.password, 10);
        await new User({ ...u, password: hashed }).save();
        created.push(u.name);
      }
    }
    res.json({ message: created.length ? `Seeded: ${created.join(', ')}` : 'Demo accounts already exist' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

