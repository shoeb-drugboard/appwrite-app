import { account } from './appwrite/config';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const currentUser = await account.get();
    return !!currentUser.$id;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

export const redirectIfAuthenticated = async (
  redirectTo: string = '/',
  router: AppRouterInstance
): Promise<boolean> => {
  const isAuthenticated = await checkAuthStatus();

  if (isAuthenticated) {
    router.push(redirectTo);
    return true;
  }

  return false;
};
