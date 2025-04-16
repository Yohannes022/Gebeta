import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Switch,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { 
  User, 
  Heart, 
  Calendar, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Bell,
  CreditCard,
  Globe,
  Shield
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { useAuthStore } from "@/store/auth-store";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => {
            logout();
            router.replace("/auth/login");
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleChangeProfilePicture = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant permission to access your photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      // In a real app, you would upload this image to your server
      // and update the user's profile
      console.log("Selected image:", result.assets[0].uri);
    }
  };

  const handleSavedExperiences = () => {
    router.push("/saved-experiences");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleHelp = () => {
    router.push("/help");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={handleChangeProfilePicture}
          >
            <Image 
              source={{ uri: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" }} 
              style={styles.profileImage} 
            />
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>Edit</Text>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.profileName}>
            {user?.name || "Guest User"}
          </Text>
          <Text style={styles.profileEmail}>
            {user?.email || "guest@example.com"}
          </Text>
          
          {user?.isHost && (
            <TouchableOpacity style={styles.hostButton}>
              <Text style={styles.hostButtonText}>Switch to Host</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleSavedExperiences}>
            <View style={styles.menuIconContainer}>
              <Heart size={20} color={Colors.text} />
            </View>
            <Text style={styles.menuItemText}>Saved Experiences</Text>
            <ChevronRight size={20} color={Colors.lightText} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/bookings")}>
            <View style={styles.menuIconContainer}>
              <Calendar size={20} color={Colors.text} />
            </View>
            <Text style={styles.menuItemText}>Your Bookings</Text>
            <ChevronRight size={20} color={Colors.lightText} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/payment-methods")}>
            <View style={styles.menuIconContainer}>
              <CreditCard size={20} color={Colors.text} />
            </View>
            <Text style={styles.menuItemText}>Payment Methods</Text>
            <ChevronRight size={20} color={Colors.lightText} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Bell size={20} color={Colors.text} />
            </View>
            <Text style={styles.menuItemText}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.inactive, true: Colors.primary }}
              thumbColor={Colors.background}
            />
          </View>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/language")}>
            <View style={styles.menuIconContainer}>
              <Globe size={20} color={Colors.text} />
            </View>
            <Text style={styles.menuItemText}>Language</Text>
            <View style={styles.menuItemValue}>
              <Text style={styles.menuItemValueText}>English</Text>
              <ChevronRight size={20} color={Colors.lightText} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleHelp}>
            <View style={styles.menuIconContainer}>
              <HelpCircle size={20} color={Colors.text} />
            </View>
            <Text style={styles.menuItemText}>Help Center</Text>
            <ChevronRight size={20} color={Colors.lightText} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/privacy")}>
            <View style={styles.menuIconContainer}>
              <Shield size={20} color={Colors.text} />
            </View>
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <ChevronRight size={20} color={Colors.lightText} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
            <View style={styles.menuIconContainer}>
              <Settings size={20} color={Colors.text} />
            </View>
            <Text style={styles.menuItemText}>Settings</Text>
            <ChevronRight size={20} color={Colors.lightText} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Layout.spacing.l,
    paddingVertical: Layout.spacing.l,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: Layout.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: Layout.spacing.m,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.s,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.small,
  },
  editBadgeText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: "bold",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: Layout.spacing.m,
  },
  hostButton: {
    paddingHorizontal: Layout.spacing.l,
    paddingVertical: Layout.spacing.s,
    backgroundColor: Colors.background,
    borderRadius: Layout.borderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  hostButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: Layout.spacing.l,
    paddingVertical: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.m,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Layout.spacing.m,
  },
  menuIconContainer: {
    width: 40,
    alignItems: "center",
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: Layout.spacing.s,
  },
  menuItemValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemValueText: {
    fontSize: 14,
    color: Colors.lightText,
    marginRight: Layout.spacing.xs,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Layout.spacing.xl,
    paddingVertical: Layout.spacing.m,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.error,
    marginLeft: Layout.spacing.s,
  },
});