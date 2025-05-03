import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: '/api'
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};

// Product services
export const productService = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

// Analytics services
export const analyticsService = {
  recordEvent: async (eventData) => {
    const response = await api.post('/analytics/events', eventData);
    return response.data;
  },
  getSummary: async () => {
    const response = await api.get('/analytics/summary');
    return response.data;
  },
  getEventBreakdown: async () => {
    const response = await api.get('/analytics/events/breakdown');
    return response.data;
  }
};

// Order services
export const orderService = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  update: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  }
};

// Category services
export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  }
};

export default api;