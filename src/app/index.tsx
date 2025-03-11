// index.tsx
import { Stack } from "expo-router";
import Login from "@/src/app/components/login";
import Register from "@/src/app/components/cadastro";
import { useLocalSearchParams } from "expo-router";

export default function Index() {
  const { screen } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {screen === "login" ? <Login /> : <Register />}
    </>
  );
}