import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Fallback for local development
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }
  return 'http://localhost:8080';
};

const API_BASE_URL = getBaseUrl();

export class ApiError extends Error {
  public status: number;
  public data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (err) {
        throw new ApiError(`HTTP Error ${response.status}`, response.status);
      }
      
      const errMsg = errorData?.message || `HTTP Error ${response.status}`;
      throw new ApiError(errMsg, response.status, errorData);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return await response.json();
    } else {
      return await response.text(); 
    }
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Check for network errors natively thrown by fetch
    if (error.name === 'TypeError' && error.message === 'Network request failed') {
        throw new ApiError("Unable to connect to the server. Please check your internet connection or ensure the backend is running.", 0);
    }

    throw new ApiError(error.message || 'An unexpected error occurred', 0);
  }
};

export const sendOtpRequest = async (mobileNo: string, role: string = 'FARMER') => {
  return apiClient('/auth/signup-request', {
    method: 'POST',
    body: JSON.stringify({ mobileNo, role }),
  });
};

export const verifyOtpRequest = async (mobileNo: string, otp: string) => {
  return apiClient('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ mobileNo, otp }),
  });
};

export const refreshTokenRequest = async (refreshToken: string) => {
  return apiClient('/auth/refresh', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${refreshToken}`
    }
  });
};

export const updateProfileRequest = async (token: string, profileData: any) => {
  return apiClient('/api/v1/profile/update', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData),
  });
};

export const getMyProfileRequest = async (token: string) => {
  return apiClient('/api/v1/profile/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const updateLocationRequest = async (token: string, lat: number, lng: number) => {
  return apiClient('/api/v1/location/update-location', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ lat, lng }),
  });
};

export const getNearestMandiRequest = async (token: string, crop: string) => {
  return apiClient(`/api/v1/mandi/nearest?crop=${encodeURIComponent(crop)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
