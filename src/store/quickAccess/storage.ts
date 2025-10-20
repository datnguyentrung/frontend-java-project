import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorageData = async ({ key, value }: { key: string; value: string | object }) => {
    try {
        const jsonValue = typeof value === "string" ? value : JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        console.log("Đã lưu dữ liệu");
    } catch (e) {
        console.error("Lỗi khi lưu dữ liệu: ", e);
    }
};

export const getStorageData = async <T = any>(key: string): Promise<T | null> => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (e) {
        console.error("Lỗi khi lấy dữ liệu: ", e);
        return null;
    }
};
