import AsyncStorage from "@react-native-async-storage/async-storage";

const LIKED_FACTS_KEY = "@briefly_today_liked_facts";

export interface LikedFact {
  title: string;
  content: string;
  url: string;
  day: number;
  month: number;
  category: string;
  likedAt: string; // ISO string timestamp
}

export const getLikedFacts = async (): Promise<LikedFact[]> => {
  try {
    const data = await AsyncStorage.getItem(LIKED_FACTS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error("Error getting liked facts:", error);
    return [];
  }
};

export const likeFact = async (
  title: string,
  content: string,
  url: string,
  category: string,
): Promise<void> => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const likedFacts = await getLikedFacts();

    // Create new liked fact
    const newFact: LikedFact = {
      title,
      content,
      url,
      day,
      month,
      category,
      likedAt: now.toISOString(),
    };

    // Add to the beginning of the array
    const updatedFacts = [newFact, ...likedFacts];

    await AsyncStorage.setItem(LIKED_FACTS_KEY, JSON.stringify(updatedFacts));
  } catch (error) {
    console.error("Error liking fact:", error);
    throw error;
  }
};

export const unlikeFact = async (title: string): Promise<void> => {
  try {
    const likedFacts = await getLikedFacts();
    const updatedFacts = likedFacts.filter((fact) => fact.title !== title);
    await AsyncStorage.setItem(LIKED_FACTS_KEY, JSON.stringify(updatedFacts));
  } catch (error) {
    console.error("Error unliking fact:", error);
    throw error;
  }
};

export const isFactLiked = async (title: string): Promise<boolean> => {
  try {
    const likedFacts = await getLikedFacts();
    return likedFacts.some((fact) => fact.title === title);
  } catch (error) {
    console.error("Error checking if fact is liked:", error);
    return false;
  }
};

export const getLikedFactsCount = async (): Promise<number> => {
  try {
    const likedFacts = await getLikedFacts();
    return likedFacts.length;
  } catch (error) {
    console.error("Error getting liked facts count:", error);
    return 0;
  }
};

export const getLikedFactsCountByCategory = async (
  category: string,
): Promise<number> => {
  try {
    const likedFacts = await getLikedFacts();
    return likedFacts.filter((fact) => fact.category === category).length;
  } catch (error) {
    console.error("Error getting liked facts count by category:", error);
    return 0;
  }
};

export const MAX_LIKES_PER_CATEGORY = 20;
