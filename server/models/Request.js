import { Schema, model } from 'mongoose';

const requestSchema = new Schema(
  {
    neederId: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // Null for anonymous SOS
    dietaryPref: { 
      type: String, 
      enum: ['veg', 'jain', 'nonveg', 'any'],
      required: true
    },
    numberOfPeople: { type: Number, required: true },
    isAnonymous: { type: Boolean, default: false },
    isSOS: { type: Boolean, default: false },
    allergiesToAvoid: { type: [String], default: [] },
    allergyNotes: { type: String, default: '' },
    status: { 
      type: String, 
      enum: ['pending', 'matched', 'fulfilled'],
      default: 'pending'
    },
    matchedDonationId: { type: Schema.Types.ObjectId, ref: 'Donation', default: null },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  { timestamps: true }
);

export const Request = model('Request', requestSchema);
