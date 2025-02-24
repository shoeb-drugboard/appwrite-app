import React from 'react'
import { Button } from '@heroui/button'
import { useRouter } from 'next/navigation'
import { account } from "@/utils/appwrite/config";
import { AppwriteException } from 'appwrite';

const Logout = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await account.deleteSession('current');
            localStorage.removeItem('user');
            router.push('/user/login');
        } catch (error) {
            if (error instanceof AppwriteException) {
                console.error('Logout error:', error.message);
            }
            // Even if logout fails, clear local storage and redirect
            localStorage.removeItem('user');
            router.push('/user/login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onPress={handleLogout}
            variant="ghost"
            color="danger"
            disabled={isLoading}
        >
            {isLoading ? 'Logging out...' : 'Logout'}
        </Button>
    )
}

export default Logout