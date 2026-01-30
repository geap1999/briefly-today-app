import WarningModal from "@/components/ui/warning-modal";
import { useTheme } from "@/contexts/theme-context";
import { getArchives } from "@/services/supabase/scoop";
import {
  getLikedFactsCountByCategory,
  isFactLiked,
  likeFact,
  MAX_LIKES_PER_CATEGORY,
  unlikeFact,
} from "@/utils/liked-facts";
import {
  getFontSize,
  getHorizontalPadding,
  getMaxContentWidth,
  useResponsive,
} from "@/utils/responsive";
import { handleOpenArticle } from "@/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ArchiveScoop {
  id: number;
  title: string;
  content: string;
  category: string;
  image_url: string;
  source_name: string;
  url: string;
  date: string;
}

interface ArchivesScreenProps {
  onBack: () => void;
}

export default function ArchivesScreen({ onBack }: ArchivesScreenProps) {
  const { isDarkMode } = useTheme();
  const [archives, setArchives] = useState<ArchiveScoop[]>([]);
  const [loading, setLoading] = useState(true);
  const { isTablet } = useResponsive();
  const horizontalPadding = getHorizontalPadding();
  const maxContentWidth = getMaxContentWidth();
  const [likedStatus, setLikedStatus] = useState<Record<string, boolean>>({});
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    const fetchArchives = async () => {
      setLoading(true);
      const data = await getArchives();
      setArchives(data);

      // Check liked status for all archives
      const statusMap: Record<string, boolean> = {};
      for (const scoop of data) {
        if (scoop.title) {
          statusMap[scoop.title] = await isFactLiked(scoop.title);
        }
      }
      setLikedStatus(statusMap);

      setLoading(false);
    };
    fetchArchives();
  }, []);

  const handleLike = async (scoop: ArchiveScoop, e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!scoop) return;

    try {
      const isLiked = likedStatus[scoop.title];

      if (isLiked) {
        await unlikeFact(scoop.title);
        setLikedStatus((prev) => ({ ...prev, [scoop.title]: false }));
      } else {
        const categoryCount = await getLikedFactsCountByCategory("Scoop");
        if (categoryCount >= MAX_LIKES_PER_CATEGORY) {
          setShowWarningModal(true);
          return;
        }
        await likeFact(scoop.title, scoop.content, scoop.url, "Scoop");
        setLikedStatus((prev) => ({ ...prev, [scoop.title]: true }));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <LinearGradient
      colors={
        isDarkMode
          ? ["#1E293B", "#0F172A", "#020617"]
          : ["#E0F2FE", "#DBEAFE", "#E0E7FF"]
      }
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingBottom: 40,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth:
                typeof maxContentWidth === "number"
                  ? maxContentWidth
                  : undefined,
              alignSelf: "center",
            }}
          >
            {/* Header */}
            <View className="flex-row items-center mb-6 mt-4">
              <TouchableOpacity
                onPress={onBack}
                className="rounded-full p-3 mr-3"
                activeOpacity={0.7}
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(30, 41, 59, 0.7)"
                    : "rgba(255, 255, 255, 0.7)",
                }}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={isDarkMode ? "#fff" : "#000"}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: getFontSize(28),
                  fontWeight: "bold",
                  color: isDarkMode ? "#fff" : "#1F2937",
                }}
              >
                Archives
              </Text>
            </View>

            {/* Content */}
            {loading ? (
              <View className="items-center justify-center py-20">
                <ActivityIndicator
                  size="large"
                  color={isDarkMode ? "#60A5FA" : "#3B82F6"}
                />
              </View>
            ) : archives.length === 0 ? (
              <View className="items-center justify-center py-20">
                <Text
                  style={{
                    fontSize: getFontSize(16),
                    color: isDarkMode ? "#94A3B8" : "#64748B",
                    textAlign: "center",
                  }}
                >
                  No archived scoops available yet
                </Text>
              </View>
            ) : (
              <View className="gap-4">
                {archives.map((scoop) => (
                  <View
                    key={scoop.id}
                    className="rounded-3xl overflow-hidden"
                    style={{
                      backgroundColor: isDarkMode
                        ? "rgba(30, 41, 59, 0.7)"
                        : "rgba(255, 255, 255, 0.8)",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 5,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleOpenArticle(scoop.url, "#3B82F6")}
                      activeOpacity={0.9}
                    >
                      {/* Image */}
                      {scoop.image_url && (
                        <Image
                          source={{ uri: scoop.image_url }}
                          style={{
                            width: "100%",
                            height: 200,
                          }}
                          resizeMode="cover"
                        />
                      )}

                      {/* Content */}
                      <View className="p-5">
                        {/* Date Badge */}
                        <View
                          className="self-start px-3 py-1.5 rounded-full mb-3"
                          style={{
                            backgroundColor: isDarkMode
                              ? "rgba(96, 165, 250, 0.2)"
                              : "rgba(59, 130, 246, 0.1)",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: getFontSize(12),
                              fontWeight: "600",
                              color: isDarkMode ? "#60A5FA" : "#3B82F6",
                            }}
                          >
                            {formatDate(scoop.date)}
                          </Text>
                        </View>

                        {/* Title */}
                        <Text
                          style={{
                            fontSize: getFontSize(20),
                            fontWeight: "bold",
                            color: isDarkMode ? "#fff" : "#1F2937",
                            marginBottom: 8,
                            lineHeight: getFontSize(26),
                          }}
                        >
                          {scoop.title}
                        </Text>

                        {/* Content */}
                        <Text
                          style={{
                            fontSize: getFontSize(14),
                            color: isDarkMode ? "#CBD5E1" : "#64748B",
                            marginBottom: 12,
                            lineHeight: getFontSize(20),
                          }}
                          numberOfLines={3}
                        >
                          {scoop.content}
                        </Text>

                        {/* Source */}
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center gap-1.5">
                            <Ionicons
                              name="newspaper-outline"
                              size={16}
                              color={isDarkMode ? "#94A3B8" : "#94A3B8"}
                            />
                            <Text
                              style={{
                                fontSize: getFontSize(12),
                                color: isDarkMode ? "#94A3B8" : "#94A3B8",
                              }}
                            >
                              {scoop.source_name}
                            </Text>
                          </View>
                          <View className="flex-row items-center gap-1">
                            <Text
                              style={{
                                fontSize: getFontSize(12),
                                color: isDarkMode ? "#60A5FA" : "#3B82F6",
                                fontWeight: "600",
                              }}
                            >
                              Read more
                            </Text>
                            <Ionicons
                              name="arrow-forward"
                              size={14}
                              color={isDarkMode ? "#60A5FA" : "#3B82F6"}
                            />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Like Button - positioned absolutely on top */}
                    <TouchableOpacity
                      onPress={(e) => handleLike(scoop, e)}
                      className="absolute top-4 right-4 rounded-full p-2.5"
                      activeOpacity={0.7}
                      style={{
                        backgroundColor: isDarkMode
                          ? "rgba(30, 41, 59, 0.9)"
                          : "rgba(255, 255, 255, 0.9)",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                    >
                      <Ionicons
                        name={
                          likedStatus[scoop.title] ? "heart" : "heart-outline"
                        }
                        size={22}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
        <WarningModal
          visible={showWarningModal}
          onClose={() => setShowWarningModal(false)}
          category="Scoop"
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
