import React from "react";
import { StyleSheet, Text, View, ImagePropTypes } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import OKButton from "../assets/CustomButtons/OKButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
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
            marginTop: 10,
          }}
        >
          {Translate.t("accountReviewingText")}
        </Text>
        <OKButton onPress={() => {
            AsyncStorage.setItem(
              'user',
              ""
            );
            props.navigation.navigate('LoginScreen')
        }} text="OK"></OKButton>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  thanksForRegistration: {
    color: "white",
    fontSize: RFValue(16),
    alignSelf: "center",
    marginTop: hp("14%"),
  },
});
