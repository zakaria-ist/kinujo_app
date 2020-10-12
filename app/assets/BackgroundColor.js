import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function BackgroundColor() {
  return (
    <LinearGradient
      colors={["#2974FA", "#38ABFD", "#43D4FF"]}
      style={styles.linearGradient}
    ></LinearGradient>
  );
}

const styles = StyleSheet.create({
    linearGradient: {
    width:"100%",
  height:"100%",
  },
});
