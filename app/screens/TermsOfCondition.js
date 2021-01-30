import React from "react";
import { InteractionManager } from 'react-native';

import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import { ScrollView } from "react-native-gesture-handler";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWordWithArrow";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import WhiteBackArrow from "../assets/CustomComponents/CustomWhiteBackArrow";
export default function TermsOfCondition(props) {
  const win = Dimensions.get("window");
  const ratio = win.width / 1.6 / 151;
  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <WhiteBackArrow onPress={() => props.navigation.goBack()} />
        <Image
          style={{
            width: win.width / 1.6,
            height: 44 * ratio,
            alignSelf: "center",
            marginTop: heightPercentageToDP("3%"),
          }}
          source={require("../assets/Images/kinujo.png")}
        />
        <Text style={styles.利用規約}>{Translate.t("termsOfService")}</Text>
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
        <TouchableOpacity
          onPress={() => props.navigation.navigate("RegistrationGeneral")}
        >
          <View style={styles.agreeButton}>
            <Text style={styles.agreeButtonText}>{Translate.t("agree")}</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  ScrollView: {
    marginHorizontal: widthPercentageToDP("7%"),
    marginTop: heightPercentageToDP("3%"),
    height: "30%",
  },
  利用規約Content: { color: "white", fontSize: RFValue(11) },
  利用規約: {
    alignSelf: "center",
    marginTop: heightPercentageToDP("5%"),
    color: "white",
    fontSize: RFValue(14),
  },
  agreeButton: {
    borderRadius: 5,
    backgroundColor: "#f01d71",
    paddingVertical: heightPercentageToDP("1.5%"),
    marginHorizontal: heightPercentageToDP("12%"),
    marginVertical: widthPercentageToDP("12%"),

    backgroundColor: Colors.deepGrey,
  },
  agreeButtonText: {
    color: "white",
    fontSize: RFValue(14),
    textAlign: "center",
  },
});
