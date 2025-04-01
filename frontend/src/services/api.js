const API_BASE_URL = 'http://localhost:8080';

const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('access_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

export const api = {
    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
            credentials: 'include', // This is important for CORS with cookies
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return response.json();
    },

    // Add other API methods here
    get: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: getHeaders(),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Request failed');
        }

        return response.json();
    },

    post: async (endpoint, data) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Request failed');
        }

        return response.json();
    },

    // Add other methods (PUT, DELETE, etc.) as needed
}; 