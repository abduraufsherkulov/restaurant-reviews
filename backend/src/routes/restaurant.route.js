import { Router } from 'express';
import Restaurant from '../models/restaurant.model';
import { roles } from '../settings';
import {
  handlePagination,
  handleValidId,
  restaurantDelete,
  reviewDelete,
  verifyPermission,
  verifyToken,
} from '../middlewares/middlewares';
import { errorHandler, statusCodes } from '../helpers/helpers';

const restaurantRouter = Router();

// Get a restaurant

restaurantRouter.get(
  '/:restaurant_id',
  verifyToken,
  handleValidId('restaurant_id'),
  async (req, res) => {
    const {
      params: { restaurant_id },
      decoded,
    } = req;
    const { role, _id } = decoded.user;
    try {
      const restaurant = await Restaurant.findOne({ _id: restaurant_id });
      if (role === roles.owner && restaurant.owner_id !== _id) {
        res.status(403).json(statusCodes[403]);
      } else if (!restaurant) {
        res.status(404).json(statusCodes[404]);
      } else {
        res.send(restaurant);
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Get all restaurants

restaurantRouter.get('/', verifyToken, handlePagination, async (req, res) => {
  const { paginationQuery: query, pagination } = req;
  try {
    const total = await Restaurant.countDocuments(query);
    const restaurants = await Restaurant.find(query, null, {
      sort: '-rating',
    })
      .skip((pagination - 1) * 10)
      .limit(10)
      .exec();
    res.send({ restaurants, total });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a restaurant

restaurantRouter.post(
  '/',
  verifyToken,
  verifyPermission([roles.owner]),
  handlePagination,
  async (req, res) => {
    const {
      body: { name },
      decoded: {
        user: { _id: owner_id },
      },
      paginationQuery: query,
      pagination,
    } = req;

    const newRestaurant = new Restaurant({
      name,
      owner_id,
    });

    try {
      await newRestaurant.save();

      const total = await Restaurant.countDocuments(query);
      const restaurants = await Restaurant.find(query, null, {
        sort: '-rating',
      })
        .skip((pagination - 1) * 10)
        .limit(10)
        .exec();
      res.send({
        message: `Restaurant '${name}' has successfully been added`,
        data: { total, restaurants },
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(errorHandler(error, true));
    }
  }
);

// Update a restaurant

restaurantRouter.put(
  '/:restaurant_id',
  verifyToken,
  verifyPermission([roles.admin]),
  handleValidId('restaurant_id'),
  async (req, res) => {
    const {
      params: { restaurant_id },
      body: { name },
    } = req;

    try {
      const restaurant = await Restaurant.findOneAndUpdate(
        {
          _id: restaurant_id,
        },
        { name },
        { new: true }
      );
      res.send({
        message: 'Restaurant has successfully been updated',
        data: restaurant,
      });
    } catch (error) {
      res.status(400).json(errorHandler(error, true));
    }
  }
);

// Delete a restaurant

restaurantRouter.delete(
  '/:restaurant_id',
  verifyToken,
  verifyPermission([roles.admin]),
  handleValidId('restaurant_id'),
  restaurantDelete,
  reviewDelete,
  handlePagination,
  async (req, res) => {
    const { paginationQuery: query, pagination } = req;

    try {
      const total = await Restaurant.countDocuments(query);
      const restaurants = await Restaurant.find(query, null, {
        sort: '-rating',
      })
        .skip((pagination - 1) * 10)
        .limit(10)
        .exec();
      res.send({
        message: 'Restaurant has successfully been deleted',
        data: { total, restaurants },
      });
    } catch (error) {
      console.log(error);
    }
  }
);

export default restaurantRouter;
