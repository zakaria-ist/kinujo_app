import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import { Colors } from "../assets/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
export default function PasswordResetCompletion(props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <CustomKinujoWord />
        <Text style={styles.passwordChangeCompleteText}>
          {Translate.t("passwordChanged")}
        </Text>
        <Text
          style={{
            color: "black",
            fontSize: RFValue(16),
            alignSelf: "center",
            marginTop: heightPercentageToDP("5%"),
            textAlign: "center",
            paddingHorizontal: widthPercentageToDP("3%"),
          }}
        >
          {Translate.t("pleaseLoginFromLoginScreen")}
        </Text>

        <TouchableOpacity onPress={() => props.navigation.popToTop()}>
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
    fontSize: RFValue(20),
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
    fontSize: RFValue(16),
    textAlign: "center",
  },
});
