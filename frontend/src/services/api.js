import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 240000, // 120 seconds timeout to accommodate long-running Gemini requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Note: In actual components, you should pass the getToken function
    // This is a placeholder - real implementation should be in the component
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 429) {
      toast.error('Too many requests. Please wait a moment.');
    } else if (error.response?.status === 401) {
      toast.error('Please login to continue');
      // Optional: redirect to login
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

// Gemini API calls
export const geminiAPI = {
  // Generate code using Gemini
  generateCode: async (prompt, framework, getToken) => {
    try {
      const config = {};
      if (getToken) {
        const token = await getToken();
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }
      }

      const response = await apiClient.post('/gemini/generate-code', {
        prompt,
        framework
      }, config);
      return response.data;
    } catch (error) {
      console.error('Generate code error:', error);
      throw error;
    }
  },

  // Get user history
  getHistory: async (getToken) => {
    try {
      const config = {};
      if (getToken) {
        const token = await getToken();
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }
      }

      const response = await apiClient.get('/gemini/history', config);
      return response.data;
    } catch (error) {
      console.error('Get history error:', error);
      throw error;
    }
  }
};

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await apiClient.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
};

// History API calls (alternative to geminiAPI.getHistory)
export const historyAPI = {
  saveHistory: async (historyData) => {
    try {
      const response = await apiClient.post('/history', historyData);
      return response.data;
    } catch (error) {
      console.error('Save history error:', error);
      throw error;
    }
  },

  getHistory: async () => {
    try {
      const response = await apiClient.get('/history');
      return response.data;
    } catch (error) {
      console.error('Get history error:', error);
      throw error;
    }
  }
};

export default apiClient;