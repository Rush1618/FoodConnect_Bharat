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
      enum: ['pending', 'approved_for_pickup', 'approved_for_delivery', 'assigned_to_volunteer', 'completed'],
      default: 'pending'
    },
    matchedDonationId: { type: Schema.Types.ObjectId, ref: 'Donation', default: null },
    linkedDonation: { type: Schema.Types.ObjectId, ref: 'Donation', default: null },
    deliveryMethod: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  { timestamps: true }
);

export const Request = model('Request', requestSchema);
