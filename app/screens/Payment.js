import React from "react";
import { SafeAreaView } from "react-native";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";

export default function Payment(props) {
  return (
    <SafeAreaView>
      <CustomHeader
        text="お支払い"
        onBack={() => props.navigation.pop()}
        onPress={() => props.navigation.navigate("Cart")}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
      />
    </SafeAreaView>
  );
}
