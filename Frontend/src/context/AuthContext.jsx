
import React, { createContext, useContext, useState } from 'react';

import {
  getToken,
  getUser,
  setToken,
  setUser,
  removeToken,
  loginUser,
  registerUser,
} from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(getUser());
  const [token, setTokenState] = useState(getToken());

  const login = async (email, password) => {
    const data = await loginUser(email, password);

    if (data.token) {
      setToken(data.token);
      setTokenState(data.token);
    }

    if (data.user) {
      setUser(data.user);
      setUserState(data.user);
    }

    return data;
  };

  const register = async (username, email, password) => {
    const data = await registerUser(
      username,
      email,
      password
    );

    if (data.token) {
      setToken(data.token);
      setTokenState(data.token);
    }

    if (data.user) {
      setUser(data.user);
      setUserState(data.user);
    }

    return data;
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

