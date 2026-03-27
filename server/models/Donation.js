import { Schema, model } from 'mongoose';
import { calculateUrgency } from '../utils/urgency.js';

const donationSchema = new Schema(
  {
    donorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    foodType: { 
      type: String, 
      enum: ['veg', 'jain', 'nonveg'],
      required: true
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
    preparedAt: { type: Date, required: true },
    estimatedFreshFor: { type: Number, required: true, min: 1, max: 72 },
    expiryTime: { type: Date },
    urgencyScore: { 
      type: String, 
      enum: ['critical', 'moderate', 'stable', 'expired']
    },
    status: { 
      type: String, 
      enum: ['available', 'claimed', 'completed'],
      default: 'available'
    },
    volunteerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    whatsappShareText: { type: String }
  },
  { timestamps: true }
);

donationSchema.pre(/^find/, function(next) {
  // We can't actually update in a query pre-find easily without mutating the DB manually or 
  // doing it post-find or a virtual. But to keep consistent, we could use a virtual field, 
  // or we map over results after fetching. A pre-save helps during creation.
  next();
});

donationSchema.pre('save', function(next) {
  // If expiryTime is missing, infer it roughly
  if (!this.expiryTime) {
    this.expiryTime = new Date(this.preparedAt.getTime() + this.estimatedFreshFor * 3600000);
  }
  this.urgencyScore = calculateUrgency(this.preparedAt, this.estimatedFreshFor, this.expiryTime);
  next();
});

export const Donation = model('Donation', donationSchema);
