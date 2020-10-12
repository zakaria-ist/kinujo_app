import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Colors } from "../Colors";
export default function ButtonInBrown({ text, onPress }) {
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
    marginTop: 50,
    borderRadius: 5,
    backgroundColor: "#f01d71",
    paddingVertical: 8,
    marginHorizontal: 35,
    backgroundColor: Colors.D7CCA6,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});
