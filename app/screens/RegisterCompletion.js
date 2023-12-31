import React from "react";
import { InteractionManager } from 'react-native';

import {
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import SplashScreen from 'react-native-splash-screen'
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";

const request = new Request();
const alert = new CustomAlert();

import Translate from "../assets/Translates/Translate";
export default function RegisterCompletion(props) {
  setTimeout(function(){
    SplashScreen.hide();
  }, 1000)
  async function updateProfile(nextPage) {
    AsyncStorage.getItem("user").then(function (url) {
      request
        .get(url)
        .then(function (response) {
          response = response.data;
          let user = response;
          let payload = response.payload;
          if (payload) {
            payload = JSON.parse(payload);
            payload["register_completed"] = true;
            payload = JSON.stringify(payload);
          } else {
            payload = JSON.stringify({
              register_completed: true,
            });
          }
          response.payload = payload;

          request
            .patch(url, {
              payload: payload,
            })
            .then(function (response) {
              if (user.is_store && !user.is_master && user.is_approved) {
                props.navigation.reset({
                  index: 0,
                  routes: [{name: "HomeStore"}],
                });
              } else {
                props.navigation.reset({
                  index: 0,
                  routes: [{name: "HomeGeneral"}],
                });
              }
            })
            .catch(function (error) {
              if (
                error &&
                error.response &&
                error.response.data &&
                Object.keys(error.response.data).length > 0
              ) {
                alert.warning(
                  error.response.data[Object.keys(error.response.data)[0]][0] +
                    "(" +
                    Object.keys(error.response.data)[0] +
                    ")"
                );
              }
            });
        })
        .catch(function (error) {
          if (
            error &&
            error.response &&
            error.response.data &&
            Object.keys(error.response.data).length > 0
          ) {
            alert.warning(
              error.response.data[Object.keys(error.response.data)[0]][0] +
                "(" +
                Object.keys(error.response.data)[0] +
                ")"
            );
          }
        });
    });
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
            marginTop: heightPercentageToDP("1%"),
            textAlign: "center",
            paddingHorizontal: widthPercentageToDP("3%"),
          }}
        >
          {Translate.t("enjoyText")}
        </Text>
        <TouchableOpacity
          onPress={() => {
            updateProfile();
          }}
        >
          <View style={styles.okButton}>
            <Text style={styles.okButtonText}>OK</Text>
          </View>
        </TouchableOpacity>
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
