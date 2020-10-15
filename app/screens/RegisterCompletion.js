import React from "react";
import { StyleSheet, SafeAreaView, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import OKButton from "../assets/CustomButtons/OKButton";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import AsyncStorage from '@react-native-community/async-storage';
import Request from "../lib/request";
import CustomAlert from "../lib/alert";

const request = new Request();
const alert = new CustomAlert();

import Translate from "../assets/Translates/Translate";
export default function RegisterCompletion(props) {
  async function updateProfile(nextPage){
    AsyncStorage.getItem('user').then(function(url){
      request.get(url).then(function(response){
        response = response.data;
        let payload = response.payload;
        if(payload){
          payload = JSON.parse(payload);
          payload['bank_skipped'] = true;
          payload = JSON.stringify(payload)
        } else {
          payload = JSON.stringify({
            "bank_skipped" : true
          })
        }
        response.payload = payload;
        request
        .patch(url, {
          payload: payload
        })
        .then(function (response) {
            props.navigation.navigate(nextPage)
        })
        .catch(function (error) {
          console.log(error);
          alert.warning("unknown_error");
        });
      }).catch(function(error){
        console.log(error);
        alert.warning("unknown_error");
      })
    })
  }

  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <CustomKinujoWord />
        <Text style={styles.bankAccountRegistrationText}>
          {Translate.t("thankYouForRegistration")}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: RFValue(14),
            alignSelf: "center",
            marginTop: heightPercentageToDP("5%"),
            textAlign: "center",
            paddingHorizontal: widthPercentageToDP("3%"),
          }}
        >
          {Translate.t("registrationComplete")}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: RFValue(14),
            alignSelf: "center",
            marginTop: 8,
            textAlign: "center",
            paddingHorizontal: widthPercentageToDP("3%"),
          }}
        >
          {Translate.t("enjoyText")}
        </Text>
        <OKButton onPress={() => {
          props.navigation.navigate("Home");
        }}text="OK"></OKButton>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  bankAccountRegistrationText: {
    color: "white",
    fontSize: RFValue(18),
    alignSelf: "center",
    textAlign: "center",
    marginTop: heightPercentageToDP("16%"),
  },
});
