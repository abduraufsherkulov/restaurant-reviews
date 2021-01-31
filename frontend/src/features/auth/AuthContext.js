import React, { createContext, useReducer } from "react";
import { AuthReducer } from "./AuthReducer";

export const AuthContext = createContext();

function AuthContextProvider(props) {
  const [user, dispatch] = useReducer(AuthReducer, null, () => {
    const localData = localStorage.getItem("user");
    return localData ? JSON.parse(localData) : { user: {} };
  });
  return (
    <AuthContext.Provider value={{ user, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
