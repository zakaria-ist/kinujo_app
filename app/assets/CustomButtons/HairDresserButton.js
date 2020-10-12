import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Colors } from "../Colors";
export default function HairDresserButton({ text, onPress }) {
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
    backgroundColor: "#f01d71",
    paddingVertical: 8,
    marginTop: 50,
    marginHorizontal: 50,
    backgroundColor: Colors.deepGrey,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});
