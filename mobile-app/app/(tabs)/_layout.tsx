import { Tabs } from "expo-router";
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F7F5" }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 80 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 10,
            backgroundColor: "white",
            borderTopWidth: 0,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            position: "absolute",
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("common.home"),
            tabBarIcon: ({ focused }) => (
              <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
                <Ionicons name="home" size={24} color={focused ? "white" : "#7A7A7A"} />
                <Text style={[styles.tabLabel, { color: focused ? "white" : "#7A7A7A" }]}>{t("common.home")}</Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="listings"
          options={{
            title: t("common.listings"),
            tabBarIcon: ({ focused }) => (
              <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
                <MaterialIcons name="list-alt" size={26} color={focused ? "white" : "#7A7A7A"} />
                <Text style={[styles.tabLabel, { color: focused ? "white" : "#7A7A7A" }]}>{t("common.listings")}</Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: t("common.orders"),
            tabBarIcon: ({ focused }) => (
              <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
                <Feather name="shopping-bag" size={22} color={focused ? "white" : "#7A7A7A"} />
                <Text style={[styles.tabLabel, { color: focused ? "white" : "#7A7A7A" }]}>{t("common.orders")}</Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t("common.profile"),
            tabBarIcon: ({ focused }) => (
              <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
                <Feather name="user" size={24} color={focused ? "white" : "#7A7A7A"} />
                <Text style={[styles.tabLabel, { color: focused ? "white" : "#7A7A7A" }]}>{t("common.profile")}</Text>
              </View>
            ),
          }}
        />
      </Tabs>
      
      {/* Floating Action Button */}
      <TouchableOpacity style={[styles.fab, { bottom: 95 + insets.bottom }]}>
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    height: 64,
    width: 70,
    marginTop: 10,
  },
  tabItemFocused: {
    backgroundColor: "#085836",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#9B4C11", // Brownish color for "+ "
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
