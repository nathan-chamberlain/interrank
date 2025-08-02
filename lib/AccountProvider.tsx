'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccountState {
  username: string | null;
  jwt: string | null;
  isAuthenticated: boolean;
}

interface AccountContextType extends AccountState {
  login: (username: string, jwt: string) => Promise<boolean>;
  logout: () => void;
  updateJwt: (jwt: string) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [accountState, setAccountState] = useState<AccountState>({
    username: null,
    jwt: null,
    isAuthenticated: false,
  });

  // Load saved auth data from localStorage on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedJwt = localStorage.getItem('jwt');

    if (savedUsername && savedJwt) {
      setAccountState({
        username: savedUsername,
        jwt: savedJwt,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = async (username: string, jwt: string): Promise<boolean> => {
    localStorage.setItem('username', username);
    localStorage.setItem('jwt', jwt);
    
    setAccountState({
      username,
      jwt,
      isAuthenticated: true,
    });

    return true; // Indicate successful login
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('jwt');
    
    setAccountState({
      username: null,
      jwt: null,
      isAuthenticated: false,
    });
  };

  const updateJwt = (jwt: string) => {
    localStorage.setItem('jwt', jwt);
    
    setAccountState(prevState => ({
      ...prevState,
      jwt,
    }));
  };

  const contextValue: AccountContextType = {
    ...accountState,
    login,
    logout,
    updateJwt,
  };

  return (
    <AccountContext.Provider value={contextValue}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};