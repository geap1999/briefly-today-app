import React, { createContext, useContext, useEffect, useState } from "react";

export type Region = "US" | "EU";

interface TimezoneContextType {
  region: Region;
  timezone: string;
  isLoading: boolean;
  isFrance: boolean;
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(
  undefined,
);

const REGION_TIMEZONES: Record<Region, string> = {
  US: "America/Chicago",
  EU: "Europe/Paris",
};

// List of European timezones
const EUROPEAN_TIMEZONES = [
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Rome",
  "Europe/Amsterdam",
  "Europe/Brussels",
  "Europe/Vienna",
  "Europe/Warsaw",
  "Europe/Prague",
  "Europe/Stockholm",
  "Europe/Copenhagen",
  "Europe/Oslo",
  "Europe/Helsinki",
  "Europe/Athens",
  "Europe/Bucharest",
  "Europe/Budapest",
  "Europe/Dublin",
  "Europe/Lisbon",
  "Europe/Zurich",
];

const FRENCH_TIMEZONES = [
  "Europe/Paris",
  "Indian/Reunion",
  "Indian/Mayotte",
  "America/Martinique",
  "America/Guadeloupe",
  "America/Cayenne",
  "Pacific/Tahiti",
  "Pacific/Noumea",
  "Pacific/Marquesas",
  "Indian/Kerguelen",
];

const detectIsFrance = (): boolean => {
  try {
    const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return FRENCH_TIMEZONES.some(
      (tz) => deviceTimezone === tz || deviceTimezone.includes(tz),
    );
  } catch (error) {
    console.error("Error detecting France timezone:", error);
    return false;
  }
};

const detectRegion = (): Region => {
  try {
    const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (
      EUROPEAN_TIMEZONES.some((tz) => deviceTimezone.includes(tz)) ||
      deviceTimezone.startsWith("Europe/")
    ) {
      return "EU";
    }

    // Default to US for Americas and other regions
    return "US";
  } catch (error) {
    console.error("Error detecting timezone:", error);
    return "US"; // Default to US if detection fails
  }
};

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<Region>("US");
  const [isFrance, setIsFrance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectedRegion = detectRegion();
    const detectedIsFrance = detectIsFrance();

    setRegionState(detectedRegion);
    setIsFrance(detectedIsFrance);
    setIsLoading(false);
  }, []);

  const timezone = REGION_TIMEZONES[region];

  return (
    <TimezoneContext.Provider value={{ region, timezone, isLoading, isFrance }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export function useTimezone() {
  const context = useContext(TimezoneContext);
  if (context === undefined) {
    throw new Error("useTimezone must be used within a TimezoneProvider");
  }
  return context;
}
