import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
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
          {Translate.t("sentVerificationCode")}
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
            request
              .post("user/register", props.navigation.state.params)
              .then(function (response) {
                response = response.data;
                if (response.success) {
                  AsyncStorage.setItem("user", response.data.user.url).then(
                    function (response) {
                      if (
                        props.navigation.state.params.authority == "general"
                      ) {
                        props.navigation.navigate("RegisterCompletion");
                      } else if (
                        props.navigation.state.params.authority == "store"
                      ) {
                        props.navigation.navigate("StoreAccountSelection");
                      }
                    }
                  );
                } else {
                  alert.warning(response.error);
                }
              })
              .catch(function (error) {
                if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
                  alert.warning(error.response.data[Object.keys(error.response.data)[0]][0]);
                }
              });
          }}
        >
          <View style={styles.smsAuthenticateButton}>
            <Text style={styles.smsAuthenticateButtonText}>
              {Translate.t("authenticate")}
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
    marginHorizontal: widthPercentageToDP("10%"),
  },
  smsAuthenticateButton: {
    borderRadius: 5,
    backgroundColor: "#f01d71",
    paddingVertical: 8,
    marginHorizontal: heightPercentageToDP("12%"),
    marginVertical: widthPercentageToDP("23%"),
    backgroundColor: Colors.deepGrey,
  },
  smsAuthenticateButtonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});
