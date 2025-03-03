"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/utils/appwrite/config';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppwriteException } from 'appwrite';

type User = {
    $id: string;
    name: string;
    email: string;
};

type LoginCredentials = {
    email: string;
    password: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    checkAuthStatus: () => Promise<boolean>;
    logout: () => void;
    login: (credentials: LoginCredentials) => void;
    loginIsLoading: boolean;
    error: string | null;
    setError: (error: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const safeLocalStorage = {
    getItem: (key: string): string | null => {
        if (typeof window === 'undefined') return null;
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error('localStorage.getItem error:', e);
            return null;
        }
    },
    setItem: (key: string, value: string): boolean => {
        if (typeof window === 'undefined') return false;
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.error('localStorage.setItem error:', e);
            return false;
        }
    },
    removeItem: (key: string): boolean => {
        if (typeof window === 'undefined') return false;
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('localStorage.removeItem error:', e);
            return false;
        }
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const router = useRouter();

    // Add caching mechanism to reduce API calls
    const checkAuthStatus = async () => {
        try {
            // First check localStorage for recent auth check
            const cachedAuth = safeLocalStorage.getItem('auth_cache');
            const now = Date.now();

            if (cachedAuth) {
                const { user: cachedUser, timestamp } = JSON.parse(cachedAuth);
                // If cache is less than 5 minutes old, use it
                if (now - timestamp < 5 * 60 * 1000 && cachedUser) {
                    setUser(cachedUser);
                    setIsLoading(false);
                    return true;
                }
            }

            // Otherwise make the API call
            const currentUser = await account.get();
            setUser(currentUser);
            setIsLoading(false);

            safeLocalStorage.setItem('auth_cache', JSON.stringify({
                user: currentUser,
                timestamp: now
            }));
            console.log('Auth check complete');
            return true;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.warn('Auth check error:', errorMessage);
            setUser(null);
            setIsLoading(false);
            safeLocalStorage.removeItem('auth_cache');
            return false;
        }
    };

    const { mutate: login, isPending: loginIsLoading } = useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            await account.createEmailPasswordSession(credentials.email, credentials.password);
            return await account.get();
        },
        onSuccess: (currentUser) => {
            setUser(currentUser);

            // Cache the result
            const now = Date.now();
            safeLocalStorage.setItem('auth_cache', JSON.stringify({
                user: currentUser,
                timestamp: now
            }));
            queryClient.invalidateQueries({ queryKey: ['users'] });
            router.push('/');
        },
        onError: (err: AppwriteException | Error) => {
            if (err instanceof AppwriteException) {
                switch (err.type) {
                    case 'general_argument_invalid':
                        setError('Invalid email or password');
                        break;
                    case 'user_not_found':
                        setError('User not found');
                        break;
                    default:
                        setError(err.message);
                }
            } else {
                setError('An unexpected error occurred');
            }
        }
    });

    const { mutate: logout } = useMutation({
        mutationFn: async () => {
            setIsLoading(true);
            await account.deleteSession('current');
            return true;
        },
        onError: (error: AppwriteException | Error) => {
            console.error('Logout error:', error instanceof AppwriteException ? error.message : error);
            setUser(null);
            safeLocalStorage.removeItem('auth_cache');
            router.push('/user/login');
        },
        onSuccess: () => {
            setUser(null);
            safeLocalStorage.removeItem('auth_cache');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            router.push('/user/login');
        },
        onSettled: () => {
            setIsLoading(false);
        }
    });

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            checkAuthStatus,
            logout,
            login,
            loginIsLoading,
            error,
            setError
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
