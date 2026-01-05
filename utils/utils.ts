import { differenceInSeconds } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import * as WebBrowser from 'expo-web-browser';

export const getMovableHoliday = (month: number, day: number, year: number): string | null => {
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();
  const nthDay = Math.ceil(day / 7);

  if (month === 1 && dayOfWeek === 1 && nthDay === 3) return "MLK Day";
  if (month === 2 && dayOfWeek === 1 && nthDay === 3) return "Presidents' Day";
  if (month === 5 && dayOfWeek === 1 && day > 24) return "Memorial Day";
  if (month === 9 && dayOfWeek === 1 && nthDay === 1) return "Labor Day";
  if (month === 11 && dayOfWeek === 4 && nthDay === 4) return "Thanksgiving";
  const easter = calculateEaster(year);
  if (month === easter.month && day === easter.day) return "Easter Sunday";

  return null;
};

const calculateEaster = (year: number): { month: number; day: number } => {
  const f = Math.floor, G = year % 19, C = f(year / 100), H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)), J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    L = I - J, month = 3 + f((L + 40) / 44), day = L + 28 - 31 * f(month / 4);
  return { month, day };
};

export const getScoopCountdown = (now = new Date()) => {
  const timeZone = 'America/New_York';
  
  const currentHourET = parseInt(formatInTimeZone(now, timeZone, 'H'));
  const currentMinuteET = parseInt(formatInTimeZone(now, timeZone, 'm'));
  
  const todayDateET = formatInTimeZone(now, timeZone, 'yyyy-MM-dd');
  const targetString = `${todayDateET}T19:00:00`;
  const target = new Date(targetString + formatInTimeZone(now, timeZone, 'xxx'));
  
  if (currentHourET >= 19) {
    return { isPast7PM: true, hours: 0, minutes: 0, seconds: 0 };
  }
  
  const totalSeconds = differenceInSeconds(target, now);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return { isPast7PM: false, hours, minutes, seconds };
};

export const handleOpenArticle = async (url: string, accentColor: string) => {
    await WebBrowser.openBrowserAsync(url, {
      toolbarColor: accentColor,
      enableBarCollapsing: true,
      showTitle: true,
    });
  };