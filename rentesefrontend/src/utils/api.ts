import axios, { type AxiosInstance } from 'axios';

const BASE_URL = 'https://refactored-palm-tree-x5gqrp4v4g99c66qv-8080.app.github.dev';


class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.api.interceptors.request.use(
      (config) => {
        console.log(`Making API request to: ${config.baseURL}${config.url}`);
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle token expiration
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.message);
        if (error.code === 'ECONNABORTED') {
          console.error('Request timeout - backend may be slow or unreachable');
        }
        if (error.code === 'ERR_NETWORK') {
          console.error('Network error - check if backend is running and accessible');
        }
        if ((error.response?.status === 401)) {
          localStorage.removeItem('token');
          localStorage.removeItem('email');
          localStorage.removeItem('role');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: any) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  // Property endpoints
  async getProperties(filters?: any) {
    const response = await this.api.get('/propertiesDel/search', { params: filters });
    return response.data;
  }

  

  async getProperty(id: string) {
    const response = await this.api.get(`/api/properties/${id}`);
    return response.data;
  }

  async createProperty(propertyData: any) {
    const response = await this.api.post('/propertiesDel/properties-listing', propertyData);
    return response.data;
  }

  async updateProperty(id: string, propertyData: any) {
    const response = await this.api.put(`/api/properties/${id}`, propertyData);
    return response.data;
  }

  async deleteProperty(id: string) {
    const response = await this.api.delete(`/api/properties/${id}`);
    return response.data;
  }

  async getLandlordProperties() {
    const response = await this.api.get('/propertiesDel/listed-properties');
    return response.data;
  }

  // Booking endpoints
  async createBooking(bookingData: any) {
    const response = await this.api.post('/api/bookings', bookingData);
    return response.data;
  }

  async getBookings() {
    const response = await this.api.get('/api/bookings');
    return response.data;
  }

  async updateBookingStatus(id: string, status: string) {
    const response = await this.api.put(`/api/bookings/${id}/status`, { status });
    return response.data;
  }

  // Payment endpoints
  async getPayments() {
    const response = await this.api.get('/api/payments');
    return response.data;
  }

  async createPaymentOrder(paymentData: any) {
    const response = await this.api.post('/api/payments/create-order', paymentData);
    return response.data;
  }

  async verifyPayment(paymentData: any) {
    const response = await this.api.post('/api/payments/verify', paymentData);
    return response.data;
  }

  // Dashboard endpoints
  async getDashboardStats() {
    const response = await this.api.get('/api/dashboard/stats');
    return response.data;
  }
}

export const apiService = new ApiService();