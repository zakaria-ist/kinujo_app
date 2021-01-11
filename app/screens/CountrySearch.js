import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import AsyncStorage from "@react-native-community/async-storage";
import CustomHeader from "../assets/CustomComponents/CustomHeader";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import { Colors } from "../assets/Colors";
import Request from "../lib/request";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
// import { useIsFocused } from "@react-navigation/native";
const win = Dimensions.get("window");
const ratioSearchIcon = win.width / 16 / 19;
const request = new Request();
let countries = [];

export default function CountrySearch(props) {
  //const isFocused = useIsFocused();
  const [countryHtml, setCountryHtml] = React.useState(<View></View>);
  const [searchText, setSearchText] = React.useState("");

  function processCountryHtml(countries) {
    let html = [];
    countries.map((country) => {
      console.log();
      html.push(
        <TouchableWithoutFeedback
          onPress={() => {
            AsyncStorage.setItem("selectedCountry", country.tel_code).then(
              () => {
                props.navigation.goBack();
              }
            );
          }}
        >
          <View style={styles.contactListContainer}>
            <View style={styles.contactTabContainer}>
              {/* <Image
            style={styles.contactListImage}
            source={require("../assets/Images/profileEditingIcon.png")}
          /> */}
              <Text style={styles.contactListName}>
                {country.name} ({country.tel_code})
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    });
    return html;
  }
  React.useEffect(() => {
    request.get("country_codes/").then(function (response) {
      countries = response.data;
      setCountryHtml(processCountryHtml(countries));
    });
  }, [true]);
  return (
    <SafeAreaView>
      <View style={{ marginHorizontal: widthPercentageToDP("4%") }}>
        <View style={styles.searchInputContainer}>
          <TextInput
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              setCountryHtml(
                processCountryHtml(
                  countries.filter((country) => {
                    return (
                      country.name.toLowerCase().indexOf(text.toLowerCase()) >=
                        0 ||
                      country.tel_code
                        .toLowerCase()
                        .indexOf(text.toLowerCase()) >= 0
                    );
                  })
                )
              );
            }}
            autoFocus={true}
            placeholder=""
            placeholderTextColor={Colors.grey}
            style={styles.searchContactTextInput}
          ></TextInput>
          <Image
            style={styles.searchIcon}
            source={require("../assets/Images/searchIcon.png")}
          />
        </View>
      </View>
      <ScrollView>
        <View style={{ marginHorizontal: widthPercentageToDP("4%") }}>
          {countryHtml}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contactTabContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchContactTextInput: {
    paddingLeft: widthPercentageToDP("5%"),
    paddingRight: widthPercentageToDP("15%"),
    flex: 1,
  },
  contactListContainer: {
    marginTop: heightPercentageToDP("3%"),
  },
  searchIcon: {
    width: win.width / 16,
    height: 19 * ratioSearchIcon,
    position: "absolute",
    right: 0,
    marginRight: widthPercentageToDP("5%"),
  },
  searchInputContainer: {
    marginTop: heightPercentageToDP("3%"),
    borderWidth: 1,
    borderColor: "white",
    // backgroundColor: "orange",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: win.width / 2,
    height: heightPercentageToDP("5%"),
  },
  contactListImage: {
    width: RFValue(40),
    height: RFValue(40),
    alignSelf: "center",
    borderRadius: win.width / 2,
  },
  contactListName: {
    fontSize: RFValue(14),
    marginLeft: widthPercentageToDP("5%"),
  },
});
