import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dns from 'dns';
import bcrypt from 'bcryptjs';

// Force Node.js to use Google DNS to bypass aggressive Wi-Fi/Antivirus SRV blocking
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

// Routes
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import donationsRoutes from './routes/donations.js';
import requestsRoutes from './routes/requests.js';
import impactRoutes from './routes/impact.js';
import { User } from './models/User.js';
import { processEscalations } from './utils/escalation.js';
import { runMatchCycle } from './utils/ai_match.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Phase 1: Real-time Delivery Relay
  socket.on('delivery_location_update', (data) => {
    // Broadcast to all other connected clients
    socket.broadcast.emit('location_update', {
      id: socket.id,
      ...data,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Notify clients that this delivery boy is offline
    io.emit('delivery_offline', { id: socket.id });
  });
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/system', impactRoutes);

// ── Auto-seed demo accounts ────────────────────────────
const DEMO_USERS = [
  { name: 'Demo Donor',     phone: '9000000001', password: 'demo123', role: 'donor',     dietaryPref: 'any', allergyProfile: [] },
  { name: 'Demo Needer',    phone: '9000000002', password: 'demo123', role: 'needer',    dietaryPref: 'veg', allergyProfile: ['peanuts', 'milk'] },
  { name: 'Demo NGO',       phone: '9000000003', password: 'demo123', role: 'ngo',       dietaryPref: 'any', allergyProfile: [] },
  { name: 'Demo Volunteer', phone: '9000000004', password: 'demo123', role: 'volunteer', dietaryPref: 'any', allergyProfile: [] },
];

const seedDemoAccounts = async () => {
  for (const u of DEMO_USERS) {
    const exists = await User.findOne({ phone: u.phone });
    if (!exists) {
      const hashed = await bcrypt.hash(u.password, 10);
      await new User({ ...u, password: hashed }).save();
      console.log(`[seed] Created: ${u.name}`);
    }
  }
};

// ── Database connection ────────────────────────────────
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/foodconnect';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
    await seedDemoAccounts();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
  
  // Run escalation every hour: 3600000ms
  setInterval(processEscalations, 3600000);
  
  // Run AI Match Center every 1 minute: 60000ms
  setInterval(runMatchCycle, 60000);
});

// Trigger restart
