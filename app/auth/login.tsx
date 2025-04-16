import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Phone, ChevronRight } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { useAuthStore } from "@/store/auth-store";

export default function LoginScreen() {
  const router = useRouter();
  const { setPhone, login } = useAuthStore();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Invalid Phone Number", "Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setPhone(phoneNumber);

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, we'll just log the user in directly
      login({
        id: "u1",
        name: "John Doe",
        phone: phoneNumber,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        isHost: false,
        savedExperiences: ["1", "3"],
        bookings: [],
      });
      
      setIsLoading(false);
      router.replace("/");
    }, 1500);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Log in or sign up",
          headerTitleStyle: styles.headerTitle,
        }}
      />

      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1566740933430-b5e70b06d2d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }}
                style={styles.logo}
              />
            </View>

            <Text style={styles.welcomeText}>
              Welcome to Ethiopian Food Experiences
            </Text>

            <View style={styles.inputContainer}>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+1</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  maxLength={10}
                />
              </View>
              <Text style={styles.disclaimer}>
                We'll call or text you to confirm your number. Standard message and data rates apply.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                (!phoneNumber || isLoading) && styles.disabledButton,
              ]}
              onPress={handleContinue}
              disabled={!phoneNumber || isLoading}
            >
              <Text style={styles.continueButtonText}>
                {isLoading ? "Processing..." : "Continue"}
              </Text>
              <ChevronRight size={20} color={Colors.background} />
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Continue with Email</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.spacing.l,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: Layout.spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
    marginBottom: Layout.spacing.xl,
  },
  inputContainer: {
    marginBottom: Layout.spacing.xl,
  },
  phoneInputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.medium,
    overflow: "hidden",
  },
  countryCode: {
    paddingHorizontal: Layout.spacing.m,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  countryCodeText: {
    fontSize: 16,
    color: Colors.text,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.m,
    fontSize: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.lightText,
    marginTop: Layout.spacing.s,
  },
  continueButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.m,
    borderRadius: Layout.borderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: Colors.inactive,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.background,
    marginRight: Layout.spacing.s,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Layout.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    paddingHorizontal: Layout.spacing.m,
    color: Colors.lightText,
  },
  socialButtons: {
    gap: Layout.spacing.m,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: Layout.spacing.m,
    alignItems: "center",
  },
  socialButtonText: {
    fontSize: 16,
    color: Colors.text,
  },
});