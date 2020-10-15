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
import SMSButton from "../assets/CustomButtons/SMSButton";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";

const request = new Request();
const alert = new CustomAlert();

import Translate from "../assets/Translates/Translate";
export default function SMSAuthentication(props) {
  const [code, onCodeChanged] = React.useState("");
  const phone = props.navigation.state.params.username
  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <CustomKinujoWord />
        <Text style={styles.SMS認証}>{Translate.t("smsAuthentication")}</Text>
        <Text
          style={{
            color: "white",
            fontSize: RFValue(12),
            alignSelf: "center",
            marginTop: heightPercentageToDP("3%"),
            textAlign: "center",
          }}
        >
          {Translate.t("sentVerificationCode")}
        </Text>
        <TextInput
          style={styles.verificationCode}
          placeholder={Translate.t("enterVerificationCode")}
          placeholderTextColor="white"
          onChangeText={(text) => onCodeChanged(text)}
          value={code}
        ></TextInput>
        <SMSButton
          text={Translate.t("authenticate")}
          onPress={() => {
            request.post("user/register", props.navigation.state.params)
            .then(function (response) {
              response = response.data;
              if (response.success) {
                AsyncStorage.setItem(
                  'user',
                  response.data.user.url
                ).then(function(response){
                  onCodeChanged("")
                  if(props.navigation.state.params.authority == 'general'){
                    props.navigation.navigate("RegisterCompletion")
                  } else if(props.navigation.state.params.authority == 'store'){
                    props.navigation.navigate("StoreAccountSelection")
                  }
                })
              } else {
                alert.warning(response.error);
              }
            })
            .catch(function (error) {
              console.log(error);
              alert.warning("unknown_error");
            });
          }}
        ></SMSButton>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  SMS認証: {
    color: "white",
    fontSize: RFValue(16),
    alignSelf: "center",
    marginTop: heightPercentageToDP("16%"),
  },
  verificationCode: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    padding: 10,
    fontSize: RFValue(14),
    marginTop: heightPercentageToDP("8%"),
    marginHorizontal: 35,
  },
});
