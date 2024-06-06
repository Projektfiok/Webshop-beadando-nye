import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import useToken from "../components/useToken";  

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, setToken, removeToken } = useToken();  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!token);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  const login = (userToken: string) => {
    setToken(userToken);
  };

  const logout = () => {
    removeToken();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthProvider probléma");
  }
  return context;
};
