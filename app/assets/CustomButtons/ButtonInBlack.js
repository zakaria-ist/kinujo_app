import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, ViewPagerAndroid } from "react-native";
import { Colors } from "../Colors";
export default function ButtonInBlack({ text, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
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
    marginTop: 40,
    marginHorizontal: 35,
    backgroundColor: Colors.deepGrey,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});
