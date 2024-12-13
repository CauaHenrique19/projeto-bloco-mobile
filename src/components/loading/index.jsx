import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";

const Loading = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.containerLoading}>
      <Animated.View
        style={[styles.loading, { transform: [{ rotate: rotation }] }]}
      />
      <Text style={styles.text}>Carregando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerLoading: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    position: "absolute",
    zIndex: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  loading: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 15,
    borderColor: "#383838",
    borderTopColor: "blueviolet",
    marginBottom: 50,
  },
  text: {
    fontWeight: "300",
    color: "#fff",
    fontSize: 18,
  },
});

export default Loading;
