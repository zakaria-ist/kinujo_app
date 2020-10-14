import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { Colors } from "../Colors";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
export default function BankAccountRegisterButton({ text, onPress }) {
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
    marginTop: heightPercentageToDP("14%"),
    marginHorizontal: 80,
    backgroundColor: Colors.deepGrey,
  },
  buttonText: {
    color: "white",
    fontSize: RFValue(14),
    textAlign: "center",
  },
});
