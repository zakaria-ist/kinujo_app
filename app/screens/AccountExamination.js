import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import Translate from "../assets/Translates/Translate";
export default function AccountExamination(props) {
  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <CustomKinujoWord />
      <View>
        <Text style={styles.thanksForRegistration}>
          {Translate.t("thankYouForRegistration")}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: RFValue(12),
            alignSelf: "center",
            textAlign: "center",
            paddingHorizontal: "10%",
            marginTop: heightPercentageToDP("5%"),
          }}
        >
          {Translate.t("accountReviewingText")}
        </Text>
        <TouchableOpacity
          onPress={() => {
            AsyncStorage.setItem("user", "");
            props.navigation.navigate("LoginScreen");
          }}
        >
          <View style={styles.okButton}>
            <Text style={styles.okButtonText}>OK</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  thanksForRegistration: {
    color: "white",
    fontSize: RFValue(16),
    alignSelf: "center",
    marginTop: heightPercentageToDP("14%"),
  },
  okButton: {
    marginTop: heightPercentageToDP("10"),
    borderRadius: 5,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("25%"),
    backgroundColor: Colors.deepGrey,
  },
  okButtonText: {
    color: "white",
    fontSize: RFValue(16),
    textAlign: "center",
  },
});
