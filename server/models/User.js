import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['donor', 'needer', 'volunteer', 'ngo'], 
      required: true 
    },
    dietaryPref: { 
      type: String, 
      enum: ['veg', 'jain', 'nonveg', 'any'],
      default: 'any'
    },
    allergyProfile: {
      type: [String],
      default: []
    },
    allergyNotes: {
      type: String,
      default: ''
    },
    karmaScore: { type: Number, default: 0 },
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 }
    },
    institution: { 
      type: String, 
      default: '',
      enum: ['NSS', 'GC', 'DLLE', 'Individual', 'Corporate', 'NGO', '']
    },
    donorType: { 
      type: String, 
      default: 'individual',
      enum: ['individual', 'restaurant', 'banquet', 'corporate', 'temple', 'college_mess']
    },
    deliveryCount: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    lastDeliveryDate: { type: Date, default: null },
    lastNudgedAt: { type: Date, default: null },
    badgeLevel: { 
      type: String, 
      default: 'none',
      enum: ['none', 'bronze', 'silver', 'gold', 'champion']
    },
    carbonSaved: { type: Number, default: 0 },
    trustedDonorScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const User = model('User', userSchema);
