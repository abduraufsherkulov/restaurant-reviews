import mongoose from 'mongoose';

const { Schema } = mongoose;

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    bulk_rating: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviews: {
      pending_reply: {
        type: Number,
        default: 0,
        min: 0,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    owner_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('restaurants', restaurantSchema);
