/**
 * Centralized API configuration
 * Uses Vite environment variables for flexible configuration across environments
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/register/`,
  LOGIN: `${API_BASE_URL}/login/`,
  BOOKINGS: `${API_BASE_URL}/bookings/`,
  CARS: `${API_BASE_URL}/cars/`,
};

export default API_BASE_URL;
