import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [userId, setUserId] = useState(localStorage.getItem('admin_user_id'));

  const login = (token, userId) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user_id', userId);
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user_id');
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
