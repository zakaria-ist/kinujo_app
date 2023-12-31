import React from "react";
import { InteractionManager } from 'react-native';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import AsyncStorage from "@react-native-community/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import SplashScreen from 'react-native-splash-screen'
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import Translate from "../assets/Translates/Translate";
const win = Dimensions.get("window");
const ratioKinujo = win.width / 1.6 / 151;
export default function AccountExamination(props) {
  setTimeout(function(){
    SplashScreen.hide();
  }, 1000)
  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <Image
        style={{
          width: win.width - widthPercentageToDP("10%"),
          height: 38 * ratioKinujo,
          alignSelf: "center",
          marginTop: heightPercentageToDP("6%")
        }}
        source={require("../assets/Images/kinujo.png")}
      />
      <View>
        <Text style={styles.thanksForRegistration}>
          {Translate.t("thankYouForRegistration")}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: RFValue(12),
            alignSelf: "center",
            textAlign: "center",
            paddingHorizontal: "10%",
            marginTop: heightPercentageToDP("5%"),
          }}
        >
          {Translate.t("accountReviewingText")}
        </Text>
        <TouchableOpacity
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: "HomeGeneral"}],
            });
          }}
        >
          <View style={styles.okButton}>
            <Text style={styles.okButtonText}>OK</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  thanksForRegistration: {
    color: "white",
    fontSize: RFValue(16),
    alignSelf: "center",
    marginTop: heightPercentageToDP("14%"),
  },
  okButton: {
    marginTop: heightPercentageToDP("10"),
    borderRadius: 5,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("25%"),
    backgroundColor: Colors.deepGrey,
  },
  okButtonText: {
    color: "white",
    fontSize: RFValue(12),
    textAlign: "center",
  },
});
