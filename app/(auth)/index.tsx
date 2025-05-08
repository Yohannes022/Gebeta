import Button from "@/components/Button";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, View } from "react-native";


export default function WelcomeScreen() {
  const router = useRouter();
  const { width } = Dimensions.get("window");
  const isTablet = width > 768;

  const handleGetStarted = () => {
    router.push("/login");
  };

  const handleRestaurantOwner = () => {
    router.push(`/restaurant-owner-signup`);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?q=80&w=1000",
        }}
        style={styles.backgroundImage}
      />
      
      {/* <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
        style={styles.gradient}
      /> */}
      
      <LinearGradient
        colors={['#feda75', '#fa7e1e', '#d62976', '#962fbf', '#4f5bd5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />


      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Habesha Cuisine</Text>
          <Text style={styles.subtitle}>
            Discover authentic Ethiopian flavors
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Button
            title="Get Started as Customer"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            fullWidth
            textStyle={styles.primaryButtonText}
          />
          
          <Button
            title="Join as Restaurant Owner"
            onPress={handleRestaurantOwner}
            variant="outline"
            size="large"
            fullWidth
            style={styles.secondaryButton}
            textStyle={styles.secondaryButtonText}
          />
          
          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    
    // alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    // fontSize: 36,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 24,
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.9,
    // fontSize: 14,
  },
  footer: {
    marginBottom: 24,
  },
  primaryButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "500",
  },
  secondaryButton: {
    marginTop: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "#FFFFFF",
    borderWidth:StyleSheet.hairlineWidth,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
  },
  termsText: {
    fontSize: 11,
    lineHeight: 16,
    color: "#FFFFFF",
    opacity: 0.7,
    textAlign: "center",
    marginTop: 24,
  },
});
