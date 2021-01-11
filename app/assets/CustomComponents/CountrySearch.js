import React, { useState } from "react";
import { Text, View, TouchableWithoutFeedback } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

export default function CountrySearch({ props, onNavigate, defaultCountry, onCountryChanged, icon }) {
  const isFocused = useIsFocused();
  const [countryCode, setCountryCode] = React.useState("");

  React.useEffect(() => {
    AsyncStorage.getItem("selectedCountry").then((val) => {
      onCountryChanged(val);
      setCountryCode(val);
      AsyncStorage.removeItem("selectedCountry");
    });
  }, [isFocused]);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if(onNavigate){
          onNavigate();
        }
        props.navigation.navigate("CountrySearch");
      }}
    >
      <View
        style={{
          //   alignItems: "center",
          justifyContent: "center",
          padding: 5,
          borderWidth: 1,
          borderRadius: 5,
          width: widthPercentageToDP("23%"),
          height: heightPercentageToDP("6%"),
        }}
      >
        <Text
          style={{
            // alignSelf: "center",
            fontSize: RFValue(10),
            paddingLeft: widthPercentageToDP("3%"),
          }}
        >
          {countryCode ? countryCode : (defaultCountry ? defaultCountry : "+")}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
