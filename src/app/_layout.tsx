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
      <StatusBar barStyle={"light-content"} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro" options={{ headerShown: false }} />
    </Stack>

  );
}