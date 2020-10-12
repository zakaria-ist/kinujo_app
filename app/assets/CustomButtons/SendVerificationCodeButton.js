import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Colors } from "../Colors";
export default function SendVerificationCodeButton({ text, onPress }) {
  return (
    <TouchableOpacity>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    paddingVertical: 8,
    marginHorizontal: "30%",
    marginTop: "10%",
    backgroundColor: Colors.D7CCA6,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});
