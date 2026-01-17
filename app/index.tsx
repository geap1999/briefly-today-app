import ConsentHandler from "@/components/consent-handler";
import { ThemeProvider } from "@/contexts/theme-context";
import { TimezoneProvider } from "@/contexts/timezone-context";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import HomeScreen from "./home-screen";
import SettingsScreen from "./settings-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  const onLayoutRootView = useCallback(async () => {
    // Layout is ready
  }, []);

  if (!appIsReady) {
    return (
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <ThemeProvider>
          <TimezoneProvider>
            <ConsentHandler>
              <HomeScreen
                onSettingsPress={() => setShowSettings(true)}
                onDataLoaded={() => setAppIsReady(true)}
              />
            </ConsentHandler>
          </TimezoneProvider>
        </ThemeProvider>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider>
        <TimezoneProvider>
          <ConsentHandler>
            {showSettings ? (
              <SettingsScreen onBack={() => setShowSettings(false)} />
            ) : (
              <HomeScreen
                onSettingsPress={() => setShowSettings(true)}
                onDataLoaded={() => setAppIsReady(true)}
              />
            )}
          </ConsentHandler>
        </TimezoneProvider>
      </ThemeProvider>
    </View>
  );
}
