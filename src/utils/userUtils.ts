import { useAuth } from '@providers/AuthProvider';
import { UserInfo } from '@/types/types';

export const getUserInfo = async (): Promise<UserInfo | null> => {
    const { user } = useAuth();
    console.log("User in getUserInfo:", user);
    if (user?.access_token) {
        return user.info || null;
    }
    return null;
};