import {
  getFontSize,
  getHorizontalPadding,
  getMaxContentWidth,
} from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Linking,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const horizontalPadding = getHorizontalPadding();
  const maxContentWidth = getMaxContentWidth();

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack();
  };

  const handleDarkModeToggle = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDarkModeEnabled(value);
    // TODO: Implement dark mode functionality
  };

  const handlePrivacyPolicyPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(
      "https://doc-hosting.flycricket.io/briefly-today/0cb5694f-700a-4bb5-9b1b-9282afe463e1/privacy"
    );
  };

  const handleTermsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(
      "https://doc-hosting.flycricket.io/briefly-today-tc/7b7ab7da-bd21-4a69-bcf6-05084d1dc55f/terms"
    );
  };

  const handleContactPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(
      "mailto:guillaumeeap@gmail.com?subject=Briefly Today Feedback"
    );
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#E0F2FE", "#DBEAFE", "#E0E7FF"]}
        locations={[0, 0.5, 1]}
        className="absolute inset-0"
      />

      <SafeAreaView edges={["top", "bottom"]} className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingTop: 20,
            paddingBottom: 40,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth:
                typeof maxContentWidth === "number"
                  ? maxContentWidth
                  : undefined,
            }}
          >
            {/* Header with Back Button */}
            <View className="flex-row items-center mb-8">
              <TouchableOpacity
                onPress={handleBackPress}
                className="p-2 -ml-2"
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={28} color="#3B82F6" />
              </TouchableOpacity>
              <Text
                className="font-black ml-2"
                style={{
                  fontSize: getFontSize(32),
                  color: "#3B82F6",
                  letterSpacing: -0.5,
                }}
              >
                Settings
              </Text>
            </View>

            {/* Settings Sections */}
            <View className="bg-white/70 rounded-3xl overflow-hidden shadow-sm">
              {/* Appearance Section */}
              <View className="px-6 py-5">
                <Text
                  className="font-bold mb-4"
                  style={{ fontSize: getFontSize(18), color: "#1E293B" }}
                >
                  Appearance
                </Text>

                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text
                      className="font-semibold"
                      style={{ fontSize: getFontSize(16), color: "#334155" }}
                    >
                      Dark Mode
                    </Text>
                    <Text
                      className="mt-1"
                      style={{ fontSize: getFontSize(14), color: "#64748B" }}
                    >
                      Coming soon
                    </Text>
                  </View>
                  <Switch
                    value={darkModeEnabled}
                    onValueChange={handleDarkModeToggle}
                    trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
                    thumbColor={darkModeEnabled ? "#3B82F6" : "#F1F5F9"}
                    disabled={true}
                  />
                </View>
              </View>

              {/* Divider */}
              <View className="h-px bg-slate-200 mx-6" />

              {/* Legal Section */}
              <View className="px-6 py-5">
                <Text
                  className="font-bold mb-4"
                  style={{ fontSize: getFontSize(18), color: "#1E293B" }}
                >
                  Legal
                </Text>

                <TouchableOpacity
                  onPress={handlePrivacyPolicyPress}
                  className="flex-row items-center justify-between py-3"
                  activeOpacity={0.7}
                >
                  <Text
                    className="font-semibold"
                    style={{ fontSize: getFontSize(16), color: "#334155" }}
                  >
                    Privacy Policy
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleTermsPress}
                  className="flex-row items-center justify-between py-3"
                  activeOpacity={0.7}
                >
                  <Text
                    className="font-semibold"
                    style={{ fontSize: getFontSize(16), color: "#334155" }}
                  >
                    Terms of Service
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View className="h-px bg-slate-200 mx-6" />

              {/* About Section */}
              <View className="px-6 py-5">
                <Text
                  className="font-bold mb-4"
                  style={{ fontSize: getFontSize(18), color: "#1E293B" }}
                >
                  About
                </Text>

                <View className="py-2">
                  <Text
                    className="font-semibold mb-1"
                    style={{ fontSize: getFontSize(16), color: "#334155" }}
                  >
                    Version
                  </Text>
                  <Text style={{ fontSize: getFontSize(14), color: "#64748B" }}>
                    1.1.0
                  </Text>
                </View>
              </View>
            </View>

            {/* Contact Section */}
            <View className="mt-6 bg-white/70 rounded-3xl overflow-hidden shadow-sm px-6 py-5">
              <Text
                className="text-center mb-3"
                style={{ fontSize: getFontSize(15), color: "#334155" }}
              >
                Have any errors or suggestions?
              </Text>
              <TouchableOpacity
                onPress={handleContactPress}
                className="bg-blue-500 rounded-full py-3 px-6"
                activeOpacity={0.8}
                style={{
                  shadowColor: "#3B82F6",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  className="text-white font-bold text-center"
                  style={{ fontSize: getFontSize(16) }}
                >
                  Contact Us
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="mt-8 items-center">
              <Text
                className="text-center"
                style={{ fontSize: getFontSize(14), color: "#64748B" }}
              >
                Made with ❤️ for curious minds
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
