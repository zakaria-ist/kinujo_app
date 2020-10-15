import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  Image,
  View,
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import SalonShopButton from "../assets/CustomButtons/SalonShopButton";
import HairDresserButton from "../assets/CustomButtons/HairDresserButton";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const request = new Request();
const alert = new CustomAlert();

import Translate from "../assets/Translates/Translate";
export default function StoreAccountSelection(props) {
  async function updateProfile(){
    AsyncStorage.getItem('user').then(function(url){
      request.get(url).then(function(response){
        response = response.data;
        let payload = response.payload;
        if(payload){
          payload = JSON.parse(payload);
          payload['account_selected'] = true;
          payload = JSON.stringify(payload)
        } else {
          payload = JSON.stringify({
            "account_selected" : true
          })
        }
        response.payload = payload;
        request
        .patch(url, {
          payload: payload
        })
        .then(function (response) {
            props.navigation.navigate("BankAccountRegistration")
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
          <CustomKinujoWord />
          <Text style={styles.storeAccountSelectionText}>
            {Translate.t("storeAccountSelection")}
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: RFValue(11),
              marginHorizontal: widthPercentageToDP("3%"),
              alignSelf: "center",
              marginTop: heightPercentageToDP("5%"),
              textAlign: "center",
            }}
          >
            {Translate.t("selectYourDesiredStoreAccount")}
          </Text>
          <SalonShopButton
            text={Translate.t("registerAsSalonShop")}
            onPress={() => {
              updateProfile();
            }}
          ></SalonShopButton>
          <HairDresserButton
            text={Translate.t("registerAsHairDresser")}
            onPress={() => updateProfile()}
          ></HairDresserButton>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  storeAccountSelectionText: {
    color: "white",
    fontSize: RFValue(16),
    alignSelf: "center",
    textAlign: "center",
    marginTop: heightPercentageToDP("15%"),
  },
});
