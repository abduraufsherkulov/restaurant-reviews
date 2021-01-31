import { Router } from 'express';
import Review from '../models/review.model';
import Restaurant from '../models/restaurant.model';
import { roles } from '../settings';
import {
  handleValidId,
  reviewDelete,
  verifyPermission,
  verifyToken,
} from '../middlewares/middlewares';
import { calculateRating, errorHandler, statusCodes } from '../helpers/helpers';

const reviewRouter = Router();

const canSeeReviews = async (req, res, next) => {
  const {
    decoded: { user },
    query: { restaurant_id },
  } = req;

  if (!restaurant_id)
    return res.status(400).json({ message: 'restaurant_id is required' });
  try {
    const restaurant = await Restaurant.findOne({ _id: restaurant_id });
    if (
      restaurant.owner_id === user._id ||
      [roles.customer, roles.admin].includes(user.role)
    ) {
      next();
    } else {
      res.status(403).json(statusCodes[403]);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all reviews

reviewRouter.get(
  '/',
  verifyToken,
  handleValidId('restaurant_id', true),
  canSeeReviews,
  async (req, res) => {
    const { restaurant_id } = req.query;
    try {
      const reviews = await Review.find({ restaurant_id }).sort('-createdAt');
      res.send(reviews);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Add a review

reviewRouter.post(
  '/',
  verifyToken,
  verifyPermission([roles.customer]),
  handleValidId('restaurant_id', true),
  async (req, res) => {
    const {
      body: { comment, rating, date },
      query: { restaurant_id },
      decoded: {
        user: { _id, username },
      },
    } = req;
    try {
      const newReview = new Review({
        comment,
        rating,
        date: new Date(date).getTime(),
        restaurant_id,
        author: { id: _id, name: username },
      });

      await newReview.save();
      const reviews = await Review.find({ restaurant_id }).sort('-createdAt');
      const restaurant = await Restaurant.findOne({ _id: restaurant_id });
      if (!restaurant) {
        return res.status(404).send(statusCodes[404]);
      }
      restaurant.bulk_rating += rating;
      restaurant.reviews.count += 1;
      restaurant.reviews.pending_reply += 1;
      restaurant.rating = calculateRating(
        restaurant.bulk_rating,
        restaurant.reviews.count
      );
      await restaurant.save();
      res.send({
        message: `Review has successfully been added`,
        data: {
          reviews,
          restaurant,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(errorHandler(error, true));
    }
  }
);

// Add a reply

reviewRouter.post(
  '/reply',
  verifyToken,
  verifyPermission([roles.owner]),
  handleValidId('review_id', true),
  async (req, res) => {
    const {
      body: { reply },
      query: { review_id },
      decoded: {
        user: { _id, username },
      },
    } = req;

    if (!review_id) {
      return res.status(400).send({ message: 'review_id is required' });
    }

    try {
      const review = await Review.findOne({ _id: review_id });

      if (review.reply.message) {
        return res
          .status(400)
          .send({ message: 'You have already replied to this review' });
      }

      review.reply.message = reply;
      review.reply.date = new Date();
      review.reply.author.id = _id;
      review.reply.author.name = username;
      const newReview = await review.save();
      const restaurant = await Restaurant.findOne({
        _id: newReview.restaurant_id,
      });
      restaurant.reviews.pending_reply -= 1;
      const newRestaurant = await restaurant.save();

      res.send({
        message: `Reply has successfully been added`,
        data: {
          review: newReview,
          restaurant: newRestaurant,
        },
      });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
);

// Delete a review

reviewRouter.delete(
  '/:review_id',
  verifyToken,
  verifyPermission([roles.admin]),
  handleValidId('review_id'),
  reviewDelete,
  async (req, res) => {
    const { restaurant, review } = req;
    res.send({
      message: 'Review has successfully been deleted',
      data: { restaurant, review },
    });
  }
);

// Update a review

reviewRouter.put(
  '/:review_id',
  verifyToken,
  verifyPermission([roles.admin]),
  handleValidId('review_id'),
  async (req, res) => {
    const {
      body: { comment, rating },
      params: { review_id },
    } = req;

    try {
      const review = await Review.findOne({ _id: review_id });
      const restaurant = await Restaurant.findOne({
        _id: review.restaurant_id,
      });
      restaurant.bulk_rating = restaurant.bulk_rating - review.rating + rating;
      restaurant.rating = calculateRating(
        restaurant.bulk_rating,
        restaurant.reviews.count
      );
      review.comment = comment;
      review.rating = rating;
      review.reply.edited = true;
      const newReview = await review.save();
      const newRestaurant = await restaurant.save();

      res.send({
        message: `Review has successfully been updated`,
        data: {
          review: newReview,
          restaurant: newRestaurant,
        },
      });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
);

export default reviewRouter;
