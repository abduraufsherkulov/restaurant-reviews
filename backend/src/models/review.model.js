import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    author: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
    },
    restaurant_id: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      min: new Date('01-01-2020').getTime(),
    },
    reply: {
      message: {
        type: String,
        minlength: 3,
        maxlength: 500,
        required: function () {
          return this.reply.date != null;
        },
      },
      date: {
        type: Date,
      },
      edited: {
        type: Boolean,
        default: false,
      },
      author: {
        id: {
          type: String,
          default: '',
        },
        name: {
          type: String,
          default: '',
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('reviews', reviewSchema);
