import mongoose from 'mongoose';
import { roles } from '../settings';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      validate: /^[a-z0-9]*$/,
    },
    role: {
      type: Number,
      enum: [roles.owner, roles.customer],
      required: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 6,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('users', userSchema);
