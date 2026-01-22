import AsyncStorage from "@react-native-async-storage/async-storage";

interface CacheData<T> {
  data: T;
  timestamp: string; // ISO date (YYYY-MM-DD)
}

const getCurrentDateKey = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const cachedString = await AsyncStorage.getItem(key);
    if (!cachedString) return null;

    const cached: CacheData<T> = JSON.parse(cachedString);
    const today = getCurrentDateKey();

    if (cached.timestamp === today) {
      return cached.data;
    }

    await AsyncStorage.removeItem(key);
    return null;
  } catch (error) {
    console.error("Cache read error:", error);
    return null;
  }
};

export const setCachedData = async <T>(key: string, data: T): Promise<void> => {
  try {
    const cacheData: CacheData<T> = {
      data,
      timestamp: getCurrentDateKey(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Cache write error:", error);
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((key) => key.startsWith("cache_"));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.error("Cache clear error:", error);
  }
};
