import ConsentHandler from "@/components/consent-handler";
import { LocaleProvider } from "@/contexts/locale-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { TimezoneProvider } from "@/contexts/timezone-context";
import * as SplashScreen from "expo-splash-screen";
import { useState } from "react";
import { View } from "react-native";
import HomeScreen from "./home-screen";
import LikedContentScreen from "./liked-content";
import SettingsScreen from "./settings-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showLikedContent, setShowLikedContent] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <TimezoneProvider>
        <LocaleProvider>
          <ThemeProvider>
            <ConsentHandler>
              {showSettings ? (
                <SettingsScreen onBack={() => setShowSettings(false)} />
              ) : showLikedContent ? (
                <LikedContentScreen onBack={() => setShowLikedContent(false)} />
              ) : (
                <HomeScreen
                  onSettingsPress={() => setShowSettings(true)}
                  onLikedContentPress={() => setShowLikedContent(true)}
                />
              )}
            </ConsentHandler>
          </ThemeProvider>
        </LocaleProvider>
      </TimezoneProvider>
    </View>
  );
}
