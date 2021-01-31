import jwt from 'jsonwebtoken';
import { roles } from '../settings';
import User from '../models/user.model';
import Restaurant from '../models/restaurant.model';
import Review from '../models/review.model';
import { calculateRating, statusCodes } from '../helpers/helpers';

/**
 * when user get deleted, user's tokens remains available,
 * and user can perform actions until token expires.
 * To prevent this, implemented tokenHash which saves all
 * the tokens of user. This can further be improved by implementing
 * Reddis or Memecached.
 */
export const tokenHash = {};

export const verifyToken = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers.authorization;
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;

    jwt.verify(bearerToken, process.env.SECRET_KEY, (error, decoded) => {
      if (!tokenHash[decoded.user._id] || error) {
        res.status(401).json(statusCodes[401]);
      } else {
        req.decoded = decoded;
        // Next middleware
        next();
      }
    });
  } else {
    // Forbidden
    res.sendStatus(403);
  }
};

// To verify if the user is priviliged to perform particual action

export const verifyPermission = (role) => (req, res, next) => {
  if (role.includes(req.decoded.user.role)) {
    next();
  } else {
    res.status(403).json(statusCodes[403]);
  }
};

// deletes a user and passes user_id in req;

export const userDelete = async (req, res, next) => {
  const {
    params: { user_id },
  } = req;
  try {
    await User.deleteOne({ _id: user_id });
    delete tokenHash[user_id];
    const reviews = await Review.find({ 'author.id': user_id });
    await Review.deleteMany({ 'author.id': user_id });

    for (let i = 0; i < reviews.length; i += 1) {
      const review = reviews[i];
      const restaurant = await Restaurant.findOne({
        _id: review.restaurant_id,
      });
      restaurant.bulk_rating -= review.rating;
      restaurant.reviews.count -= 1;
      restaurant.reviews.pending_reply -= review.reply.message ? 0 : 1;
      restaurant.rating =
        restaurant.reviews.count === 0
          ? 0
          : calculateRating(restaurant.bulk_rating, restaurant.reviews.count);
      await restaurant.save();
    }

    req.user_id = user_id;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error, loc: 'user' });
  }
};

// deletes restaurant and passes restaurants in req

export const restaurantDelete = async (req, res, next) => {
  const {
    params: { restaurant_id },
    user_id,
  } = req;
  try {
    if (restaurant_id) {
      await Restaurant.deleteOne({ _id: restaurant_id });
      req.restaurants = [restaurant_id];
    } else if (req.user_id) {
      const restaurants = await Restaurant.find({ owner_id: user_id }).distinct(
        '_id'
      );
      await Restaurant.deleteMany({ _id: { $in: restaurants } });
      req.restaurants = restaurants;
    }
    next();
  } catch (error) {
    res.status(400).json({ message: error, loc: 'rest' });
  }
};

// deletes reviews and passes restaurant and review in req

export const reviewDelete = async (req, res, next) => {
  const {
    params: { review_id },
    restaurants,
  } = req;

  try {
    if (review_id) {
      const review = await Review.findOne({ _id: review_id });
      const restaurant = await Restaurant.findOne({
        _id: review.restaurant_id,
      });
      restaurant.reviews.count -= 1;
      restaurant.reviews.pending_reply -= review.reply.message ? 0 : 1;
      restaurant.bulk_rating -= review.rating;
      restaurant.rating =
        restaurant.reviews.count === 0
          ? 0
          : calculateRating(restaurant.bulk_rating, restaurant.reviews.count);
      const newRestaurant = await restaurant.save();
      await Review.deleteOne({ _id: review_id });
      req.restaurant = newRestaurant;
      req.review = review;
    } else if (restaurants) {
      await Review.deleteMany({ restaurant_id: { $in: restaurants } });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: error, loc: 'review' });
  }
};

// it handles the pagination and creates valid query;

export const handlePagination = async (req, res, next) => {
  const { role, _id: owner_id } = req.decoded.user;
  let { filterVal, pagination = 1 } = req.query;
  filterVal = +filterVal;
  pagination = +pagination;
  filterVal =
    Number.isNaN(filterVal) || typeof filterVal !== 'number' ? 0 : filterVal;
  pagination =
    pagination <= 0 || typeof pagination !== 'number' ? 1 : pagination;
  let query = {};
  if (filterVal) {
    query.rating = { $gte: filterVal, $lte: 5 };
  }
  if (role === roles.owner) query.owner_id = owner_id;
  req.paginationQuery = query;
  req.pagination = pagination;
  next();
};

/**
 *
 * if user sends invalid objectId in request, it fails.
 * To prevent this we have to check if it is a valid.
 */
export const handleValidId = (idType, isQuery = false) => (req, res, next) => {
  let params = isQuery ? req.query : req.params;
  if (params[idType].match(/^[0-9a-fA-F]{24}$/)) {
    next();
  } else {
    res.status(404).json(statusCodes[404]);
  }
};
