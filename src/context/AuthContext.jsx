import { createContext, useState, useContext, useEffect } from 'react';
import { auth as authApi } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authApi.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Ошибка при получении профиля:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const { token, user: userData } = await authApi.login(credentials);
      localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка авторизации',
      };
    }
  };

  const register = async (userData) => {
    try {
      const { token, user: newUser } = await authApi.register(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка регистрации',
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const updatedUser = await authApi.updateProfile(updatedData);
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка обновления профиля',
      };
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

export default AuthContext; 