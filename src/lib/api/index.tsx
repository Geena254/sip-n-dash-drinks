import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Define TypeScript interfaces for our data models
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  last_login?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  category_name?: string;
  image_url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
}

export interface Order {
  id: number;
  user_id: number;
  username?: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  payment_method: string;
  order_date: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
}

export interface AnalyticsEvent {
  id: number;
  event_type: string;
  event_data: any;
  timestamp: string;
  user_id: string;
}

export interface AnalyticsSummary {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  topProducts: {
    id: number;
    name: string;
    total_sold: number;
  }[];
  eventsPerDay: {
    date: string;
    count: number;
  }[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  image_url?: string;
  active: boolean;
}

export interface CategoryInput {
  name: string;
  description: string;
  image_url?: string;
}

export interface EventInput {
  event_type: string;
  event_data: any;
  user_id?: string;
}

// Create an axios instance with type information
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

// Add token to requests with TypeScript
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },  (error: any) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for consistent error handling
api.interceptors.response.use(
  (response: any) => response,
  (error: { response: { status: number; }; }) => {
    // Handle expired tokens, unauthorized access, etc.
    if (error.response?.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services with TypeScript
export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  }
};

// Product services with TypeScript
export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response: AxiosResponse<Product[]> = await api.get('/products');
    return response.data;
  },
  getById: async (id: number): Promise<Product> => {
    const response: AxiosResponse<Product> = await api.get(`/products/${id}`);
    return response.data;
  },
  create: async (productData: ProductInput): Promise<Product> => {
    const response: AxiosResponse<Product> = await api.post('/products', productData);
    return response.data;
  },
  update: async (id: number, productData: ProductInput): Promise<Product> => {
    const response: AxiosResponse<Product> = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  delete: async (id: number): Promise<{message: string}> => {
    const response: AxiosResponse<{message: string}> = await api.delete(`/products/${id}`);
    return response.data;
  }
};

// Analytics services with TypeScript
export const analyticsService = {
  recordEvent: async (eventData: EventInput): Promise<AnalyticsEvent> => {
    const response: AxiosResponse<AnalyticsEvent> = await api.post('/analytics/events', eventData);
    return response.data;
  },
  getSummary: async (): Promise<AnalyticsSummary> => {
    const response: AxiosResponse<AnalyticsSummary> = await api.get('/analytics/summary');
    return response.data;
  },
  getEventBreakdown: async (): Promise<{event_type: string; count: number}[]> => {
    const response: AxiosResponse<{event_type: string; count: number}[]> = await api.get('/analytics/events/breakdown');
    return response.data;
  }
};

// Order services with TypeScript
export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const response: AxiosResponse<Order[]> = await api.get('/orders');
    return response.data;
  },
  getById: async (id: number): Promise<Order & {items: OrderItem[]}> => {
    const response: AxiosResponse<Order & {items: OrderItem[]}> = await api.get(`/orders/${id}`);
    return response.data;
  },
  update: async (id: number, orderData: {status: string}): Promise<Order> => {
    const response: AxiosResponse<Order> = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },
  getOrderItems: async (orderId: number): Promise<OrderItem[]> => {
    const response: AxiosResponse<OrderItem[]> = await api.get(`/orders/${orderId}/items`);
    return response.data;
  }
};

// Category services with TypeScript
export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response: AxiosResponse<Category[]> = await api.get('/categories');
    return response.data;
  },
  getById: async (id: number): Promise<Category> => {
    const response: AxiosResponse<Category> = await api.get(`/categories/${id}`);
    return response.data;
  },
  create: async (categoryData: CategoryInput): Promise<Category> => {
    const response: AxiosResponse<Category> = await api.post('/categories', categoryData);
    return response.data;
  },
  update: async (id: number, categoryData: CategoryInput): Promise<Category> => {
    const response: AxiosResponse<Category> = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },
  delete: async (id: number): Promise<{message: string}> => {
    const response: AxiosResponse<{message: string}> = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

export default api;