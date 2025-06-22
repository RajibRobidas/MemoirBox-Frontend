import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL + '/api') || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('memoirbox_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('memoirbox_token');
      localStorage.removeItem('memoirbox_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: { email: string; password: string; name: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('memoirbox_token');
    localStorage.removeItem('memoirbox_user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Memory services
export const memoryService = {
  uploadMemory: async (formData: FormData) => {
    const response = await api.post('/memories/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMemories: async (filters?: any) => {
    const response = await api.get('/memories', { params: filters });
    return response.data;
  },

  getMemoryById: async (id: string) => {
    const response = await api.get(`/memories/${id}`);
    return response.data;
  },

  updateMemory: async (id: string, data: any) => {
    const response = await api.put(`/memories/${id}`, data);
    return response.data;
  },

  deleteMemory: async (id: string) => {
    const response = await api.delete(`/memories/${id}`);
    return response.data;
  },

  getPublicMemories: async () => {
    try {
      const response = await api.get('/memories/public');
      return response.data;
    } catch (error) {
      console.error('Error fetching public memories:', error);
      throw error;
    }
  },

  createMemory: async (memoryData: {
    title: string;
    description: string;
    imageUrls: string[];
    date: string;
    location?: string;
    tags?: string[];
    visibility: 'private' | 'family' | 'public';
  }) => {
    const response = await api.post('/memories', memoryData);
    return response.data;
  },

  likeMemory: async (memoryId: string) => {
    const response = await api.post(`/memories/${memoryId}/like`);
    return response.data;
  },

  addComment: async (memoryId: string, text: string) => {
    const response = await api.post(`/memories/${memoryId}/comments`, { text });
    return response.data;
  },

  getTimelineCards: async () => {
    const response = await api.get('/timeline-cards');
    return response.data;
  },

  uploadTimelineCardImage: async (formData: FormData) => {
    const response = await api.post('/timeline-cards/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  createTimelineCard: async (cardData: any) => {
    const response = await api.post('/timeline-cards', cardData);
    return response.data;
  }
};

// Collection services
export const collectionService = {
  getCollections: async () => {
    const response = await api.get('/collections');
    return response.data;
  },

  createCollection: async (collectionData: {
    name: string;
    description: string;
    images: string[];
    privacy: string;
  }) => {
    const response = await api.post('/collections', collectionData);
    return response.data;
  },

  getCollectionById: async (id: string) => {
    const response = await api.get(`/collections/${id}`);
    return response.data;
  },

  updateCollection: async (id: string, data: any) => {
    const response = await api.put(`/collections/${id}`, data);
    return response.data;
  },

  deleteCollection: async (id: string) => {
    const response = await api.delete(`/collections/${id}`);
    return response.data;
  },

  addMemoryToCollection: async (collectionId: string, memoryId: string) => {
    const response = await api.post(`/collections/${collectionId}/memories`, { memoryId });
    return response.data;
  },

  removeMemoryFromCollection: async (collectionId: string, memoryId: string) => {
    const response = await api.delete(`/collections/${collectionId}/memories/${memoryId}`);
    return response.data;
  },
};

export default api; 