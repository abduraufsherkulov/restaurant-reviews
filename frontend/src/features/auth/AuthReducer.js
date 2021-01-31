export const AuthReducer = (state, action) => {
  switch (action.type) {
    case "SIGN_IN":
      if (localStorage.getItem("user") !== null) {
        localStorage.removeItem("user");
        return { user: action.user };
      }
      localStorage.setItem("user", JSON.stringify(action.user));
      return action.user;
    case "SESSION_EXPIRED":
      let data = JSON.stringify({ token: null });
      localStorage.setItem("user", data);
      return data;
    case "SIGN_OUT":
      localStorage.removeItem("user");
      return { user: {} };
    default:
      return;
  }
};
