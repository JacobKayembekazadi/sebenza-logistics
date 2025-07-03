
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'admin' | 'user';

export type User = {
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<Omit<User, 'role'>>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default user for demonstration purposes
const defaultAdminUser: User = {
  name: 'Admin User',
  email: 'admin@wareflow.com',
  avatar: 'https://placehold.co/100x100.png',
  role: 'admin',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(defaultAdminUser);
  
  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (data: Partial<Omit<User, 'role'>>) => {
    setUser(currentUser => currentUser ? { ...currentUser, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
