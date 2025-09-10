import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="featureScreens/hospitalsNearby" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="screens/LoginScreen" />
      <Stack.Screen name="screens/SignupScreen" />
    </Stack>
  );
}
