import React from "react";
import { InteractionManager } from 'react-native';

import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import CustomHeader from "../assets/CustomComponents/CustomHeader";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import { Colors } from "../assets/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
const win = Dimensions.get("window");
const ratioSearchIcon = win.width / 16 / 19;

export default function ContactSearch(props) {
  return (
    <SafeAreaView>
      <CustomHeader
        text={Translate.t("contact")}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => props.navigation.navigate("Cart")}
      />
      <CustomSecondaryHeader outUser={user} props={props} name="髪長絹子 さん" />
      <View style={{ marginHorizontal: widthPercentageToDP("4%") }}>
        <View style={styles.searchInputContainer}>
          <TextInput
            autoFocus="true"
            placeholder="髪長"
            placeholderTextColor={Colors.grey}
            style={styles.searchContactTextInput}
          ></TextInput>
          <Image
            style={styles.searchIcon}
            source={require("../assets/Images/searchIcon.png")}
          />
        </View>
        <View style={styles.contactListContainer}>
          <View style={styles.contactTabContainer}>
            <Image
              style={styles.contactListImage}
              source={require("../assets/Images/profileEditingIcon.png")}
            />
            <Text style={styles.contactListName}>髪長絹子</Text>
          </View>
        </View>
      </View>
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
    backgroundColor: Colors.F6F6F6,
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
