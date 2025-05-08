import Button from "@/components/Button";
import Input from "@/components/Input";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
 

import { useAuthStore } from "@/store/authStore";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validatePhone = () => {
    if (!phone) {
      setPhoneError("Phone number is required");
      return false;
    }
    
    if (phone.length < 10) {
      setPhoneError("Please enter a valid phone number");
      return false;
    }
    
    setPhoneError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validatePhone()) return;
    
    try {
      await login(phone);
      router.push("/verify");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?q=80&w=500",
                }}
                style={styles.logo}
                contentFit="cover"
              />
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Enter your phone number to continue
              </Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Phone Number"
                placeholder="+251 91 234 5678"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                error={phoneError}
              />

              {error && <Text style={styles.errorText}>{error}</Text>}

              <Button
                title="Continue"
                onPress={handleLogin}
                variant="primary"
                size="large"
                loading={isLoading}
                fullWidth
                style={styles.button}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5F0",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    textAlign: "center",
    // color: "#8E8E8E",
  },
  form: {
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 8,
    // color: "#ED4956",
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#8E8E8E",
    lineHeight: 16,
    textAlign: "center",
    // color: "#8E8E8E",
  },
});
