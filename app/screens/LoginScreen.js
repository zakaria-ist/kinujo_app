import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  TextInput,
} from "react-native";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import ButtonInBlack from "../assets/CustomButtons/ButtonInBlack";
import ButtonInBrown from "../assets/CustomButtons/ButtonInBrown";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";
import CustomKinujoWord from "../CustomComponents/CustomKinujoWord";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Dimensions } from "react-native";

const request = new Request();
const alert = new CustomAlert();

export default function MainMenuScreen(props) {
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
        placeholder="携帯電話番号"
        style={styles.携帯電話番号}
      ></TextInput>
      <TextInput
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
                if (response.success) {
                  let profile = response.data;
                  if(profile.authority.name == 'Store' && !profile.tel_verified){
                    props.navigation.navigate("SMSAuthentication")
                  }
                  if(profile.authority.name == 'Store' && !profile.store_account_selected){
                    props.navigation.navigate("StoreAccountSelection")
                  }
                  if(profile.authority.name == 'Store' && !profile.bank_skipped){
                    props.navigation.navigate("BankAccountRegistration")
                  }
                  if(profile.authority.name == 'Store' && !profile.examined){
                    props.navigation.navigate("AccountExamination")
                  }
                  props.navigation.navigate("Home");
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
        text="ログイン"
      ></ButtonInBrown>
      <Text
        onPress={() => props.navigation.navigate("PasswordReset")}
        style={{
          alignSelf: "center",
          marginTop: "10%",
          borderBottomColor: Colors.black,
          borderBottomWidth: 1,
        }}
      >
        パスワードを忘れた方はこちら
      </Text>
      <ButtonInBlack
        text="新規登録はこちら"
        onPress={() => props.navigation.navigate("RegistrationGeneral")}
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
