import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  Image,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import ButtonInBlack from "../assets/CustomButtons/ButtonInBlack";
export default function LoginScreen() {
  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Image
          style={{ marginLeft: "5%", marginTop: "10%", width: 30, height: 30 }}
          source={require("../assets/Images/whiteBackArrow.png")}
        />
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: "60%",
              height: "5%",
              marginTop: "10%",
            }}
            source={require("../assets/Images/kinujo.png")}
          />
          <Text style={{ marginTop: "30%", color: Colors.white, fontSize: 20 }}>
            ストアアカウント
          </Text>
          <Text style={{ marginTop: 10, color: Colors.white, fontSize: 20 }}>
            新規会員登録
          </Text>
          <Image
            style={{
              marginTop: "10%",
              width: 15,
              height: 55,
            }}
            source={require("../assets/Images/tripleWhiteDot.png")}
          />
          <TextInput
            style={styles.ニックネーム}
            placeholderTextColor={Colors.white}
            placeholder="ニックネーム"
          ></TextInput>
          <TextInput
            style={styles.パスワード}
            placeholderTextColor={Colors.white}
            placeholder="パスワード"
          ></TextInput>
          <TextInput
            style={styles.パスワード確認}
            placeholderTextColor={Colors.white}
            placeholder="パスワード（確認）"
          ></TextInput>
          <TextInput
            style={styles.携帯電話番号}
            placeholderTextColor={Colors.white}
            placeholder="携帯電話番号"
          ></TextInput>
        </View>
        <ButtonInBlack text="SMS認証へ進む"></ButtonInBlack>
        <Text
          style={{
            alignSelf: "center",
            color: Colors.white,
            marginTop: "8%",
          }}
        >
          美容師以外の方はこちら
          <Image source={require("../assets/Images/whiteNextArrow.png")} />
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  ニックネーム: {
    alignSelf: "flex-start",
    borderBottomWidth: 1,
    marginLeft: "10%",
    padding: 10,
    width: "80%",
    borderBottomColor: Colors.white,
  },
  パスワード: {
    alignSelf: "flex-start",
    borderBottomWidth: 1,
    width: "80%",
    marginLeft: "10%",
    padding: 10,
    borderBottomColor: Colors.white,
  },
  パスワード確認: {
    alignSelf: "flex-start",
    borderBottomWidth: 1,
    width: "80%",
    marginLeft: "10%",
    padding: 10,
    borderBottomColor: Colors.white,
  },
  携帯電話番号: {
    alignSelf: "flex-start",
    borderBottomWidth: 1,
    width: "80%",
    marginLeft: "10%",
    padding: 10,
    borderBottomColor: Colors.white,
  },
});
