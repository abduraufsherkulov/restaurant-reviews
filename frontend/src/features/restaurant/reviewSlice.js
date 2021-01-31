import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { restaurantUpdated } from '../restaurants/restaurantSlice';
import {
  _addReply,
  _addReview,
  _deleteReview,
  _editReview,
  _getReviews,
} from './Api';

export const initialStateReviews = {
  reviews: {},
  status: 'idle',
  error: null,
};

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async data => {
    const response = await _getReviews(data);
    return response;
  }
);

export const addNewReview = createAsyncThunk(
  'reviews/addNewReview',
  async (data, { dispatch }) => {
    const response = await _addReview(data);
    dispatch(restaurantUpdated(response.restaurant));
    return response;
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (data, { dispatch }) => {
    const response = await _deleteReview(data);
    dispatch(restaurantUpdated(response.restaurant));
    return response.review;
  }
);

export const editReview = createAsyncThunk(
  'reviews/editReview',
  async (data, { dispatch }) => {
    const response = await _editReview(data);
    dispatch(restaurantUpdated(response.restaurant));
    return response.review;
  }
);

export const addReply = createAsyncThunk(
  'reviews/addReply',
  async (data, { dispatch }) => {
    const response = await _addReply(data);
    dispatch(restaurantUpdated(response.restaurant));
    return response.review;
  }
);

export const reviewSlice = createSlice({
  name: 'reviews',
  initialState: initialStateReviews,
  reducers: {
    reviewResetted: state => {
      state.reviews = {};
    },
    reviewUpdated: (state, action) => {
      action.payload.forEach(review => {
        const reviewsByRestaurant = state.reviews[review.restaurant_id];
        const updatedReviews = reviewsByRestaurant.map(reviewsByRestaurant => {
          if (reviewsByRestaurant._id === review._id) {
            return review;
          } else {
            return reviewsByRestaurant;
          }
        });
        state.reviews[review.restaurant_id] = updatedReviews;
      });
    },
  },
  extraReducers: {
    [fetchReviews.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      // Add any fetched posts to the array
      state.reviews[action.payload.restaurant_id] = action.payload.data;
    },
    [fetchReviews.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [addNewReview.fulfilled]: (state, action) => {
      const restaurant_id = action.payload.restaurant._id;
      const { reviews } = state;
      reviews[restaurant_id] = action.payload.reviews;
    },
    [deleteReview.fulfilled]: (state, action) => {
      const { restaurant_id, _id } = action.payload;
      const { reviews } = state;
      const reviewsByRestaurant = reviews[restaurant_id];
      if (reviewsByRestaurant) {
        let newReviewsByRestaurant = reviewsByRestaurant.filter(
          review => review._id !== _id
        );
        reviews[restaurant_id] = newReviewsByRestaurant;
      }
    },
    [addReply.fulfilled]: (state, action) => {
      const { restaurant_id } = action.payload;
      let index = state.reviews[restaurant_id].findIndex(
        review => review._id === action.payload._id
      );
      if (index >= 0) {
        state.reviews[restaurant_id][index] = action.payload;
      }
    },
    [editReview.fulfilled]: (state, action) => {
      const { restaurant_id } = action.payload;
      let index = state.reviews[restaurant_id].findIndex(
        review => review._id === action.payload._id
      );
      if (index >= 0) {
        state.reviews[restaurant_id][index] = action.payload;
      }
    },
  },
});

export const { reviewUpdated, reviewResetted } = reviewSlice.actions;

export const selectAllReviewsByRestaurant = (state, restaurant_id) =>
  state.reviews.reviews[restaurant_id];

export const selectReviewIndex = (state, restaurant_id, review) => {
  if (review) {
    const index = state.reviews.reviews[restaurant_id].findIndex(
      rev => rev._id === review._id
    );
    return index;
  } else {
    return 0;
  }
};
export const countByRating = (state, restaurant_id, rating) => {
  let count;
  if (state.reviews.reviews[restaurant_id]) {
    count = state.reviews.reviews[restaurant_id].filter(
      review => Math.floor(review.rating) === rating
    );
  } else {
    count = [];
  }
  return count.length;
};

export default reviewSlice.reducer;
