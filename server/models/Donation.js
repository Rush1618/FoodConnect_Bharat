import { Schema, model } from 'mongoose';
import { calculateUrgency } from '../utils/urgency.js';

const donationSchema = new Schema(
  {
    donorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    donorCategory: { type: String, enum: ['family', 'restaurant', 'ngo', 'individual'], default: 'individual' },
    assignedToNgo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    foodType: { 
      type: String, 
      enum: ['veg', 'jain', 'nonveg'],
      required: true
    },
    foodCategory: {
      type: String,
      enum: ['baked', 'ready-to-eat', 'packed'],
      default: 'ready-to-eat'
    },
    isBhandara: { type: Boolean, default: false },
    quantity: { type: String, required: true },
    description: { type: String, required: true, minlength: 10 },
    containsOnionGarlic: { type: Boolean, default: false },
    ingredientsUsed: { type: [String], default: [] },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true }
    },
    preparedAt: { type: Date },
    estimatedFreshFor: { type: Number, min: 1, max: 72 },
    expiryTime: { type: Date },
    urgencyScore: { 
      type: String, 
      enum: ['critical', 'moderate', 'stable', 'expired']
    },
    status: { 
      type: String, 
      enum: ['available', 'claimed_pending_approval', 'approved_for_pickup', 'approved_for_delivery', 'assigned_to_volunteer', 'completed'],
      default: 'available'
    },
    volunteerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    whatsappShareText: { type: String }
  },
  { timestamps: true }
);


donationSchema.pre('save', function(next) {
  // If expiryTime is missing, infer it roughly
  if (!this.expiryTime && this.preparedAt && this.estimatedFreshFor) {
    this.expiryTime = new Date(this.preparedAt.getTime() + this.estimatedFreshFor * 3600000);
  }
  if (!this.expiryTime) {
    this.expiryTime = new Date(Date.now() + 24 * 3600000);
  }
  const refTime = this.preparedAt || new Date();
  this.urgencyScore = calculateUrgency(refTime, this.estimatedFreshFor || 24, this.expiryTime);
  next();
});

export const Donation = model('Donation', donationSchema);
