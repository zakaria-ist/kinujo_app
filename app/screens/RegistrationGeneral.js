import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  Image,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import ButtonInBlack from "../assets/CustomButtons/ButtonInBlack";
import CustomKinujoWord from "../CustomComponents/CustomKinujoWordWithArrow";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";

const request = new Request();
const alert = new CustomAlert();

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
        <TouchableWithoutFeedback onPress={() => props.navigation.pop()}>
          <Image
            style={{
              marginLeft: "5%",
              marginTop: "10%",
              width: 20,
              height: 20,
            }}
            source={require("../assets/Images/whiteBackArrow.png")}
          />
        </TouchableWithoutFeedback>
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
              fontSize: RFValue(18),
            }}
          >
            新規会員登録
          </Text>
          <Image
            style={{
              marginTop: 10,
              width: widthPercentageToDP("4%"),
              height: heightPercentageToDP("8%"),
            }}
            source={require("../assets/Images/tripleWhiteDot.png")}
          />
        </View>
        <View>
          <TextInput
            style={styles.ニックネーム}
            placeholderTextColor={Colors.white}
            placeholder="ニックネーム"
            onChangeText={(text) => onNicknameChanged(text)}
            value={nickname}
          ></TextInput>
          <TextInput
            style={styles.パスワード}
            placeholderTextColor={Colors.white}
            placeholder="パスワード"
            secureTextEntry={true}
            onChangeText={(text) => onPasswordChanged(text)}
            value={password}
          ></TextInput>
          <TextInput
            style={styles.パスワード確認}
            placeholderTextColor={Colors.white}
            placeholder="パスワード（確認）"
            secureTextEntry={true}
            onChangeText={(text) => onConfirmPasswordChanged(text)}
            value={confirm_password}
          ></TextInput>
          <TextInput
            style={styles.携帯電話番号}
            placeholderTextColor={Colors.white}
            placeholder="携帯電話番号"
            onChangeText={(text) => onPhoneChanged(text)}
            value={phone}
          ></TextInput>
        </View>
        <ButtonInBlack
          onPress={() => {
            if (nickname && phone && password && password && confirm_password) {
              if (password == confirm_password) {
                request
                  .post("user/register", {
                    nickname: nickname,
                    username: phone,
                    password: password,
                    authority: "general",
                  })
                  .then(function (response) {
                    if (response.success) {
                    } else {
                      alert.warning(response.error);
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
                    alert.warning("unknown_error");
                  });
              } else {
                alert.warning("Password and confirm password must be same.");
              }
            } else {
              alert.warning("All fields must be filled.");
            }
          }}
          text="新規登録はこちら"
        ></ButtonInBlack>
        <ButtonInBlack
          onPress={() => {
            props.navigation.navigate("RegistrationStore");
          }}
          text="美容師orサロンとして登録"
        ></ButtonInBlack>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  ニックネーム: {
    borderBottomWidth: 1,
    marginHorizontal: 35,
    padding: 10,
    borderBottomColor: Colors.white,
  },
  パスワード: {
    borderBottomWidth: 1,
    marginHorizontal: 35,
    padding: 10,
    borderBottomColor: Colors.white,
  },
  パスワード確認: {
    borderBottomWidth: 1,
    marginHorizontal: 35,
    padding: 10,
    borderBottomColor: Colors.white,
  },
  携帯電話番号: {
    borderBottomWidth: 1,
    marginHorizontal: 35,
    padding: 10,
    borderBottomColor: Colors.white,
  },
});
