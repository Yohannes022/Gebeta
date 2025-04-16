import React from "react";
import { Tabs } from "expo-router";
import { StyleSheet, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import Colors from "@/constants/colors";
import { Home, Search, Compass, Calendar, User, Plus } from "lucide-react-native";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactive,
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="light"
            style={[
              styles.tabBarBackground,
              {
                height: 60 + insets.bottom,
                paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
              }
            ]}
          />
        ),
        tabBarStyle: [
          styles.tabBar,
          {
            height: 55 + insets.bottom,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
            marginBottom: Platform.OS === 'ios' ? 10 : 0,
            marginHorizontal: Platform.OS === 'ios' ? 20 : 0,
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: 35,
            borderCurve: 'continuous',
            overflow: 'hidden',
            

          }
        ],
        headerShown: false,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 0,
    overflow: 'hidden',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  tabBarItem: {
    paddingTop: 8,
  },
});