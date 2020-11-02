import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratio = win.width / 23 / 15;
export default function LoginScreen(props) {
  const [password, onPasswordChanged] = React.useState("");
  const [phone, onPhoneChanged] = React.useState("");

  AsyncStorage.getItem("user").then(function (url) {
    if (url) {
      request
        .get(url)
        .then(function (response) {
          if (response.data.is_seller) {
            props.navigation.navigate("HomeStore");
          } else {
            props.navigation.navigate("HomeGeneral");
          }
        })
        .catch(function (error) {
          console.log(error);
          alert.warning(Translate.t("unkownError"));
        });
    }
  });
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <ImageBackground
        style={styles.backgroundImageContainer}
        source={require("../assets/Images/LoginPageLogo.png")}
      >
        <CustomKinujoWord />
      </ImageBackground>
      <Image
        style={{
          alignSelf: "center",
          width: win.width / 23,
          height: 52 * ratio,
          marginTop: heightPercentageToDP("3%"),
        }}
        source={require("../assets/Images/tripleDot.png")}
      />
      <TextInput
        onChangeText={(text) => onPhoneChanged(text)}
        value={phone}
        placeholder={Translate.t("phoneNumber")}
        placeholderTextColor={Colors.D7CCA6}
        style={styles.携帯電話番号}
      ></TextInput>
      <TextInput
        placeholder={Translate.t("password")}
        placeholderTextColor={Colors.D7CCA6}
        secureTextEntry={true}
        onChangeText={(text) => onPasswordChanged(text)}
        value={password}
        style={styles.パスワード}
      ></TextInput>

      <TouchableOpacity
        onPress={() => {
          if (phone && password) {
            request
              .post("user/login", {
                tel: phone,
                password: password,
              })
              .then(function (response) {
                onPasswordChanged("");
                onPhoneChanged("");

                response = response.data;
                if (response.success) {
                  let user = response.data.user;
                  if (user.payload) {
                    user.payload = JSON.parse(user.payload);
                  } else {
                    user.payload = {};
                  }
                  AsyncStorage.setItem("user", user.url).then(function (
                    response
                  ) {
                    if (
                      user.authority.name == "Store" &&
                      !user.payload.account_selected
                    ) {
                      props.navigation.navigate("StoreAccountSelection");
                    } else if (
                      user.authority.name == "Store" &&
                      !user.payload.bank_skipped
                    ) {
                      props.navigation.navigate(
                        "BankAccountRegistrationOption"
                      );
                    } else if (
                      user.authority.name == "Store" &&
                      !user.is_approved
                    ) {
                      props.navigation.navigate("AccountExamination");
                    } else if (
                      user.authority.name == "Store" &&
                      !user.payload.register_completed
                    ) {
                      props.navigation.navigate("RegisterCompletion");
                    } else {
                      props.navigation.navigate("Home");
                    }
                  });
                } else {
                  alert.warning(response.error);
                }
              })
              .catch(function (error) {
                console.log(error);
                alert.warning(Translate.t("unkownError"));
              });
          } else {
            alert.warning(Translate.t("fieldNotFilled"));
          }
        }}
      >
        <View style={styles.loginButton}>
          <Text style={styles.loginButtonText}>{Translate.t("login")}</Text>
        </View>
      </TouchableOpacity>
      <Text
        onPress={() => props.navigation.navigate("PasswordReset")}
        style={{
          alignSelf: "center",
          marginTop: heightPercentageToDP("3%"),
          fontSize: RFValue(13),
          borderBottomColor: Colors.black,
          borderBottomWidth: 1,
        }}
      >
        {Translate.t("forgetPasswordText")}
      </Text>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("HomeGeneral");
          // props.navigation.navigate("TermsOfCondition");
        }}
      >
        <View style={styles.registerButton}>
          <Text style={styles.registerButtonText}>
            {Translate.t("newRegistration")}
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImageContainer: {
    flex: 0.8,
    width: "100%",
  },
  携帯電話番号: {
    fontSize: RFValue(16),
    paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    borderBottomWidth: 1,
    marginHorizontal: widthPercentageToDP("10%"),
    marginTop: heightPercentageToDP("3%"),
    borderBottomColor: Colors.D7CCA6,
  },
  パスワード: {
    fontSize: RFValue(16),
    paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    marginHorizontal: widthPercentageToDP("10%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
  },
  loginButton: {
    marginTop: heightPercentageToDP("5"),
    borderRadius: 5,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("10%"),
    backgroundColor: Colors.D7CCA6,
  },
  loginButtonText: {
    color: "white",
    fontSize: RFValue(16),
    textAlign: "center",
  },
  registerButton: {
    marginTop: heightPercentageToDP("5"),
    borderRadius: 5,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("10%"),
    backgroundColor: Colors.deepGrey,
  },
  registerButtonText: {
    color: "white",
    fontSize: RFValue(16),
    textAlign: "center",
  },
});
