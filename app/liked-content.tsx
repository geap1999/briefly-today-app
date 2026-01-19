import { useTheme } from "@/contexts/theme-context";
import { getLikedFacts, LikedFact, unlikeFact } from "@/utils/liked-facts";
import {
  getFontSize,
  getHorizontalPadding,
  getMaxContentWidth,
  useResponsive,
} from "@/utils/responsive";
import { handleOpenArticle } from "@/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
import "../global.css";

interface LikedContentScreenProps {
  onBack: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Scoop: "#9333EA",
  Celeb: "#F59E0B",
  "Pop Culture": "#EC4899",
  History: "#3B82F6",
  "Nature & Tech": "#10B981",
};

const CATEGORY_LABELS: Record<string, string> = {
  Scoop: "Scoop",
  Celeb: "Birthday",
  "Pop Culture": "Pop Culture",
  History: "History",
  "Nature & Tech": "Breakthrough",
};

const FILTER_CATEGORIES = [
  { key: "All", label: "All", color: "#EF4444" },
  { key: "Scoop", label: "Scoops", color: "#9333EA" },
  { key: "Celeb", label: "Birthdays", color: "#F59E0B" },
  { key: "Pop Culture", label: "Pop Culture", color: "#EC4899" },
  { key: "History", label: "History", color: "#3B82F6" },
  { key: "Nature & Tech", label: "Breakthroughs", color: "#10B981" },
];

