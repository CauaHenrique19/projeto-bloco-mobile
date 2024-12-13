import React, { useState, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { toBase64 } from "../../utils";
import { Context } from "../../context";

const Signup = () => {
  const { setUser } = useContext(Context);
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [user, setUserSignup] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [imageSelected, setImageSelected] = useState(null);

  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

  const fileInput = useRef(null);

  const handleSignup = async () => {
    if (!name) return Toast.show({ type: "error", text1: "Informe o nome" });
    if (!user) return Toast.show({ type: "error", text1: "Informe o user" });
    if (!email) return Toast.show({ type: "error", text1: "Informe o email" });
    if (!password)
      return Toast.show({ type: "error", text1: "Informe a senha" });
    if (!confirmPassword)
      return Toast.show({ type: "error", text1: "Confirme a senha" });
    if (!gender) return Toast.show({ type: "error", text1: "Informe o sexo" });
    /*
    if (!imageSelected)
      return Toast.show({ type: "error", text1: "Selecione uma imagem" });
    */

    if (password !== confirmPassword)
      return Toast.show({ type: "error", text1: "As senhas não coincidem" });

    const users = JSON.parse(await AsyncStorage.getItem("users")) || [];

    if (users.length) {
      const userExistsWithUser = users.find((u) => u.user === user);
      if (userExistsWithUser)
        return Toast.show({
          type: "error",
          text1: "Já existe um usuário com esse user",
        });

      const userExistsWithEmail = users.find((u) => u.email === email);
      if (userExistsWithEmail)
        return Toast.show({
          type: "error",
          text1: "Já existe um usuário com esse email",
        });
    }

    // let imageString = await toBase64(imageSelected);

    const userToCreate = {
      id: uuid(),
      name,
      user,
      email,
      password,
      gender,
      biography: null,
      evaluations: [],
      comments: [],
      following_count: 0,
      followers_count: 0,
      // image: imageString,
    };

    const existentUsers = JSON.parse(await AsyncStorage.getItem("users")) || [];
    await AsyncStorage.setItem(
      "users",
      JSON.stringify([...existentUsers, userToCreate])
    );
    await AsyncStorage.setItem("user", JSON.stringify(userToCreate));

    setUser(userToCreate);
    navigation.navigate("Timeline");
  };

  return (
    <ScrollView contentContainerStyle={styles.containerSignup}>
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Mosegook</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.formTitle}>
            Você está muito perto de começar!
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={24} color="#fff" />
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
              placeholderTextColor="#fafafa"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="at-outline" size={24} color="#fff" />
            <TextInput
              style={styles.textInput}
              value={user}
              onChangeText={setUserSignup}
              placeholder="Seu user"
              placeholderTextColor="#fafafa"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={24} color="#fff" />
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="email@email.com"
              placeholderTextColor="#fafafa"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#fff" />
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Sua senha"
              placeholderTextColor="#fafafa"
              secureTextEntry={!viewPassword}
            />
            <Ionicons
              name={viewPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#fff"
              onPress={() => setViewPassword(!viewPassword)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#fff" />
            <TextInput
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirme sua senha"
              placeholderTextColor="#fafafa"
              secureTextEntry={!viewConfirmPassword}
            />
            <Ionicons
              name={viewConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#fff"
              onPress={() => setViewConfirmPassword(!viewConfirmPassword)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="transgender-outline" size={24} color="#fff" />
            <Picker
              style={styles.picker}
              selectedValue={gender}
              onValueChange={setGender}
              placeholder="Escolha seu sexo"
            >
              <Picker.Item label="Escolha seu sexo" value="" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Feminino" value="Feminino" />
              <Picker.Item label="Outros" value="Outros" />
            </Picker>
          </View>
          <View style={styles.formButtonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => handleSignup()}
            >
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Já tem uma conta? Entre aqui</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerSignup: {
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
    alignItems: "center",
  },
  headerText: {
    fontSize: 30,
    color: "#fafafa",
  },
  form: {
    marginTop: 20,
  },
  formTitle: {
    fontSize: 24,
    color: "#fafafa",
    marginBottom: 20,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#333",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textInput: {
    flex: 1,
    color: "#fff",
    paddingLeft: 10,
  },
  picker: {
    flex: 1,
    color: "#fff",
    paddingLeft: 10,
  },
  formButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "blueviolet",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  linkText: {
    color: "#fff",
  },
});

export default Signup;
