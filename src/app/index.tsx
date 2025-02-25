import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Button } from "@/src/components/button";
import { IconUser, IconEye, IconEyeOff } from "@tabler/icons-react-native";
import { styles } from "./styles";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function handleLogin() {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    Alert.alert("Sucesso", `Login efetuado para: ${email}`);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Estiticista Viviane Souza</Text>
          <Text style={styles.subtitle}>Faça login ou crie sua conta aqui</Text>

          <View style={styles.loginContainer}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Login</Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <IconUser />
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  {isPasswordVisible ? (
                    <IconEyeOff />
                  ) : (
                    <IconEye />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Button>
              <Button.Title>Esqueceu sua senha? </Button.Title>
            </Button>
            <Button>
              <Button.Title>Já possui sua conta? Entre já!</Button.Title>
            </Button>
          </View>

          <Button onPress={handleLogin}>
            <Button.Title>Entrar</Button.Title>
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
