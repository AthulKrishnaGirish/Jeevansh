import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { loadUser, saveUser } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  modalTargetRole: 'donor' | 'requester';
  loginAsDemoDoctor: () => void;
  loginAsDemoDonor: () => void;
  loginWithGoogle: (role?: 'donor' | 'requester') => void;
  loginWithPhone: (name: string, phone: string, role: 'donor' | 'requester') => void;
  logout: () => void;
  openAuthModal: (role?: 'donor' | 'requester') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => loadUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalTargetRole, setModalTargetRole] = useState<'donor' | 'requester'>('donor');

  useEffect(() => {
    saveUser(user);
  }, [user]);

  const loginAsDemoDoctor = () => {
    const demoDoctor: User = {
      id: 'user-doctor-1',
      name: 'Dr. Lakshmi Mohan',
      email: 'doctor@jeevansh.com',
      phone: '+91 98470 44332',
      role: 'doctor'
    };
    setUser(demoDoctor);
    setIsAuthModalOpen(false);
  };

  const loginAsDemoDonor = () => {
    const demoDonor: User = {
      id: 'user-donor-demo-1',
      name: 'Arjun Nair',
      email: 'donor@jeevansh.com',
      phone: '+91 98471 23456',
      role: 'donor',
      donorProfileId: 'donor-demo-1'
    };
    setUser(demoDonor);
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = (role: 'donor' | 'requester' = 'donor') => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: role === 'donor' ? 'Demo Volunteer' : 'Dr. Evaluator',
      email: role === 'donor' ? 'volunteer@gmail.com' : 'evaluator.hospital@health.in',
      role: role === 'donor' ? 'donor' : 'doctor'
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const loginWithPhone = (name: string, phone: string, role: 'donor' | 'requester') => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name || 'Jeevansh Member',
      phone,
      email: `${phone.replace(/[^0-9]/g, '').slice(-6)}@jeevansh.org`,
      role: role === 'donor' ? 'donor' : 'requester'
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const openAuthModal = (role: 'donor' | 'requester' = 'donor') => {
    setModalTargetRole(role);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        modalTargetRole,
        loginAsDemoDoctor,
        loginAsDemoDonor,
        loginWithGoogle,
        loginWithPhone,
        logout,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
