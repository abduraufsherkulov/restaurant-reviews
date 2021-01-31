import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { roles } from '../settings';
import {
  handleValidId,
  restaurantDelete,
  reviewDelete,
  userDelete,
  verifyToken,
  verifyPermission,
} from '../middlewares/middlewares';
import { checkPassword } from './auth.route';

const userRouter = Router();

// Get all users

userRouter.get(
  '/',
  verifyToken,
  verifyPermission([roles.admin]),
  async (req, res) => {
    try {
      const users = await User.find({
        role: { $not: { $eq: roles.admin } },
      }).select('-password');
      res.send({ data: users });
    } catch (error) {
      res.send(error);
    }
  }
);

// Update user

userRouter.put(
  '/:user_id',
  verifyToken,
  verifyPermission([roles.admin]),
  checkPassword,
  handleValidId('user_id'),
  async (req, res) => {
    let {
      params: { user_id },
      body: { password },
    } = req;

    password = bcrypt.hashSync(password, 10);

    try {
      await User.findOneAndUpdate({ _id: user_id }, { password });
      res.send({
        message: 'Password has successfully been updated',
        data: { user_id },
      });
    } catch (error) {
      res.send(error);
    }
  }
);

// Delete user

userRouter.delete(
  '/:user_id',
  verifyToken,
  verifyPermission([roles.admin]),
  handleValidId('user_id'),
  userDelete,
  restaurantDelete,
  reviewDelete,
  async (req, res) => {
    const { user_id } = req;
    res.send({ message: 'User has successfully been deleted', data: user_id });
  }
);

export default userRouter;
