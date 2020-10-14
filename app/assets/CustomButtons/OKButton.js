import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Colors } from "../Colors";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP } from "react-native-responsive-screen";
export default function OKButton({ text, onPress }) {
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
    marginHorizontal: "30%",
    marginVertical: heightPercentageToDP("19%"),
    backgroundColor: Colors.deepGrey,
  },
  buttonText: {
    color: "white",
    fontSize: RFValue(15),
    textAlign: "center",
  },
});
