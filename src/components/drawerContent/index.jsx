import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigationState } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";

import { Context } from "../../context";

function CustomDrawerContent(props) {
  const { user, setUser } = useContext(Context);

  const state = useNavigationState((state) => state);
  const routeName = state?.routeNames[state.index];

  async function handleLogout() {
    await AsyncStorage.removeItem("user");
    setUser(null);
    props.navigation.navigate("Login");
  }

  return (
    <View style={styles.drawerContainer}>
      {!user && (
        <TouchableOpacity
          style={
            routeName === "Login"
              ? [styles.item, styles.itemSelected]
              : styles.item
          }
          onPress={() => props.navigation.navigate("Login")}
        >
          <View style={styles.itemContainer}>
            <Ionicons name="log-in-outline" size={20} color="#fafafa" />
            <Text style={styles.text}>Login</Text>
          </View>
        </TouchableOpacity>
      )}
      {!user && (
        <TouchableOpacity
          style={
            routeName === "Signup"
              ? [styles.item, styles.itemSelected]
              : styles.item
          }
          onPress={() => props.navigation.navigate("Signup")}
        >
          <View style={styles.itemContainer}>
            <Ionicons name="person-add-outline" size={20} color="#fafafa" />
            <Text style={styles.text}>Cadastrar-se</Text>
          </View>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={
          routeName === "Catalog"
            ? [styles.item, styles.itemSelected]
            : styles.item
        }
        onPress={() => props.navigation.navigate("Catalog")}
      >
        <View style={styles.itemContainer}>
          <Ionicons name="apps-outline" size={20} color="#fafafa" />
          <Text style={styles.text}>Catálogo</Text>
        </View>
      </TouchableOpacity>
      {user && (
        <TouchableOpacity
          style={
            routeName === "Timeline"
              ? [styles.item, styles.itemSelected]
              : styles.item
          }
          onPress={() => props.navigation.navigate("Timeline")}
        >
          <View style={styles.itemContainer}>
            <Ionicons name="albums-outline" size={20} color="#fafafa" />
            <Text style={styles.text}>Timeline</Text>
          </View>
        </TouchableOpacity>
      )}
      {user && (
        <TouchableOpacity
          style={
            routeName === "Profile"
              ? [styles.item, styles.itemSelected]
              : styles.item
          }
          onPress={() =>
            props.navigation.navigate("Profile", { user: user.user })
          }
        >
          <View style={styles.itemContainer}>
            <Ionicons name="person-outline" size={20} color="#fafafa" />
            <Text style={styles.text}>Perfil</Text>
          </View>
        </TouchableOpacity>
      )}
      {user && (
        <TouchableOpacity
          style={styles.item}
          onPress={async () => await handleLogout()}
        >
          <View style={styles.itemContainer}>
            <Ionicons name="log-out-outline" size={20} color="#fafafa" />
            <Text style={styles.text}>Sair</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  item: {
    width: "90%",
    height: 50,
    backgroundColor: "#1f1f1f",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  itemSelected: {
    backgroundColor: "blueviolet",
  },
  itemContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  text: {
    color: "#fafafa",
    fontWeight: "bold",
  },
});

export default CustomDrawerContent;
