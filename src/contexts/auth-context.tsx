
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type UserRole = 'admin' | 'user';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
};

export type Company = {
    name: string;
    userCount: number;
    logo: string;
    address: string;
    phone: string;
    email: string;
};

type AuthContextType = {
  user: User | null;
  company: Company | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  updateUser: (data: Partial<Omit<User, 'role' | 'id'>>) => void;
  signup: (companyData: Pick<Company, 'name' | 'userCount'>, userData: Omit<User, 'id' | 'avatar' | 'role'>) => void;
  updateCompany: (data: Partial<Company>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  
  const login = (email: string, pass: string): boolean => {
    // Mock login. In a real app, this would be an API call.
    if (email === 'admin@wareflow.com' && pass === 'password') {
        const loggedInUser: User = {
            id: 'admin-user-id',
            name: 'Admin User',
            email: 'admin@wareflow.com',
            avatar: 'https://placehold.co/100x100.png',
            role: 'admin',
        };
        const loggedInCompany: Company = {
            name: 'Default Corp',
            userCount: 5,
            logo: 'https://placehold.co/100x100/4338CA/FFFFFF.png',
            address: '123 Business Rd, Suite 456, Big City, USA',
            phone: '555-0199',
            email: 'contact@defaultcorp.com'
        };
        setUser(loggedInUser);
        setCompany(loggedInCompany);
        return true;
    }
    return false;
  };

  const signup = (companyData: Pick<Company, 'name' | 'userCount'>, userData: Omit<User, 'id'|'avatar'|'role'>) => {
    const newUser: User = {
        id: uuidv4(),
        ...userData,
        role: 'admin',
        avatar: `https://placehold.co/100x100.png`,
    };
    const newCompany: Company = {
        ...companyData,
        logo: 'https://placehold.co/100x100.png',
        address: '',
        phone: '',
        email: userData.email,
    };
    setUser(newUser);
    setCompany(newCompany);
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
  };

  const updateUser = (data: Partial<Omit<User, 'role' | 'id'>>) => {
    setUser(currentUser => currentUser ? { ...currentUser, ...data } : null);
  };

  const updateCompany = (data: Partial<Company>) => {
    setCompany(currentCompany => currentCompany ? { ...currentCompany, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{ user, company, login, logout, updateUser, signup, updateCompany }}>
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
