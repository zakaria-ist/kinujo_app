import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  TextInput,
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import ButtonInBlack from "../assets/CustomButtons/ButtonInBlack";
import ButtonInBrown from "../assets/CustomButtons/ButtonInBrown";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
const request = new Request();
const alert = new CustomAlert();

export default function LoginScreen(props) {
  const [password, onPasswordChanged] = React.useState("");
  const [phone, onPhoneChanged] = React.useState("");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <ImageBackground
        style={styles.backgroundImageContainer}
        source={require("../assets/Images/LoginPageLogo.png")}
      >
        <CustomKinujoWord />
      </ImageBackground>
      <Image
        style={{ alignSelf: "center", width: wp("4%"), height: hp("8%") }}
        source={require("../assets/Images/tripleDot.png")}
      />
      <TextInput
        onChangeText={(text) => onPhoneChanged(text)}
        value={phone}
        placeholder={Translate.t("phoneNumber")}
        style={styles.携帯電話番号}
      ></TextInput>
      <TextInput
        placeholder={Translate.t("password")}
        placeholder="パスワード"
        secureTextEntry={true}
        onChangeText={(text) => onPasswordChanged(text)}
        value={password}
        style={styles.パスワード}
      ></TextInput>
      <ButtonInBrown
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
                  if(user.payload){
                    user.payload = JSON.parse(user.payload)
                  } else {
                    user.payload = {}
                  }
                  AsyncStorage.setItem(
                    'user',
                    user.url
                  ).then(function(response){
                    if(user.authority.name == 'Store' && !user.payload.account_selected){
                      props.navigation.navigate("StoreAccountSelection")
                    } else if(user.authority.name == 'Store' && !user.payload.bank_skipped){
                      props.navigation.navigate("BankAccountRegistration")
                    } else if(user.authority.name == 'Store' && !user.is_approved){
                      props.navigation.navigate("AccountExamination")
                    } else if(user.authority.name == 'Store' && !user.payload.register_completed){
                      props.navigation.navigate("RegisterCompletion")
                    } else {
                      props.navigation.navigate("Home");
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
          } else {
            alert.warning("All fields must be filled.");
          }
        }}
        text={Translate.t("login")}
      ></ButtonInBrown>
      <Text
        onPress={() => props.navigation.navigate("PasswordReset")}
        style={{
          alignSelf: "center",
          marginTop: hp("3%"),
          borderBottomColor: Colors.black,
          borderBottomWidth: 1,
        }}
      >
        {Translate.t("forgetPasswordText")}
      </Text>
      <ButtonInBlack
        text={Translate.t("newRegistration")}
        onPress={() => props.navigation.navigate("TermsOfCondition")}
      ></ButtonInBlack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImageContainer: {
    flex: 0.7,
    width: "100%",
  },
  携帯電話番号: {
    padding: 10,
    borderBottomWidth: 1,
    marginHorizontal: 35,
    borderBottomColor: Colors.D7CCA6,
  },
  パスワード: {
    padding: 10,
    marginHorizontal: 35,
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
  },
});
