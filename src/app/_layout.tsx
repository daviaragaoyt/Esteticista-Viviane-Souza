import { Stack } from "expo-router";
import { StatusBar } from "react-native";

import {
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
  useFonts,
} from "@expo-google-fonts/rubik";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Rubik_600SemiBold,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
  });


  return (

    <Stack >
      <StatusBar barStyle={"dark-content"} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro/index" options={{ headerShown: false }} />
      <Stack.Screen name="provider/index" options={{ headerShown: false }} />
      <Stack.Screen name="provider/appointments" options={{ headerShown: false }} />
      <Stack.Screen name="provider/dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="provider/new-service" options={{ headerShown: false }} />
    </Stack>

  );
}