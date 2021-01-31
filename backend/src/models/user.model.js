import mongoose from 'mongoose';

const { Schema } = mongoose;

// 1 - admin
// 2 - owner
// 3 - regular user

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
      enum: [1, 2, 3],
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
