import { useLocale } from "@/contexts/locale-context";
import { useTimezone } from "@/contexts/timezone-context";
import {
  registerPushToken,
  updatePushTokenRegion,
} from "@/services/supabase/notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";
import mobileAds, {
  AdsConsent,
  AdsConsentStatus,
} from "react-native-google-mobile-ads";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface ConsentHandlerProps {
  children: React.ReactNode;
}

export default function ConsentHandler({ children }: ConsentHandlerProps) {
  const { region, isLoading: isTimezoneLoading } = useTimezone();
  const { t } = useLocale();
  const [canStartApp, setCanStartApp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const floatAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withRepeat(
            withSequence(
              withTiming(-5, { duration: 1500 }),
              withTiming(0, { duration: 1500 }),
            ),
            -1,
            true,
          ),
        },
      ],
    };
  });

  useEffect(() => {
    async function setupPrivacyAndAds() {
      // Wait for timezone to be loaded before proceeding
      if (isTimezoneLoading) {
        return;
      }

      try {
        const consentInfo = await AdsConsent.requestInfoUpdate();
        if (
          consentInfo.isConsentFormAvailable &&
          consentInfo.status === AdsConsentStatus.REQUIRED
        ) {
          await AdsConsent.showForm();
        }
        await mobileAds().initialize();

        // Set notification handler before registering
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });

        await registerForPushNotificationsAsync();

        setCanStartApp(true);
      } catch (e) {
        console.error("Error during consent or ads initialization", e);
        setError(e instanceof Error ? e.message : "Unknown error occurred");
        setCanStartApp(true);
      }
    }

    async function registerForPushNotificationsAsync() {
      try {
        // Set up Android notification channel
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        }

        // Check if running on a physical device
        if (!Device.isDevice) {
          console.log("Must use physical device for push notifications");
          return;
        }

        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          return;
        }

        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;

        if (!projectId) {
          console.error("Project ID not found");
          return;
        }

        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId,
        });

        const regionValue = region === "EU" ? "EU" : "US";
        await registerPushToken(tokenData.data, regionValue);
      } catch (e) {
        console.error("Error during notification registration", e);
      }
    }

    setupPrivacyAndAds();
  }, [region, isTimezoneLoading]);

  useEffect(() => {
    async function updateRegionIfNeeded() {
      try {
        if (!Device.isDevice) return;

        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        if (!projectId) return;

        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId,
        });

        const regionValue = region === "EU" ? "EU" : "US";
        await updatePushTokenRegion(tokenData.data, regionValue);
      } catch (e) {
        console.error("Error updating region", e);
      }
    }

    // Only run if we have a region and can start app
    if (canStartApp && region) {
      updateRegionIfNeeded();
    }
  }, [region, canStartApp]);

  if (!canStartApp) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Animated.Image
          source={require("@/assets/images/delivery.png")}
          style={[{ width: 80, height: 80 }, floatAnimation]}
          resizeMode="contain"
        />
        <Text className="mt-4 text-gray-600 font-semibold">{t("loading")}</Text>
        {error && (
          <Text className="mt-2 text-red-500 text-xs px-4 text-center">
            {error}
          </Text>
        )}
      </View>
    );
  }

  return <>{children}</>;
}
