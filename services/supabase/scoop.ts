import type { Region } from "@/contexts/timezone-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase-client";

const ARCHIVES_KEY = "scoops_archive";
const LOCALE_STORAGE_KEY = "@app_locale";
const MAX_ARCHIVES = 5;

interface ArchivedScoop {
  id: number;
  title: string;
  content: string;
  category: string;
  image_url: string;
  source_name: string;
  url: string;
  date: string;
  archived_at: string;
}

export const getScoop = async (region: Region = "US") => {
  try {
    let tableName = region === "EU" ? "current_scoop_eu" : "current_scoop";

    const lang = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
    if (lang === "fr") {
      tableName = "current_scoop_fr";
    }

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", 1)
      .single();

    if (error) throw error;

    if (data) {
      await archiveScoopIfNeeded(data);
    }

    return data;
  } catch (error) {
    return null;
  }
};

const archiveScoopIfNeeded = async (scoop: any) => {
  try {
    if (!scoop.date) return;

    const scoopDate = new Date(scoop.date);
    const today = new Date();

    scoopDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (scoopDate >= today) return;

    const archives = await getArchives();

    const alreadyArchived = archives.some(
      (archived) => archived.date === scoop.date,
    );

    if (alreadyArchived) return;

    const newArchive: ArchivedScoop = {
      ...scoop,
      archived_at: new Date().toISOString(),
    };

    let updatedArchives = [newArchive, ...archives];

    if (updatedArchives.length > MAX_ARCHIVES) {
      updatedArchives = updatedArchives.slice(0, MAX_ARCHIVES);
    }

    await AsyncStorage.setItem(ARCHIVES_KEY, JSON.stringify(updatedArchives));
  } catch (error) {
    console.error("Error archiving scoop:", error);
  }
};

export const getArchives = async (): Promise<ArchivedScoop[]> => {
  try {
    const archived = await AsyncStorage.getItem(ARCHIVES_KEY);
    if (!archived) return [];

    const archives: ArchivedScoop[] = JSON.parse(archived);

    return archives.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error("Error fetching archives:", error);
    return [];
  }
};
