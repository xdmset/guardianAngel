import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

const mockUsers = {
  'admin@guardianangel.com': { id: 1, name: 'Admin General', email: 'admin@guardianangel.com', role: 'admin', password: 'admin' },
  'cuidador@guardianangel.com': { id: 2, name: 'Ana Martínez', email: 'cuidador@guardianangel.com', role: 'caregiver', password: 'cuidador' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    const foundUser = mockUsers[email];
    if (foundUser && foundUser.password === password) {
      const { password: _, ...userToStore } = foundUser;
      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
      return userToStore;
    }
    throw new Error('Email o contraseña incorrectos');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};