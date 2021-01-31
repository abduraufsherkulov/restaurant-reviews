import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  _addRestaurant,
  _getRestaurants,
  _getSingleRestaurant,
  _deleteRestaurant,
  _editRestaurant,
} from './Api';

export const initialStateRestaurants = {
  restaurants: [],
  status: 'idle',
  singleStatus: 'idle',
  filterVal: 0,
  total: 10,
  pagination: 1,
  error: null,
};

export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async data => {
    const response = await _getRestaurants(data);
    return response;
  }
);

export const fetchSingleRestaurant = createAsyncThunk(
  'restaurants/fetchSingleRestaurant',
  async data => {
    const response = await _getSingleRestaurant(data);
    return response;
  }
);

export const addNewRestaurant = createAsyncThunk(
  'restaurants/addNewRestaurant',
  async data => {
    const response = await _addRestaurant(data);
    return response;
  }
);

export const deleteRestaurant = createAsyncThunk(
  'restaurants/deleteRestaurant',
  async data => {
    const response = await _deleteRestaurant(data);
    return response;
  }
);

export const editRestaurant = createAsyncThunk(
  'restaurants/editRestaurant',
  async data => {
    const response = await _editRestaurant(data);
    return response;
  }
);

export const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState: initialStateRestaurants,
  reducers: {
    restaurantResetted: state => {
      state.restaurants = [];
    },
    restaurantUpdated: (state, action) => {
      const { _id } = action.payload;
      let index = state.restaurants.findIndex(
        restaurant => restaurant._id === _id
      );

      if (index >= 0) {
        state.restaurants[index] = action.payload;
        state.restaurants = state.restaurants.sort(
          (a, b) => b.rating - a.rating
        );
      }
    },
    restaurantDeleted: (state, action) => {
      let newState = state.restaurants.filter(
        restaurant => restaurant.owner_id !== action.payload
      );
      state.restaurants = newState;
    },
    setFilter: (state, action) => {
      state.filterVal = action.payload;
      state.pagination = 1;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
  },
  extraReducers: {
    [fetchRestaurants.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchRestaurants.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      // Add any fetched posts to the array
      state.restaurants = action.payload.restaurants;
      state.total = action.payload.total;
    },
    [fetchRestaurants.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [fetchSingleRestaurant.fulfilled]: (state, action) => {
      state.singleStatus = 'succeeded';
      // Add any fetched posts to the array
      state.restaurants = [action.payload];
    },
    [fetchSingleRestaurant.rejected]: (state, action) => {
      state.singleStatus = 'failed';
      state.error = action.error.message;
    },
    [addNewRestaurant.fulfilled]: (state, action) => {
      state.restaurants = action.payload.restaurants;
      state.total = action.payload.total;
    },
    [deleteRestaurant.fulfilled]: (state, action) => {
      state.restaurants = action.payload.restaurants;
      state.total = action.payload.total;
    },
    [editRestaurant.fulfilled]: (state, action) => {
      let restaurantIndex = state.restaurants.findIndex(
        restaurant => restaurant._id === action.payload._id
      );
      state.restaurants[restaurantIndex] = action.payload;
    },
  },
});

export const {
  restaurantUpdated,
  setFilter,
  setPagination,
  restaurantDeleted,
  restaurantResetted,
} = restaurantSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectAllRestaurants = state => state.restaurants.restaurants;
export const selectFilterVal = state => state.restaurants.filterVal;
export const selectTotal = state => state.restaurants.total;
export const selectPagination = state => state.restaurants.pagination;

export const selectRestaurantById = (state, restaurantId) =>
  state.restaurants.restaurants.find(
    restaurant => restaurant._id === restaurantId
  );

export const selectRestaurantIndex = (state, restaurantId) =>
  state.restaurants.restaurants.findIndex(
    restaurant => restaurant._id === restaurantId
  );

export default restaurantSlice.reducer;
