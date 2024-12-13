import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Context } from "../../context";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const navigation = useNavigation();
  const { setUser } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewPassword, setViewPassword] = useState(false);

  const handleLogin = async () => {
    if (!email) return Toast.show({ type: "error", text1: "Informe o email" });
    if (!password)
      return Toast.show({ type: "error", text1: "Informe a senha" });

    const users = JSON.parse(await AsyncStorage.getItem("users")) || [];
    const findedUser = users.find((user) => user.email === email);

    if (!findedUser) {
      return Toast.show({ type: "error", text1: "Usuário não encontrado!" });
    }

    if (findedUser.password !== password) {
      return Toast.show({ type: "error", text1: "Senha incorreta!" });
    }

    await AsyncStorage.setItem("user", JSON.stringify(findedUser));
    setUser(findedUser);
    navigation.navigate("Timeline");
  };

  useEffect(() => {
    navigation.addListener("blur", () => {
      setEmail("");
      setPassword("");
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Mosegook</Text>
        <View style={styles.form}>
          <Text style={styles.welcomeText}>Bem Vindo!</Text>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={24} color="#fafafa" />
            <TextInput
              style={styles.input}
              placeholder="email@email.com"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              placeholderTextColor={"#fafafa"}
            />
          </View>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#fafafa" />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={!viewPassword}
              placeholderTextColor={"#fafafa"}
            />
            <Ionicons
              name={viewPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#fafafa"
              onPress={() => setViewPassword(!viewPassword)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.linkText}>
                Não tem uma conta? Cadastre-se
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.socialContainer}>
        <Text style={styles.socialText}>Visite Nossas Redes Sociais</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.facebook.com/profile.php?id=100066384981305"
              )
            }
          >
            <Ionicons name="logo-facebook" size={40} color="#fafafa" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://twitter.com/mosegook")}
          >
            <Ionicons name="logo-twitter" size={40} color="#fafafa" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.instagram.com/mosegook/")
            }
          >
            <Ionicons name="logo-instagram" size={40} color="#fafafa" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    width: "100%",
  },
  header: {
    fontSize: 32,
    color: "#fafafa",
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    marginTop: 30,
  },
  welcomeText: {
    fontSize: 24,
    color: "#fafafa",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: "#fafafa",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    backgroundColor: "#1f1f1f",
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#fafafa",
    fontSize: 18,
    marginLeft: 10,
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 60,
    backgroundColor: "blueviolet",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    color: "#fafafa",
  },
  linkText: {
    fontSize: 14,
    color: "#fafafa",
  },
  socialContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  socialText: {
    fontSize: 16,
    color: "#fafafa",
    marginBottom: 30,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
  },
});

export default Login;
