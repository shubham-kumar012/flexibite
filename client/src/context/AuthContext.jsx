import React, { createContext, useContext, useState, useEffect } from 'react';
import { APP_CONFIG } from '../config/appConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Check current user session on initial load if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${APP_CONFIG.apiBaseUrl}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.user);
          setToken(storedToken);
        } else {
          // Token is invalid or expired -> clean up local storage
          localStorage.removeItem('token');
          setUser(null);
          setToken('');
        }
      } catch (error) {
        console.error('Failed to verify authentication:', error);
        localStorage.removeItem('token');
        setUser(null);
        setToken('');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await fetch(`${APP_CONFIG.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Login failed' };
      }

      // Save token to localStorage and update state
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Unable to connect to server' };
    }
  };

  // Signup handler
  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${APP_CONFIG.apiBaseUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Signup failed' };
      }

      // Save token to localStorage and update state
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Unable to connect to server' };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      // Call backend logout endpoint (stateless logging)
      await fetch(`${APP_CONFIG.apiBaseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token and user state on frontend regardless
      localStorage.removeItem('token');
      setToken('');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
