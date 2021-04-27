import React from "react";
import { InteractionManager } from 'react-native';

import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
import auth from "@react-native-firebase/auth";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import i18n from "i18n-js";
import * as Localization from "expo-localization";
const request = new Request();
const alert = new CustomAlert();

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const currentUser = auth().currentUser;
import Translate from "../assets/Translates/Translate";
auth().setLanguageCode(Localization.locale);
// console.log(Localization.locale);
export default function SMSAuthentication(props) {
  const win = Dimensions.get("window");
  const ratioKinujo = win.width / 1.6 / 151;
  const [code, onCodeChanged] = useStateIfMounted("");
  const [confirm, setConfirm] = useStateIfMounted(null);
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);

  async function signInWithPhoneNumber(phoneNumber) {
    console.log(phoneNumber)
    // console.log(phoneNumber);
    const confirmation = await auth().verifyPhoneNumber(phoneNumber);

    console.log(confirmation);
    setConfirm(confirmation);
  }

  function signInWithPhoneNumber2(phoneNumber) {
    signInWithPhoneNumber(phoneNumber)
      .then(() => {})
      .catch((error) => {
        alert.warning(error.code);
      });
  }
  const phone = props.route.params.username;
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      signInWithPhoneNumber2("+" + props.route.params.username.replace("+", ""));
    });
  }, []);
  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <Spinner
        visible={spinner}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height+1000"}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }}>
          <Image
            style={{
              width: win.width / 1.6,
              height: 44 * ratioKinujo,
              alignSelf: "center",
              marginTop: heightPercentageToDP("6%"),
            }}
            source={require("../assets/Images/kinujo.png")}
          />
          <Text style={styles.SMS認証}>{Translate.t("smsVerification")}</Text>
          <Text
            style={{
              color: "white",
              fontSize: RFValue(12),
              alignSelf: "center",
              marginTop: heightPercentageToDP("3%"),
              textAlign: "center",
            }}
          >
            {i18n.locale.includes('ja') || i18n.locale.includes('JP')
              ? phone + Translate.t("sentVerificationCode")
              : Translate.t("sentVerificationCode") + phone}
          </Text>
          {/* function handleShippingPrice(value) {
    onShippingChanged(value.replace(/[^0-9]/g, "")); */}
          {/* } */}
          <TextInput
            style={styles.verificationCode}
            placeholder={Translate.t("enterVerificationCode")}
            placeholderTextColor="white"
            onChangeText={(text) => onCodeChanged(text.replace(/[^0-9]/g, ""))}
            value={code}
          ></TextInput>
          <TouchableOpacity
            onPress={() => {
              if (!code) return;
              if (!confirm) return;
              if (!props.route.params.type) {
                onSpinnerChanged(true);
                const credential = auth.PhoneAuthProvider.credential(
                  confirm.verificationId,
                  code
                );
                let userData = auth()
                  .signInWithCredential(credential)
                  .then(() => {
                    request
                      .post("user/register", props.route.params)
                      .then(function (response) {
                        console.log(response.data);
                        response = response.data;
                        if (response.success) {
                          onSpinnerChanged(false);
                          AsyncStorage.setItem(
                            "user",
                            response.data.user.url
                          ).then(function (response) {
                            if (props.route.params.authority == "general") {
                              props.navigation.navigate("RegisterCompletion", {
                                authority: props.route.params.authority,
                              });
                            } else if (
                              props.route.params.authority == "store"
                            ) {
                              props.navigation.navigate(
                                "StoreAccountSelection",
                                {
                                  authority: props.route.params.authority,
                                }
                              );
                            }
                          });
                        } else {
                          if (
                            response.errors &&
                            Object.keys(response.errors).length > 0
                          ) {
                            let tmpErrorMessage =
                              response.errors[
                                Object.keys(response.errors)[0]
                              ][0] +
                              "(" +
                              Object.keys(response.errors)[0] +
                              ")";
                            // alert.warning(tmpErrorMessage);
                            let errorMessage = String(
                              tmpErrorMessage.split("(").pop()
                            );
                            alert.warning(
                              Translate.t("register-(" + errorMessage),
                              () => {
                                onSpinnerChanged(false);
                                props.navigation.goBack();
                              }
                            );
                          }
                        }
                      })
                      .catch((error) => {
                        onSpinnerChanged(false);
                        request.displayError(error);
                      });
                  })
                  .catch((error) => {
                    alert.warning(Translate.t(error.code), () => {
                      onSpinnerChanged(false);
                      props.navigation.goBack();
                    });
                  });
              } else {
                const credential = auth.PhoneAuthProvider.credential(
                  confirm.verificationId,
                  code
                );
                let userData = auth()
                  .signInWithCredential(credential)
                  .then(() => {
                    AsyncStorage.setItem("verified", "1").then(() => {
                      onSpinnerChanged(false);
                      props.navigation.goBack();
                    });
                  })
                  .catch((error) => {
                    alert.warning(error.code, function () {
                      AsyncStorage.setItem("verified", "0").then(() => {
                        onSpinnerChanged(false);
                        props.navigation.goBack();
                      });
                    });
                  });
              }
            }}
          >
            <View
              style={
                code && confirm
                  ? styles.smsAuthenticateButton
                  : styles.smsDisabledAuthenticateButton
              }
            >
              <Text style={styles.smsAuthenticateButtonText}>
                {Translate.t("authenticate")}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              AsyncStorage.setItem("verified", "0").then(() => {
                props.navigation.pop();
              });
            }}
          >
            <View style={styles.smsCancelButton}>
              <Text style={styles.smsAuthenticateButtonText}>
                {Translate.t("cancel")}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  SMS認証: {
    color: "white",
    fontSize: RFValue(14),
    alignSelf: "center",
    marginTop: heightPercentageToDP("16%"),
  },
  verificationCode: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    padding: 10,
    fontSize: RFValue(12),
    marginTop: heightPercentageToDP("8%"),
    marginHorizontal: widthPercentageToDP("10%"),
  },
  smsAuthenticateButton: {
    borderRadius: 5,
    backgroundColor: "#f01d71",
    paddingVertical: 8,
    marginHorizontal: heightPercentageToDP("12%"),
    marginTop: widthPercentageToDP("23%"),
    backgroundColor: Colors.deepGrey,
  },
  smsDisabledAuthenticateButton: {
    borderRadius: 5,
    backgroundColor: "#f01d71",
    paddingVertical: 8,
    marginHorizontal: heightPercentageToDP("12%"),
    marginTop: widthPercentageToDP("23%"),
    backgroundColor: Colors.deepGrey,
    opacity: 0.7,
  },
  smsCancelButton: {
    borderRadius: 5,
    backgroundColor: "#f01d71",
    paddingVertical: 8,
    marginHorizontal: heightPercentageToDP("12%"),
    marginTop: widthPercentageToDP("2%"),
    backgroundColor: Colors.deepGrey,
  },
  smsAuthenticateButtonText: {
    color: "white",
    fontSize: RFValue(12),
    textAlign: "center",
  },
});
