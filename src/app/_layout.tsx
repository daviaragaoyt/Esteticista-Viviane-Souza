import { Stack } from "expo-router";
import { colors } from "@/src/styles/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  useFonts,
  Rubik_600SemiBold,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_700Bold,
} from "@expo-google-fonts/rubik";
import { StatusBar } from "react-native";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Rubik_600SemiBold,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
  });


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle={"light-content"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.gray[100] },
        }}
      />
    </GestureHandlerRootView>
  );
}