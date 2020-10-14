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
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const request = new Request();
const alert = new CustomAlert();

export default function RegistrationStore(props) {
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
              marginTop: heightPercentageToDP("5%"),
              color: Colors.white,
              fontSize: RFValue(24),
            }}
          >
            ストアアカウント
          </Text>
          <Text
            style={{
              marginTop: 5,
              color: Colors.white,
              fontSize: RFValue(20),
            }}
          >
            新規会員登録
          </Text>
          <Image
            style={{
              marginTop: heightPercentageToDP("2%"),
              width: widthPercentageToDP("4%"),
              height: heightPercentageToDP("8%"),
            }}
            source={require("../assets/Images/tripleWhiteDot.png")}
          />
        </View>
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
          secureTextEntry={true}
          placeholder="パスワード"
          onChangeText={(text) => onPasswordChanged(text)}
          value={password}
        ></TextInput>
        <TextInput
          style={styles.パスワード確認}
          placeholderTextColor={Colors.white}
          secureTextEntry={true}
          placeholder="パスワード（確認）"
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

        <ButtonInBlack
          onPress={() => {
            if (nickname && phone && password && password && confirm_password) {
              if (password == confirm_password) {
                request
                  .post("user/register", {
                    nickname: nickname,
                    username: phone,
                    password: password,
                    authority: "store",
                  })
                  .then(function (response) {
                    if (response.success) {
                      props.navigation.navigate("SMSAuthentication");
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
          text="SMS認証へ進む"
        ></ButtonInBlack>

        <View
          onPress={() => props.navigation.pop()}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            marginTop: heightPercentageToDP("4%"),
          }}
        >
          <Text
            onPress={() => props.navigation.pop()}
            style={{
              color: Colors.white,
            }}
          >
            美容師以外の方はこちら
            <Image source={require("../assets/Images/whiteNextArrow.png")} />
          </Text>
          <Image
            onPress={() => props.navigation.pop()}
            style={{
              alignSelf: "center",
              marginLeft: 5,
              width: 15,
              height: 15,
            }}
            source={require("../assets/Images/whiteNextArrow.png")}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  ニックネーム: {
    borderBottomWidth: 1,
    padding: 10,
    marginHorizontal: 35,
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
