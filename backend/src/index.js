import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import auth from './routes/auth.route';
import users from './routes/users.route';
import restaurants from './routes/restaurant.route';
import reviews from './routes/review.route';
import swaggerDocument from './swagger.json';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// routes
app.use('/auth', auth);
app.use('/users', users);
app.use('/restaurants', restaurants);
app.use('/reviews', reviews);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// error handler for 404
app.use((_, res) => {
  res.status(404).send("Sorry can't find that!");
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend app is listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(process.env.MONGO_URL);
    console.log(err, 'index js');
  });
