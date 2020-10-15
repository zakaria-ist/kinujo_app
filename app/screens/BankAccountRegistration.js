import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import BankAccountRegisterButton from "../assets/CustomButtons/BankAccountRegisterButton";
import { RFValue } from "react-native-responsive-fontsize";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWordWithArrow";
import Translate from "../assets/Translates/Translate";

const request = new Request();
const alert = new CustomAlert();

export default function BankAccountRegistration(props) {
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
        <View>
          <TouchableWithoutFeedback onPress={() => props.navigation.pop()}>
            <Image
              style={{
                marginLeft: "5%",
                marginTop: "10%",
                width: 20,
                height: 20,
              }}
              source={require("../assets/Images/whiteBackArrow.png")}
            />
          </TouchableWithoutFeedback>
          <CustomKinujoWord />

          <Text style={styles.bankAccountRegistrationText}>
            {Translate.t("bankAccountRegistration")}
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: RFValue(14),
              alignSelf: "center",
              marginTop: hp("5%"),
              textAlign: "center",
            }}
          >
            {Translate.t("bankAccountRegistrationIsRequiredText")}
          </Text>
        </View>
        <BankAccountRegisterButton
          text={Translate.t("registerBankAccountNow")}
        ></BankAccountRegisterButton>
        <View
          onPress={() => props.navigation.navigate("AccountExamination")}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: heightPercentageToDP("3%"),
          }}
        >
          <Text
            onPress={() => updateProfile("AccountExamination")}
            style={{
              alignSelf: "center",
              color: Colors.white,
              textAlign: "center",
              fontSize: RFValue(14),
            }}
          >
            {Translate.t("registerLater")}
          </Text>
          <Image
            onPress={() => updateProfile("AccountExamination")}
            style={{
              marginLeft: 5,
              width: 15,
              height: 15,
              alignSelf: "center",
            }}
            source={require("../assets/Images/whiteNextArrow.png")}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  bankAccountRegistrationText: {
    color: "white",
    textAlign: "center",
    fontSize: RFValue(18),
    alignSelf: "center",
    marginTop: hp("10%"),
  },
});
