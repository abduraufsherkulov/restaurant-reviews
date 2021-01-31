import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import restaurantsReducer, {
  initialStateRestaurants,
} from '../features/restaurants/restaurantSlice';
import reviewsReducer from '../features/restaurant/reviewSlice';
import usersReducer from '../features/users/userSlice';
import authReducer from '../features/auth/authSlice';

const combinedReducer = combineReducers({
  restaurants: restaurantsReducer,
  reviews: reviewsReducer,
  users: usersReducer,
  auth: authReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logOut') {
    state = {
      restaurants: { ...initialStateRestaurants },
      reviews: { ...state.reviews },
    };
  }
  return combinedReducer(state, action);
};

export default configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware()],
});
