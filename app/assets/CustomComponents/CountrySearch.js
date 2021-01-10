import React, { useState } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

export default function CountrySearch({ props, onCountryChanged, icon }) {
    const isFocused = useIsFocused();
    const [countryCode, setCountryCode] = React.useState("");

    React.useEffect(()=>{
        AsyncStorage.getItem('selectedCountry').then((val)=>{
            onCountryChanged(val);
            setCountryCode(val);
            AsyncStorage.removeItem('selectedCountry');
        })
    }, [isFocused])
    return (
        <TouchableWithoutFeedback onPress={()=>{
            props.navigation.navigate("CountrySearch")
        }}>
        <View style={{
            padding: 5
        }}>
            <Text style={{
                borderWidth: 1,
                backgroundColor: "white",
                borderRadius: 5,
                fontSize: RFValue(10),
                width: widthPercentageToDP("23%"),
                paddingLeft: widthPercentageToDP("3%"),
                height: heightPercentageToDP("6%"),
                }
            }>
                {countryCode ? countryCode : "+"}
            </Text>
        </View>
        </TouchableWithoutFeedback>
    );
}
