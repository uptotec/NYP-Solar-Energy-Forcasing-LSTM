import { Schema, model, models } from 'mongoose';
import farmSchema from './farm';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },
    farm: {
      type: farmSchema,
      required: false,
    },
    userType: {
      type: String,
      required: true,
      enum: ['customer', 'admin'],
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = models.User || model('User', userSchema);

export default User;
