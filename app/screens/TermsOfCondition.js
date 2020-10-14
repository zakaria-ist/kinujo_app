import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  Image,
  View,
  Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import SMSButton from "../assets/CustomButtons/SMSButton";
import { ScrollView } from "react-native-gesture-handler";
import CustomKinujoWord from "../CustomComponents/CustomKinujoWordWithArrow";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
export default function TermsOfCondition() {
  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Image
          style={{
            marginLeft: "5%",
            marginTop: "10%",
            width: 20,
            height: 20,
          }}
          source={require("../assets/Images/whiteBackArrow.png")}
        />
        <CustomKinujoWord />
        <Text style={styles.利用規約}>利用規約</Text>
        <ScrollView style={styles.ScrollView}>
          <Text style={styles.利用規約Content}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text>
        </ScrollView>
        <SMSButton text="同意する"></SMSButton>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  ScrollView: {
    marginHorizontal: widthPercentageToDP("10%"),
    marginTop: heightPercentageToDP("3%"),
    height: "30%",
  },
  利用規約Content: { color: "white" },
  利用規約: {
    alignSelf: "center",
    marginTop: "10%",
    color: "white",
    fontSize: 20,
  },
});