export default function LikedContentScreen({
  onBack,
}: LikedContentScreenProps) {
  const { isDarkMode } = useTheme();
  const { isTablet } = useResponsive();
  const horizontalPadding = getHorizontalPadding();
  const maxContentWidth = getMaxContentWidth();
  const [likedFacts, setLikedFacts] = useState<LikedFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    loadLikedFacts();
  }, []);

  const loadLikedFacts = async () => {
    setLoading(true);
    const facts = await getLikedFacts();
    // Sort by most recently liked
    const sorted = facts.sort(
      (a, b) => new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime(),
    );
    setLikedFacts(sorted);
    setLoading(false);
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack();
  };

  const handleUnlike = async (title: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await unlikeFact(title);
      setLikedFacts((prev) => prev.filter((fact) => fact.title !== title));
    } catch (error) {
      console.error("Error unliking fact:", error);
    }
  };

  const handleFilterPress = (filter: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFilter(filter);
  };

  // Filter facts based on selected category
  const filteredFacts =
    selectedFilter === "All"
      ? likedFacts
      : likedFacts.filter((fact) => fact.category === selectedFilter);

  // Get count for each category
  const getCategoryCount = (category: string) => {
    if (category === "All") return likedFacts.length;
    return likedFacts.filter((fact) => fact.category === category).length;
  };

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: isDarkMode ? "#0F172A" : "#FEE2E2" }}
    >
      <SafeAreaView edges={["top", "bottom"]} className="flex-1">
        <View
          style={{
            flex: 1,
            paddingHorizontal: horizontalPadding,
            paddingTop: 20,
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
              flex: 1,
            }}
          >
            {/* Header */}
            <View className="flex-row items-center mb-6">
              <TouchableOpacity
                onPress={handleBackPress}
                className="p-2 -ml-2"
                activeOpacity={0.7}
              >
                <Ionicons
                  name="arrow-back"
                  size={28}
                  color={isDarkMode ? "#FCA5A5" : "#EF4444"}
                />
              </TouchableOpacity>
              <View className="flex-row items-center ml-2 flex-1">
                <Text
                  className="font-black ml-2"
                  style={{
                    fontSize: getFontSize(32),
                    color: isDarkMode ? "#FCA5A5" : "#EF4444",
                    letterSpacing: -0.5,
                  }}
                >
                  Likes
                </Text>
                <Image
                  source={require("@/assets/images/likes.png")}
                  style={{ width: 60, height: 60, marginLeft: 5 }}
                  resizeMode="contain"
                />
              </View>
            </View>
            {/* Filter Bar */}
            {!loading && likedFacts.length > 0 && (
              <View className="mb-6">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 2,
                    paddingVertical: 6,
                  }}
                  style={{ flexGrow: 0 }}
                >
                  {FILTER_CATEGORIES.map((category) => {
                    const isActive = selectedFilter === category.key;
                    const count = getCategoryCount(category.key);
                    return (
                      <TouchableOpacity
                        key={category.key}
                        onPress={() => handleFilterPress(category.key)}
                        activeOpacity={0.7}
                        style={{
                          marginRight: isTablet ? 12 : 8,
                          paddingHorizontal: isTablet ? 20 : 16,
                          paddingVertical: isTablet ? 14 : 12,
                          height: isTablet ? 52 : 44,
                          borderRadius: isTablet ? 26 : 22,
                          backgroundColor: isActive
                            ? category.color
                            : isDarkMode
                              ? "rgba(30, 41, 59, 0.5)"
                              : "rgba(255, 255, 255, 0.5)",
                          borderWidth: isActive ? 2 : 0,
                          borderColor: isActive
                            ? category.color
                            : "transparent",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View className="flex-row items-center gap-2">
                          <Text
                            className="font-bold"
                            style={{
                              fontSize: getFontSize(14),
                              color: isActive
                                ? "#FFFFFF"
                                : isDarkMode
                                  ? "#E2E8F0"
                                  : "#334155",
                            }}
                          >
                            {category.label}
                          </Text>
                          <View
                            style={{
                              backgroundColor: isActive
                                ? "rgba(255, 255, 255, 0.3)"
                                : category.color,
                              height: isTablet ? 28 : 24,
                              minWidth: isTablet ? 28 : 24,
                              paddingHorizontal: isTablet ? 8 : 6,
                              borderRadius: 12,
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: 1,
                            }}
                          >
                            <Text
                              className="font-bold"
                              style={{
                                fontSize: getFontSize(12),
                                color: "#FFFFFF",
                                lineHeight: getFontSize(12),
                              }}
                            >
                              {count > 0 ? count : "0"}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Content */}
            {loading ? (
              <View className="items-center py-12">
                <ActivityIndicator
                  size="large"
                  color={isDarkMode ? "#FCA5A5" : "#EF4444"}
                />
              </View>
            ) : likedFacts.length === 0 ? (
              <View
                className="rounded-3xl px-8 py-16 mt-20"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(30, 41, 59, 0.7)"
                    : "rgba(255, 255, 255, 0.7)",
                }}
              >
                <Text className="text-center text-6xl mb-4">💔</Text>
                <Text
                  className="font-bold text-center mb-2"
                  style={{
                    fontSize: getFontSize(20),
                    color: isDarkMode ? "#F1F5F9" : "#1E293B",
                  }}
                >
                  No Likes Yet
                </Text>
                <Text
                  className="text-center"
                  style={{
                    fontSize: getFontSize(15),
                    color: isDarkMode ? "#94A3B8" : "#64748B",
                  }}
                >
                  You can like up to 20 facts per category, just tap the heart
                  icon!
                </Text>
              </View>
            ) : filteredFacts.length === 0 ? (
              <View
                className="rounded-3xl px-8 py-12 mt-8"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(30, 41, 59, 0.7)"
                    : "rgba(255, 255, 255, 0.7)",
                }}
              >
                <Text
                  className="font-bold text-center"
                  style={{
                    fontSize: getFontSize(18),
                    color: isDarkMode ? "#F1F5F9" : "#1E293B",
                  }}
                >
                  No likes yet!
                </Text>
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {filteredFacts.map((fact, index) => {
                  const categoryColor =
                    CATEGORY_COLORS[fact.category] || "#6366F1";
                  const categoryLabel =
                    CATEGORY_LABELS[fact.category] || fact.category;

                  return (
                    <TouchableOpacity
                      key={`${fact.title}-${index}`}
                      activeOpacity={0.95}
                      onPress={() => handleOpenArticle(fact.url, categoryColor)}
                      style={{ marginBottom: isTablet ? 16 : 12 }}
                    >
                      <View
                        className="rounded-3xl overflow-hidden"
                        style={{
                          backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 8,
                          elevation: 3,
                        }}
                      >
                        <View style={{ padding: isTablet ? 24 : 20 }}>
                          {/* Category Badge + Heart */}
                          <View className="flex-row items-center justify-between mb-3">
                            <View
                              className="flex-row items-center rounded-2xl"
                              style={{
                                backgroundColor: categoryColor,
                                paddingHorizontal: isTablet ? 12 : 10,
                                paddingVertical: isTablet ? 6 : 5,
                              }}
                            >
                              <Text
                                className="font-bold mr-1"
                                style={{
                                  fontSize: getFontSize(12),
                                  color: "#FFFFFF",
                                }}
                              >
                                {categoryLabel}
                              </Text>
                              <Text
                                className="font-semibold"
                                style={{
                                  fontSize: getFontSize(11),
                                  color: "#FFFFFF",
                                  opacity: 0.9,
                                }}
                              >
                                {fact.month}/{fact.day}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={(e) => {
                                e.stopPropagation();
                                handleUnlike(fact.title);
                              }}
                              activeOpacity={0.7}
                              style={{ padding: isTablet ? 8 : 6 }}
                            >
                              <Ionicons
                                name="heart"
                                size={isTablet ? 28 : 24}
                                color="#EF4444"
                              />
                            </TouchableOpacity>
                          </View>

                          {/* Title & Content */}
                          <Text
                            className="font-black mb-2"
                            style={{
                              fontSize: getFontSize(18),
                              letterSpacing: -0.2,
                              color: isDarkMode ? "#F1F5F9" : "#0F172A",
                              lineHeight: getFontSize(18) * 1.3,
                            }}
                          >
                            {fact.title}
                          </Text>
                          <Text
                            className="font-medium mb-3"
                            style={{
                              fontSize: getFontSize(14),
                              color: isDarkMode ? "#CBD5E1" : "#475569",
                              lineHeight: getFontSize(14) * 1.6,
                            }}
                          >
                            {fact.content}
                          </Text>

                          {/* Learn More */}
                          <View className="flex-row items-center">
                            <View
                              className="rounded-full mr-2"
                              style={{
                                width: isTablet ? 6 : 4,
                                height: isTablet ? 6 : 4,
                                backgroundColor: categoryColor,
                              }}
                            />
                            <Text
                              className="font-bold"
                              style={{
                                fontSize: getFontSize(14),
                                color: categoryColor,
                                letterSpacing: 0.3,
                              }}
                            >
                              Learn more
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
