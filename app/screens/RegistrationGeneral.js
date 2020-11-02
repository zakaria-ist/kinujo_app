import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWordWithArrow";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import Translate from "../assets/Translates/Translate";
import WhiteBackArrow from "../assets/CustomComponents/CustomWhiteBackArrow";
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioTripleDot = win.width / 23 / 15;
export default function RegistrationGeneral(props) {
  const [nickname, onNicknameChanged] = React.useState("");
  const [password, onPasswordChanged] = React.useState("");
  const [confirm_password, onConfirmPasswordChanged] = React.useState("");
  const [phone, onPhoneChanged] = React.useState("");

  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <WhiteBackArrow onPress={() => props.navigation.pop()} />
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <CustomKinujoWord />
          <Text
            style={{
              marginTop: heightPercentageToDP("8%"),
              color: Colors.white,
              fontSize: RFValue(16),
            }}
          >
            {Translate.t("newMemberRegistration")}
          </Text>
          <Image
            style={{
              marginTop: heightPercentageToDP("3%"),
              width: win.width / 23,
              height: 52 * ratioTripleDot,
            }}
            source={require("../assets/Images/tripleWhiteDot.png")}
          />
        </View>
        <View>
          <TextInput
            style={styles.ニックネーム}
            placeholderTextColor={Colors.white}
            placeholder={Translate.t("name")}
            onChangeText={(text) => onNicknameChanged(text)}
            value={nickname}
          ></TextInput>
          <TextInput
            style={styles.パスワード}
            placeholderTextColor={Colors.white}
            placeholder={Translate.t("password")}
            secureTextEntry={true}
            onChangeText={(text) => onPasswordChanged(text)}
            value={password}
          ></TextInput>
          <TextInput
            style={styles.パスワード確認}
            placeholderTextColor={Colors.white}
            placeholder={Translate.t("passwordConfirmation")}
            secureTextEntry={true}
            onChangeText={(text) => onConfirmPasswordChanged(text)}
            value={confirm_password}
          ></TextInput>
          <TextInput
            style={styles.携帯電話番号}
            placeholderTextColor={Colors.white}
            placeholder={Translate.t("phoneNumber")}
            onChangeText={(text) => onPhoneChanged(text)}
            value={phone}
          ></TextInput>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (nickname && phone && password && confirm_password) {
              if (password == confirm_password) {
                request
                  .post("user/register/check", {
                    nickname: nickname,
                    username: phone,
                    password: password,
                    authority: "general",
                  })
                  .then(function (response) {
                    response = response.data;
                    if (response.success) {
                      onConfirmPasswordChanged("")
                      onNicknameChanged("")
                      onPasswordChanged("")
                      onPhoneChanged("")
                      
                      props.navigation.navigate("SMSAuthentication", {
                        nickname: nickname,
                        username: phone,
                        password: password,
                        authority: "general",
                      });
                    } else {
                      alert.warning(response.error, function(){
                        props.navigation.popToTop()
                      });
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
                    alert.warning(Translate.t("unkownError"));
                  });
              } else {
                alert.warning(Translate.t("unkownError"));
              }
            } else {
              alert.warning(Translate.t("passwordAndConfirmPasswordMustSame"));
            }
          }}
        >
          <View style={styles.registerGeneralButton}>
            <Text style={styles.registerGeneralButtonText}>
              {Translate.t("registerAsGeneralUser")}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("RegistrationStore");
          }}
        >
          <View style={styles.registerBeauticianSalonButton}>
            <Text style={styles.registerBeauticianSalonButtonText}>
              {Translate.t("registerAsBeauticianOrSalon")}
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  ニックネーム: {
    borderBottomWidth: 1,
    marginHorizontal: widthPercentageToDP("10%"),
    paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    fontSize: RFValue("12"),
    borderBottomColor: Colors.white,
  },
  パスワード: {
    borderBottomWidth: 1,
    marginHorizontal: widthPercentageToDP("10%"),
    paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    fontSize: RFValue("12"),
    borderBottomColor: Colors.white,
  },
  パスワード確認: {
    borderBottomWidth: 1,
    marginHorizontal: widthPercentageToDP("10%"),
    paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    fontSize: RFValue("12"),
    borderBottomColor: Colors.white,
  },
  携帯電話番号: {
    borderBottomWidth: 1,
    marginHorizontal: widthPercentageToDP("10%"),
    paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    fontSize: RFValue("12"),
    borderBottomColor: Colors.white,
  },
  registerGeneralButton: {
    marginTop: heightPercentageToDP("5"),
    borderRadius: 5,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("10%"),
    backgroundColor: Colors.deepGrey,
  },
  registerGeneralButtonText: {
    color: "white",
    fontSize: RFValue(16),
    textAlign: "center",
  },
  registerBeauticianSalonButton: {
    marginTop: heightPercentageToDP("5"),
    borderRadius: 5,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("10%"),
    backgroundColor: Colors.deepGrey,
  },
  registerBeauticianSalonButtonText: {
    color: "white",
    fontSize: RFValue(16),
    textAlign: "center",
  },
});
