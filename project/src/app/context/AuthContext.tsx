import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'dentist' | 'dental_aide' | 'school_admin' | 'barangay_health' | 'system_admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  school?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    const mockUsers: Record<string, User> = {
      'dentist@floral.ph': {
        id: '1',
        name: 'Dr. Maria Santos',
        email: 'dentist@floral.ph',
        role: 'dentist',
        school: 'Bagong Tanyag Integrated School',
      },
      'aide@floral.ph': {
        id: '2',
        name: 'Ana Reyes',
        email: 'aide@floral.ph',
        role: 'dental_aide',
        school: 'Bagong Tanyag Integrated School',
      },
      'school@floral.ph': {
        id: '3',
        name: 'Principal Jose Cruz',
        email: 'school@floral.ph',
        role: 'school_admin',
        school: 'Bagong Tanyag Integrated School',
      },
      'barangay@floral.ph': {
        id: '4',
        name: 'Dr. Elena Martinez',
        email: 'barangay@floral.ph',
        role: 'barangay_health',
      },
      'admin@floral.ph': {
        id: '5',
        name: 'System Administrator',
        email: 'admin@floral.ph',
        role: 'system_admin',
      },
    };
    
    setUser(mockUsers[email] || mockUsers['dentist@floral.ph']);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};