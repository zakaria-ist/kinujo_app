import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from "react-native";
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

const request = new Request();
const alert = new CustomAlert();

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const currentUser = auth().currentUser;
import Translate from "../assets/Translates/Translate";
export default function SMSAuthentication(props) {
  const win = Dimensions.get("window");
  const ratioKinujo = win.width / 1.6 / 151;
  const [code, onCodeChanged] = React.useState("");
  const [confirm, setConfirm] = React.useState(null);

  async function signInWithPhoneNumber(phoneNumber) {
    // console.log(phoneNumber);
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    console.log(confirmation);
    setConfirm(confirmation);
  }

  function signInWithPhoneNumber2(phoneNumber){
    console.log(phoneNumber)
    signInWithPhoneNumber(phoneNumber).then(()=>{

    }).catch((error)=>{
      console.log(error)
      signInWithPhoneNumber2(phoneNumber)
    })
  }
  const phone = props.route.params.username;
  React.useEffect(() => {
    signInWithPhoneNumber2("+" + props.route.params.username)
  }, []);
  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
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
          {Translate.t("sentVerificationCode")} +{phone}
        </Text>
        <TextInput
          style={styles.verificationCode}
          placeholder={Translate.t("enterVerificationCode")}
          placeholderTextColor="white"
          onChangeText={(text) => onCodeChanged(text)}
          value={code}
        ></TextInput>
        <TouchableOpacity
          onPress={() => {
            if (!props.route.params.type) {
              confirm.confirm(code).then(() => {
                auth()
                  .signOut()
                  .then(() => {
                    request
                    .post("user/register", props.route.params)
                    .then(function (response) {
                      console.log(response)
                      response = response.data;
                      if (response.success) {
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
                          alert.warning(
                            response.errors[
                              Object.keys(response.errors)[0]
                            ][0] +
                              "(" +
                              Object.keys(response.errors)[0] +
                              ")"
                          );
                        }
                      }
                    })
                    .catch((error) => {
                      console.log(error)
                      if (
                        error &&
                        error.response &&
                        error.response.data &&
                        Object.keys(error.response.data).length > 0
                      ) {
                        alert.warning(
                          error.response.data[
                            Object.keys(error.response.data)[0]
                          ][0] +
                            "(" +
                            Object.keys(error.response.data)[0] +
                            ")"
                        );
                      }
                    });
                  })
                  .catch(function (error) {
                    // An error happened.
                    console.log(error)
                  });
              }).catch((error)=>{
                console.log(error)
              })
            } else {
              confirm.confirm(code).then(() => {
                AsyncStorage.setItem('verified', "1").then(()=>{
                  props.navigation.pop();
                })
              }).catch((error)=>{
                AsyncStorage.setItem('verified', "0").then(()=>{
                  props.navigation.pop();
                })
              })
            }
          }}
        >
          <View style={styles.smsAuthenticateButton}>
            <Text style={styles.smsAuthenticateButtonText}>
              {Translate.t("authenticate")}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            AsyncStorage.setItem('verified', "1").then(()=>{
              props.navigation.pop();
            })
          }}
        >
          <View style={styles.smsCancelButton}>
            <Text style={styles.smsAuthenticateButtonText}>
              {Translate.t("cancel")}
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
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
