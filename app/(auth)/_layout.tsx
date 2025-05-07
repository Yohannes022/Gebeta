import { Stack } from "expo-router";
 

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#F9F5F0",
        },
        headerTintColor: "#2D2D2D",
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: "#F9F5F0",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen
        name="verify"
        options={{
          title: "Verify Phone",
        }}
      />
    </Stack>
  );
}