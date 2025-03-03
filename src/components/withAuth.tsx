import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

// HOC to protect routes that require authentication
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
    return function WithAuth(props: T) {
        const { isAuthenticated, isLoading } = useAuth();
        const router = useRouter();
        const [showContent, setShowContent] = useState(false);

        useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                router.push('/user/login');
            } else if (!isLoading && isAuthenticated) {
                setShowContent(true);
            }
        }, [isAuthenticated, isLoading, router]);

        if (isLoading || !showContent) {
            return <div className="flex justify-center items-center min-h-[300px]">
                <p>Loading...</p>
            </div>;
        }

        return <Component {...props} />;
    };
}

// HOC for auth pages (login/register) - redirects if already authenticated
export function withPublicAuth<T extends object>(Component: React.ComponentType<T>) {
    return function WithPublicAuth(props: T) {
        const { isAuthenticated, isLoading } = useAuth();
        const router = useRouter();
        const [showContent, setShowContent] = useState(false);

        useEffect(() => {
            if (!isLoading && isAuthenticated) {
                router.push('/');
            } else if (!isLoading && !isAuthenticated) {
                setShowContent(true);
            }
        }, [isAuthenticated, isLoading, router]);

        if (isLoading || !showContent) {
            return <div className="flex justify-center items-center min-h-[300px] w-full">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-sm text-muted-foreground mt-2">Loading...</p>
                </div>
            </div>;
        }

        return <Component {...props} />;
    };
}
