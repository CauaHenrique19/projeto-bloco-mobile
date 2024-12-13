import { useState, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState();

  const getUser = async () => {
    setUser(await AsyncStorage.getItem("user"));
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
