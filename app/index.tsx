import ConsentHandler from "@/components/consent-handler";
import { useState } from "react";
import HomeScreen from "./home-screen";
import SettingsScreen from "./settings-screen";

export default function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <ConsentHandler>
      {showSettings ? (
        <SettingsScreen onBack={() => setShowSettings(false)} />
      ) : (
        <HomeScreen onSettingsPress={() => setShowSettings(true)} />
      )}
    </ConsentHandler>
  );
}
