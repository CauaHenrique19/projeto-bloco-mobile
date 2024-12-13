import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Toast from "react-native-toast-message";

import ContextProvider from "./src/context";

import Login from "./src/screens/login";
import Signup from "./src/screens/signup";
import Catalog from "./src/screens/catalog";
import DetailedMedia from "./src/screens/detailedMedia";
import CustomDrawerContent from "./src/components/drawerContent";
import Timeline from "./src/screens/timeline";
import DetailedAvaliation from "./src/screens/detailedAvaliation";
import Profile from "./src/screens/profile";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <>
      <ContextProvider>
        <NavigationContainer>
          <Drawer.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "#0f0f0f",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerTitle: () => {
                const navigation = useNavigation();

                const state = navigation.getState();
                const routeName = state.routeNames[state.index];

                const relationRouteName = {
                  Login: "Login",
                  Signup: "Cadastrar-se",
                  Catalog: "Catálogo",
                  DetailedMedia: "Mídia",
                  Timeline: "Timeline",
                  DetailedAvaliation: "Avaliação",
                  Profile: "Perfil",
                };

                return (
                  <Text style={{ color: "#fafafa", fontWeight: "bold" }}>
                    {relationRouteName[routeName]}
                  </Text>
                );
              },
              headerLeft: () => {
                const navigation = useNavigation();

                return (
                  <TouchableOpacity
                    onPress={() => navigation.toggleDrawer()}
                    style={{ marginLeft: 20 }}
                  >
                    <Ionicons name="menu" size={30} color="#fafafa" />
                  </TouchableOpacity>
                );
              },
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            <Drawer.Screen name="Login" component={Login} />
            <Drawer.Screen name="Signup" component={Signup} />
            <Drawer.Screen name="Catalog" component={Catalog} />
            <Drawer.Screen name="DetailedMedia" component={DetailedMedia} />
            <Drawer.Screen name="Timeline" component={Timeline} />
            <Drawer.Screen
              name="DetailedAvaliation"
              component={DetailedAvaliation}
            />
            <Drawer.Screen name="Profile" component={Profile} />
          </Drawer.Navigator>
        </NavigationContainer>
      </ContextProvider>
      <Toast />
    </>
  );
}
