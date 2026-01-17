import { useEffect, useState } from "react";
import { getDailyFacts } from "../services/supabase/daily-facts";
import { getMovableHoliday } from "../utils/utils";

interface DataItem {
  category: string;
  title: string;
  content: string;
  wikipedia_url: string;
}

type TodayData = {
  saint: string | null;
  celebrities: DataItem[];
  history: DataItem[];
  popCulture: DataItem[];
  natureTech: DataItem[];
  special?: string;
};

type DateInfo = {
  dayOfWeek: string;
  formattedDate: string;
};

export function useDayData() {
  const [todayData, setTodayData] = useState<TodayData>({
    saint: null,
    celebrities: [],
    history: [],
    popCulture: [],
    natureTech: [],
    special: undefined,
  });

  const [dateInfo, setDateInfo] = useState<DateInfo>({
    dayOfWeek: "",
    formattedDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const year = now.getFullYear();

      const dayOfWeek = now
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();

      const formattedDate = now.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });

      setDateInfo({ dayOfWeek, formattedDate });

      const data = await getDailyFacts(month, day);

      if (data && data.length > 0) {
        const dayData = data[0];
        const items = dayData.payload.items || [];

        const celebrities = items.filter(
          (item: DataItem) => item.category === "Celeb"
        );
        const history = items.filter(
          (item: DataItem) => item.category === "History"
        );
        const popCulture = items.filter(
          (item: DataItem) => item.category === "Pop Culture"
        );
        const natureTech = items.filter(
          (item: DataItem) => item.category === "Nature & Tech"
        );

        const saint = dayData.payload.saint || null;

        // Check for movable holiday first, fallback to database special
        const movableHoliday = getMovableHoliday(month, day, year);
        const special = movableHoliday || dayData.payload.special || undefined;

        setTodayData({
          saint,
          celebrities,
          history,
          popCulture,
          natureTech,
          special,
        });
      }
    };

    fetchData();
  }, []);

  return { todayData, dateInfo };
}
