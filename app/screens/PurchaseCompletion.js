import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";

const request = new Request();

export default function PurchaseCompletion(props) {
  const [user, setUser] = React.useState({});
  React.useEffect(() => {
    AsyncStorage.getItem("user").then((url) => {
      request.get(url).then((response) => {
        setUser(response.data);
      });
    });
  });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        text={Translate.t("purchaseCompletion")}
        onPress={() => props.navigation.navigate("Cart")}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
      />
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: heightPercentageToDP("30%"),
        }}
      >
        <Text
          style={{
            fontSize: RFValue(14),
            color: Colors.D7CCA6,
            textAlign: "center",
          }}
        >
          {Translate.t("thankYouForOrder")}
        </Text>
        <Text
          style={{
            fontSize: RFValue(12),
            marginTop: heightPercentageToDP("3%"),
            textAlign: "center",
          }}
        >
          {Translate.t("waitUntilDelivery")}
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (user.is_seller) {
              // props.navigation.reset({
              //   index: 0,
              //   routes: [{ name: "HomeStore" }],
              // });
              props.navigation.navigate("HomeStore");
            } else {
              // props.navigation.reset({
              //   index: 0,
              //   routes: [{ name: "HomeGeneral" }],
              // });
              props.navigation.navigate("HomeGeneral");
            }
          }}
        >
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>OK</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: Colors.E6DADE,
    borderRadius: 5,
    marginTop: heightPercentageToDP("15%"),
    paddingVertical: heightPercentageToDP("1%"),
    paddingHorizontal: widthPercentageToDP("25%"),
    alignItems: "center",
  },
  buttonText: {
    fontSize: RFValue(14),
    color: "white",
  },
});
