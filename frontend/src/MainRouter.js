import React, { useContext } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';
import NotFound from './app/errors/404';
import { AuthContext } from './features/auth/AuthContext';
import SignIn from './features/auth/SignIn';
import SignUp from './features/auth/SignUp';
import RestaurantDetail from './features/restaurant/RestaurantDetail';
import Restaurants from './features/restaurants/Restaurants';
import AllUsers from './features/users/AllUsers';

function PrivateRoute({ children, ...rest }) {
  const { user } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user.token ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function MainRouter({ location }) {
  return (
    <Switch location={location}>
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <PrivateRoute path="/users">
        <AllUsers />
      </PrivateRoute>
      <PrivateRoute path="/restaurant/:id">
        <RestaurantDetail />
      </PrivateRoute>
      <PrivateRoute exact path="/">
        <Restaurants />
      </PrivateRoute>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

export default MainRouter;
