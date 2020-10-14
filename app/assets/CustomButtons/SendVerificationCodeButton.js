import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Colors } from "../Colors";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
export default function SendVerificationCodeButton({ text, onPress }) {
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
    paddingVertical: 8,
    marginHorizontal: widthPercentageToDP("30%"),
    marginTop: heightPercentageToDP("3%"),
    backgroundColor: Colors.D7CCA6,
  },
  buttonText: {
    color: "white",
    fontSize: RFValue(14),
    textAlign: "center",
  },
});
