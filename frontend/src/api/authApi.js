import axios from 'axios';

const rawBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
const API_BASE_URL = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: async (email, password, rememberMe = true) => {
    try {
      const response = await client.post('/auth/login', { email, password });
      if (response.data?.token) {
        localStorage.setItem('stockai_token', response.data.token);
        localStorage.setItem('stockai_user', JSON.stringify(response.data.user));
      }
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      throw new Error(errorMsg);
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await client.post('/auth/register', { name, email, password });
      if (response.data?.token) {
        localStorage.setItem('stockai_token', response.data.token);
        localStorage.setItem('stockai_user', JSON.stringify(response.data.user));
      }
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
        message: response.data.message || 'Registration successful!',
      };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      throw new Error(msg);
    }
  },

  getMe: async () => {
    const token = localStorage.getItem('stockai_token');
    const userStr = localStorage.getItem('stockai_user');
    const userObj = userStr ? JSON.parse(userStr) : null;

    try {
      const response = await client.get('/auth/me', {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          'x-user-email': userObj?.email,
        },
      });
      return response.data;
    } catch (err) {
      if (userObj) return { success: true, user: userObj };
      throw err;
    }
  },
};
