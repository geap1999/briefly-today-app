import React, { createContext, useContext, useEffect, useState } from "react";

export type Region = "US" | "EU";

interface TimezoneContextType {
  region: Region;
  timezone: string;
  isLoading: boolean;
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(
  undefined
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

// Detect region based on device timezone
const detectRegion = (): Region => {
  try {
    const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("Detected device timezone:", deviceTimezone);

    // Check if timezone starts with Europe/
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectedRegion = detectRegion();
    setRegionState(detectedRegion);
    setIsLoading(false);
  }, []);

  const timezone = REGION_TIMEZONES[region];

  return (
    <TimezoneContext.Provider value={{ region, timezone, isLoading }}>
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
