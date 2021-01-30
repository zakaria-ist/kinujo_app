import React from "react";
import { InteractionManager } from 'react-native';

import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import { Colors } from "../assets/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
const win = Dimensions.get("window");
const ratioKinujo = win.width / 1.6 / 151;
export default function PasswordResetCompletion(props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Image
          style={{
            width: win.width / 1.6,
            height: 44 * ratioKinujo,
            alignSelf: "center",
            marginTop: heightPercentageToDP("6%"),
          }}
          source={require("../assets/Images/kinujo.png")}
        />
        <Text style={styles.passwordChangeCompleteText}>
          {Translate.t("passwordChanged")}
        </Text>
        <Text
          style={{
            color: "black",
            fontSize: RFValue(14),
            alignSelf: "center",
            marginTop: heightPercentageToDP("5%"),
            textAlign: "center",
            paddingHorizontal: widthPercentageToDP("3%"),
          }}
        >
          {Translate.t("pleaseLoginFromLoginScreen")}
        </Text>

        <TouchableOpacity onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{ name: "LoginScreen" }],
            });
        }}>
          <View style={styles.okButton}>
            <Text style={styles.okButtonText}>OK</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  passwordChangeCompleteText: {
    color: "black",
    fontSize: RFValue(16),
    alignSelf: "center",
    marginTop: heightPercentageToDP("20%"),
    textAlign: "center",
  },
  okButton: {
    marginTop: heightPercentageToDP("10"),
    borderRadius: 5,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("25%"),
    backgroundColor: Colors.D7CCA6,
  },
  okButtonText: {
    color: "white",
    fontSize: RFValue(12),
    textAlign: "center",
  },
});
