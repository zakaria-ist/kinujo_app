import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  TextInput,
} from "react-native";
import ButtonInBlack from "../assets/CustomButtons/ButtonInBlack";
import ButtonInBrown from "../assets/CustomButtons/ButtonInBrown";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";

export default function MainMenuScreen(props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <ImageBackground
        style={styles.backgroundImageContainer}
        source={require("../assets/Images/LoginPageLogo.png")}
      >
        <Image
          style={{
            alignSelf: "center",
            marginTop: "20%",
            width: "60%",
            height: "20%",
          }}
          source={require("../assets/Images/kinu.png")}
        />
      </ImageBackground>
      <Image
        style={{ alignSelf: "center" }}
        source={require("../assets/Images/tripleDot.png")}
      />
      <TextInput
        placeholder="携帯電話番号"
        style={styles.携帯電話番号}
      ></TextInput>
      <TextInput placeholder="パスワード" style={styles.パスワード}></TextInput>
      <ButtonInBrown text="ログイン"></ButtonInBrown>
      <Text style={{ alignSelf: "center", marginTop: "10%" }}>
        パスワードを忘れた方はこちら
      </Text>

      <ButtonInBlack text="新規登録はこちら"></ButtonInBlack>
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
    marginLeft: "10%",
    width: "80%",
    borderBottomColor: Colors.D7CCA6,
  },
  パスワード: {
    marginLeft: "10%",
    width: "80%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
  },
});
