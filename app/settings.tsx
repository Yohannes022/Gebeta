import { useRouter } from "expo-router";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Globe,
  HelpCircle,
  LogOut,
  Moon,
  Shield,
} from "lucide-react-native";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
 

import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";

export default function SettingsScreen() {
  const router = useRouter();
  const {
    notificationSettings,
    updateNotificationSettings,
    language,
    setLanguage,
    theme,
    setTheme,
  } = useProfileStore();
  
  const { logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            logout();
            router.replace("/(auth)");
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleLanguageChange = () => {
    Alert.alert(
      "Change Language",
      "Select your preferred language",
      [
        {
          text: "English",
          onPress: () => setLanguage("english"),
        },
        {
          text: "Amharic",
          onPress: () => setLanguage("amharic"),
        },
      ]
    );
  };

  const handleThemeChange = () => {
    Alert.alert(
      "Change Theme",
      "Select your preferred theme",
      [
        {
          text: "Light",
          onPress: () => setTheme("light"),
        },
        {
          text: "Dark",
          onPress: () => setTheme("dark"),
        },
        {
          text: "System",
          onPress: () => setTheme("system"),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={"#2D2D2D"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={"#2D2D2D"} />
              <Text style={styles.settingLabel}>Order Updates</Text>
            </View>
            <Switch
              value={notificationSettings.orderUpdates}
              onValueChange={(value) =>
                updateNotificationSettings({ orderUpdates: value })
              }
              trackColor={{ false: "#E0E0E0", true: "#3E7EA6" }}
              thumbColor={"#FFFFFF"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={"#2D2D2D"} />
              <Text style={styles.settingLabel}>Promotions</Text>
            </View>
            <Switch
              value={notificationSettings.promotions}
              onValueChange={(value) =>
                updateNotificationSettings({ promotions: value })
              }
              trackColor={{ false: "#E0E0E0", true: "#3E7EA6" }}
              thumbColor={"#FFFFFF"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={"#2D2D2D"} />
              <Text style={styles.settingLabel}>New Restaurants</Text>
            </View>
            <Switch
              value={notificationSettings.newRestaurants}
              onValueChange={(value) =>
                updateNotificationSettings({ newRestaurants: value })
              }
              trackColor={{ false: "#E0E0E0", true: "#3E7EA6" }}
              thumbColor={"#FFFFFF"}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleLanguageChange}
          >
            <View style={styles.settingInfo}>
              <Globe size={20} color={"#2D2D2D"} />
              <Text style={styles.settingLabel}>Language</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={styles.settingValueText}>
                {language === "english" ? "English" : "Amharic"}
              </Text>
              <ChevronRight size={20} color={"#8A8A8A"} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleThemeChange}
          >
            <View style={styles.settingInfo}>
              <Moon size={20} color={"#2D2D2D"} />
              <Text style={styles.settingLabel}>Theme</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={styles.settingValueText}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </Text>
              <ChevronRight size={20} color={"#8A8A8A"} />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert("Help Center", "This feature is coming soon!")}
          >
            <View style={styles.settingInfo}>
              <HelpCircle size={20} color={"#2D2D2D"} />
              <Text style={styles.settingLabel}>Help Center</Text>
            </View>
            <ChevronRight size={20} color={"#8A8A8A"} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert("Privacy Policy", "This feature is coming soon!")}
          >
            <View style={styles.settingInfo}>
              <Shield size={20} color={"#2D2D2D"} />
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <ChevronRight size={20} color={"#8A8A8A"} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color={"#E53935"} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5F0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "#F9F5F0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2D2D",
    letterSpacing: 0.2,
  },
  section: {
    backgroundColor: "#F9F5F0",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    marginLeft: 12,
  },
  settingValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValueText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    marginRight: 8,
    // color: "#8A8A8A",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F5F0",
    borderRadius: 16,
    padding: 16,
    margin: 20,
    marginBottom: 8,
  },
  logoutText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    fontWeight: "600",
    marginLeft: 8,
    // color: "#E53935",
  },
  versionText: {
    fontSize: 12,
    color: "#8A8A8A",
    lineHeight: 16,
    textAlign: "center",
    marginBottom: 40,
    // color: "#8A8A8A",
  },
});
