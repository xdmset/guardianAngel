import React, { createContext, useState } from 'react';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username, password) => {
    const response = await fetch('http://127.0.0.1:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Usuario o contraseña incorrectos');
    }

    const data = await response.json();
    console.log("DATA DE LOGIN:", data);
    const accessToken = data.access_token;
    
    localStorage.setItem('accessToken', accessToken);
    
    const decodedToken = jwtDecode(accessToken);
    
    const userProfile = {
      id: decodedToken.sub,
      role: decodedToken.role || 'caregiver',
      name: decodedToken.name || username,
    };
    
    setUser(userProfile);
    localStorage.setItem('user', JSON.stringify(userProfile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};