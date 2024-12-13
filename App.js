import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import ContextProvider from "./src/context";

import Login from "./src/screens/login";
import Signup from "./src/screens/signup";
import Toast from "react-native-toast-message";
import Catalog from "./src/screens/catalog";
import DetailedMedia from "./src/screens/detailedMedia";
import CustomDrawerContent from "./src/components/drawerContent";
import Timeline from "./src/screens/timeline";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <>
      <ContextProvider>
        <NavigationContainer>
          <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Drawer.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
            <Drawer.Screen name="Catalog" component={Catalog} options={{ headerShown: false }} />
            <Drawer.Screen name="DetailedMedia" component={DetailedMedia} options={{ headerShown: false }} />
            <Drawer.Screen name="Timeline" component={Timeline} options={{ headerShown: false }} />
          </Drawer.Navigator>
        </NavigationContainer>
      </ContextProvider>
      <Toast />
    </>
  );
}
