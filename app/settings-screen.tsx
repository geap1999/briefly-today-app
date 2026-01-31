import LanguageSelector from "@/components/ui/language-selector";
import { useLocale } from "@/contexts/locale-context";
import { useTheme } from "@/contexts/theme-context";
import {
  getFontSize,
  getHorizontalPadding,
  getMaxContentWidth,
} from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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
  const { isDarkMode, setThemeMode } = useTheme();
  const { t } = useLocale();
  const horizontalPadding = getHorizontalPadding();
  const maxContentWidth = getMaxContentWidth();

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack();
  };

  const handleDarkModeToggle = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setThemeMode(value ? "dark" : "light");
  };

  const handlePrivacyPolicyPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(
      "https://doc-hosting.flycricket.io/briefly-today/0cb5694f-700a-4bb5-9b1b-9282afe463e1/privacy",
    );
  };

  const handleTermsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(
      "https://doc-hosting.flycricket.io/briefly-today-tc/7b7ab7da-bd21-4a69-bcf6-05084d1dc55f/terms",
    );
  };

  const handleContactPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(
      "mailto:guillaumeeap@gmail.com?subject=Briefly Today Feedback",
    );
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={
          isDarkMode
            ? ["#1E293B", "#0F172A", "#020617"]
            : ["#E0F2FE", "#DBEAFE", "#E0E7FF"]
        }
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
            <View className="flex-row items-center mb-16">
              <TouchableOpacity
                onPress={handleBackPress}
                className="p-2 -ml-2"
                activeOpacity={0.7}
              >
                <Ionicons
                  name="arrow-back"
                  size={28}
                  color={isDarkMode ? "#93C5FD" : "#3B82F6"}
                />
              </TouchableOpacity>
              <Text
                className="font-black ml-2"
                style={{
                  fontSize: getFontSize(32),
                  color: isDarkMode ? "#93C5FD" : "#3B82F6",
                  letterSpacing: -0.5,
                }}
              >
                {t("settings")}
              </Text>
            </View>

            {/* Settings Sections */}
            <View
              className="rounded-3xl overflow-hidden shadow-sm"
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(30, 41, 59, 0.7)"
                  : "rgba(255, 255, 255, 0.7)",
              }}
            >
              {/* Appearance Section */}
              <View className="px-6 py-5">
                <Text
                  className="font-bold mb-4"
                  style={{
                    fontSize: getFontSize(18),
                    color: isDarkMode ? "#F1F5F9" : "#1E293B",
                  }}
                >
                  {t("appearance")}
                </Text>

                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text
                      className="font-semibold"
                      style={{
                        fontSize: getFontSize(16),
                        color: isDarkMode ? "#E2E8F0" : "#334155",
                      }}
                    >
                      {t("darkMode")}
                    </Text>
                  </View>
                  <Switch
                    value={isDarkMode}
                    onValueChange={handleDarkModeToggle}
                    trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
                    thumbColor={isDarkMode ? "#3B82F6" : "#F1F5F9"}
                  />
                </View>

                {/* Language Selector */}
                <View className="mt-4">
                  <LanguageSelector isDarkMode={isDarkMode} />
                </View>
              </View>

              {/* Divider */}
              <View
                className="h-px mx-6"
                style={{ backgroundColor: isDarkMode ? "#334155" : "#E2E8F0" }}
              />

              {/* Legal Section */}
              <View className="px-6 py-5">
                <Text
                  className="font-bold mb-4"
                  style={{
                    fontSize: getFontSize(18),
                    color: isDarkMode ? "#F1F5F9" : "#1E293B",
                  }}
                >
                  {t("legal")}
                </Text>

                <TouchableOpacity
                  onPress={handlePrivacyPolicyPress}
                  className="flex-row items-center justify-between py-3"
                  activeOpacity={0.7}
                >
                  <Text
                    className="font-semibold"
                    style={{
                      fontSize: getFontSize(16),
                      color: isDarkMode ? "#E2E8F0" : "#334155",
                    }}
                  >
                    {t("privacyPolicy")}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDarkMode ? "#64748B" : "#94A3B8"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleTermsPress}
                  className="flex-row items-center justify-between py-3"
                  activeOpacity={0.7}
                >
                  <Text
                    className="font-semibold"
                    style={{
                      fontSize: getFontSize(16),
                      color: isDarkMode ? "#E2E8F0" : "#334155",
                    }}
                  >
                    {t("termsOfService")}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDarkMode ? "#64748B" : "#94A3B8"}
                  />
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View
                className="h-px mx-6"
                style={{ backgroundColor: isDarkMode ? "#334155" : "#E2E8F0" }}
              />

              {/* About Section */}
              <View className="px-6 py-5">
                <Text
                  className="font-bold mb-4"
                  style={{
                    fontSize: getFontSize(18),
                    color: isDarkMode ? "#F1F5F9" : "#1E293B",
                  }}
                >
                  {t("about")}
                </Text>

                <View className="py-2">
                  <Text
                    className="font-semibold mb-1"
                    style={{
                      fontSize: getFontSize(16),
                      color: isDarkMode ? "#E2E8F0" : "#334155",
                    }}
                  >
                    {t("version")}
                  </Text>
                  <Text
                    style={{
                      fontSize: getFontSize(14),
                      color: isDarkMode ? "#94A3B8" : "#64748B",
                    }}
                  >
                    1.4.0
                  </Text>
                </View>
              </View>
            </View>

            {/* Contact Section */}
            <View
              className="mt-6 rounded-3xl overflow-hidden shadow-sm px-6 py-5"
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(30, 41, 59, 0.7)"
                  : "rgba(255, 255, 255, 0.7)",
              }}
            >
              <Text
                className="text-center mb-3"
                style={{
                  fontSize: getFontSize(15),
                  color: isDarkMode ? "#E2E8F0" : "#334155",
                }}
              >
                {t("contactMessage")}
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
                  {t("contactUs")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="mt-8 items-center">
              <Text
                className="text-center"
                style={{
                  fontSize: getFontSize(14),
                  color: isDarkMode ? "#94A3B8" : "#64748B",
                }}
              >
                {t("madeForMessage")}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
