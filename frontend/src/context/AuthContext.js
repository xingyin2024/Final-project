import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMockData } from "../utils/fetchMockData";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Login function
  const login = async (email, password) => {
    const users = await fetchMockData("user");
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      if (foundUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      alert("Invalid email or password!");
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    navigate("/"); // Redirect to welcome page
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
