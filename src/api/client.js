import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для добавления токена авторизации
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Добавляем перехватчик для обработки ошибок
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Аутентификация
export const auth = {
  login: (credentials) => client.post('/auth/login', credentials),
  register: (userData) => client.post('/auth/register', userData),
  logout: () => client.post('/auth/logout'),
  getProfile: () => client.get('/auth/profile'),
  updateProfile: (data) => client.put('/auth/profile', data),
};

// Туры
export const tours = {
  getAll: (params) => client.get('/tours', { params }),
  getById: (id) => client.get(`/tours/${id}`),
  search: (query) => client.get('/tours/search', { params: { query } }),
};

// Бронирования
export const bookings = {
  create: (data) => client.post('/bookings', data),
  getAll: () => client.get('/bookings'),
  getById: (id) => client.get(`/bookings/${id}`),
  cancel: (id) => client.post(`/bookings/${id}/cancel`),
};

// Отзывы
export const reviews = {
  create: (tourId, data) => client.post(`/tours/${tourId}/reviews`, data),
  getByTour: (tourId) => client.get(`/tours/${tourId}/reviews`),
};

// Избранное
export const favorites = {
  add: (tourId) => client.post(`/favorites/${tourId}`),
  remove: (tourId) => client.delete(`/favorites/${tourId}`),
  getAll: () => client.get('/favorites'),
};

export default {
  auth,
  tours,
  bookings,
  reviews,
  favorites,
}; 