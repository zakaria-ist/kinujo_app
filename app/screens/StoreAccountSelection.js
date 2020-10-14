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
import SalonShopButton from "../assets/CustomButtons/SalonShopButton";
import HairDresserButton from "../assets/CustomButtons/HairDresserButton";
import CustomKinujoWord from "../CustomComponents/CustomKinujoWord";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP } from "react-native-responsive-screen";
export default function StoreAccountSelection() {
  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <CustomKinujoWord />
          <Text style={styles.storeAccountSelectionText}>
            ストアアカウントの選択
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: RFValue(16),
              alignSelf: "center",
              marginTop: heightPercentageToDP("5%"),
              textAlign: "center",
            }}
          >
            ご希望のストアアカウントを選択してください。
          </Text>
          <SalonShopButton text="サロン・ショップとして登録"></SalonShopButton>
          <HairDresserButton text="理美容師として登録"></HairDresserButton>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  storeAccountSelectionText: {
    color: "white",
    fontSize: RFValue(22),
    alignSelf: "center",
    textAlign: "center",
    marginTop: heightPercentageToDP("15%"),
  },
});
