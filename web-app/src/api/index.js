import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth Endpoints
export const authAPI = {
    signupRequest: (data) => apiClient.post('/auth/signup-request', data),
    verifyOtp: (data) => apiClient.post('/auth/verify-otp', data),
    refreshToken: () => apiClient.post('/auth/refresh'),
};

// Profile Endpoints
export const profileAPI = {
    updateProfile: (data) => apiClient.put('/api/v1/profile/update', data),
    getProfile: () => apiClient.get('/api/v1/profile/me'),
};

// Farmer Endpoints
export const farmerAPI = {
    createListing: (data) => apiClient.post('/api/v1/listings/create', data),
    getFarmerListings: () => apiClient.get('/api/v1/listings/farmer'),
    deleteListing: (id) => apiClient.delete(`/api/v1/listings/${id}`),
};

// Buyer Endpoints
export const buyerAPI = {
    getAllListings: () => apiClient.get('/api/v1/listings/all'),
    createOrder: (data) => apiClient.post('/api/v1/orders/create', data),
    getBuyerOrders: () => apiClient.get('/api/v1/orders/buyer'),
};

// Location Endpoints
export const locationAPI = {
    updateLocation: (data) => apiClient.post('/api/v1/location/update-location', data),
};
