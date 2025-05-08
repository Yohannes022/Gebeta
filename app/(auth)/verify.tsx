import Button from "@/components/Button";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useAuthStore } from "@/store/authStore";

export default function VerifyScreen() {
  const router = useRouter();
  const { verifyOtp, isLoading, error, generateOtp, phoneNumber } = useAuthStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // Generate a random OTP when the screen loads
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    
    // In a real app, this would be sent to the user's phone
    // For demo purposes, we'll show it in an alert
    Alert.alert(
      "Demo OTP",
      `Your verification code is: ${newOtp}`,
      [{ text: "OK" }]
    );
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[0];
    }
    
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    // Generate a new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    
    // Reset timer
    setTimeLeft(60);
    
    // In a real app, this would be sent to the user's phone
    Alert.alert(
      "Demo OTP",
      `Your new verification code is: ${newOtp}`,
      [{ text: "OK" }]
    );
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) return;
    
    // For demo purposes, check if the entered OTP matches the generated one
    if (otpString === generatedOtp) {
      try {
        await verifyOtp(otpString);
        router.replace("/(tabs)");
      } catch (error) {
        console.error("Verification error:", error);
      }
    } else {
      Alert.alert(
        "Invalid OTP",
        "The verification code you entered is incorrect. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Verification Code</Text>
              <Text style={styles.subtitle}>
                We've sent a verification code to {phoneNumber || "your phone"}
              </Text>
            </View>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null
                  ]}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title="Verify"
              onPress={handleVerify}
              variant="primary"
              size="large"
              loading={isLoading}
              fullWidth
              style={styles.button}
            />

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              {timeLeft > 0 ? (
                <Text style={styles.timerText}>{`Resend in ${timeLeft}s`}</Text>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendButton}>Resend</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
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
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8A8A8A",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  otpInput: {
    width: 50,
    height: 56,
    borderWidth: 1,
    bordercolor: "#DBDBDB",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    backgroundColor: "#F9F5F0",
  },
  otpInputFilled: {
    borderColor: "#3E7EA6",
    backgroundColor: "#F9F5F0" + "10",
  },
  button: {
    marginBottom: 24,
  },
  errorText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#E53935",
    marginBottom: 16,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resendText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8A8A8A",
  },
  timerText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8A8A8A",
  },
  resendButton: {
    fontSize: 16,
    lineHeight: 24,
    color: "#3E7EA6",
    fontWeight: "600",
  },
});
