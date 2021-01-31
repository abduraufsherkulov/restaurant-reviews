import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import User from '../models/user.model';
import { errorHandler } from '../helpers/helpers';

const authRouter = Router();

// check password middleware

export const checkPassword = (req, res, next) => {
  let { password } = req.body;
  if (password.trim().length < 6) {
    return res.status(400).send(
      errorHandler([
        {
          name: 'password',
          errors: ['Password cannot be less than 6 characters'],
        },
      ])
    );
  }
  next();
};

// Sign up

authRouter.post('/signup', checkPassword, async (req, res) => {
  let { password } = req.body;
  password = bcrypt.hashSync(password, 10);
  try {
    const newUser = new User({ ...req.body, password });
    await newUser.save();
    res.send({ message: 'You have sucessfully signed up, please log in' });
  } catch (error) {
    res.status(400).send(
      // check for uniqueness of username
      error.code === 11000
        ? errorHandler([
            {
              name: 'username',
              errors: [`Username '${req.body.username}' already exists`],
            },
          ])
        : errorHandler(error, true)
    );
  }
});

// Sign in

authRouter.post('/signin/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (
      user &&
      typeof password === 'string' &&
      bcrypt.compareSync(password, user.password)
    ) {
      user.password = undefined;
      jwt.sign(
        { user },
        process.env.SECRET_KEY,
        { expiresIn: '24h' },
        (err, token) => {
          console.log(err);
          res.send({
            data: { token },
            message: 'You have sucessfully signed in',
          });
        }
      );
    } else {
      res.status(400).send(
        errorHandler([
          {
            name: 'password',
            errors: [`Username or password is wrong`],
          },
        ])
      );
    }
  } catch (error) {
    res.send(error);
  }
});

export default authRouter;
