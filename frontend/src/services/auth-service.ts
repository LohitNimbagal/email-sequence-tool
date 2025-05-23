import { type User } from '../types/user';

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

export const authService = {
    login: async (credentials: { email: string; password: string }, redirectUrl: string = '/') => {
        const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URI}/api/auth/login`, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(credentials),
            credentials: 'include',
        });
        
        if (!response.ok) {
            throw new Error('Login failed');
        }
        
        const data = await response.json();
        return { data, redirectUrl };
    },
    
    register: async (userData: { username: string; email: string; password: string }) => {
        const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URI}/api/auth/register`, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(userData),
            credentials: 'include',
        });
        
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        
        return response.json();
    },

    logout: async () => {
        await fetch(`${import.meta.env.VITE_SERVER_BASE_URI}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    },

    getCurrentUser: async (): Promise<User | null> => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URI}/api/auth/current`, {
                headers: DEFAULT_HEADERS,
                credentials: 'include',
            });
            
            if (!response.ok) {
                return null;
            }
            
            return response.json();
        } catch (error) {
            console.error('Failed to get current user:', error);
            return null;
        }
    }
};
