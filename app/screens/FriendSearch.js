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
} from "react-native";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import { Colors } from "../assets/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
const win = Dimensions.get("window");
const ratioSearchIcon = win.width / 16 / 19;
export default function FriendSearch(props) {
  return (
    <SafeAreaView>
      <CustomHeader
        text="友だち検索"
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => props.navigation.navigate("Cart")}
        onBack={() => props.navigation.pop()}
      />
      <View style={{ marginHorizontal: widthPercentageToDP("4%") }}>
        <View style={styles.searchInputContainer}>
          <TextInput
            placeholder="IDで友だちを検索"
            placeholderTextColor={Colors.grey}
            style={styles.searchFriendTextInput}
          ></TextInput>
          <Image
            style={styles.searchIcon}
            source={require("../assets/Images/searchIcon.png")}
          />
        </View>
        <View style={styles.friendListContainer}>
          <View style={styles.friendTabCotainer}>
            <Image
              style={styles.friendListImage}
              source={require("../assets/Images/profileEditingIcon.png")}
            />
            <Text style={styles.friendListName}>髪長絹子</Text>
          </View>
        </View>

        <View style={styles.friendListContainer}>
          <View style={styles.friendTabCotainer}>
            <Image
              style={styles.friendListImage}
              source={require("../assets/Images/profileEditingIcon.png")}
            />
            <Text style={styles.friendListName}>髪長絹子</Text>
          </View>
        </View>

        <View style={styles.friendListContainer}>
          <View style={styles.friendTabCotainer}>
            <Image
              style={styles.friendListImage}
              source={require("../assets/Images/profileEditingIcon.png")}
            />
            <Text style={styles.friendListName}>髪長絹子</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  friendTabCotainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchFriendTextInput: {
    paddingLeft: widthPercentageToDP("5%"),
    paddingRight: widthPercentageToDP("15%"),
    flex: 1,
  },
  friendListContainer: {
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
  friendListImage: {
    width: RFValue(40),
    height: RFValue(40),
    alignSelf: "center",
    borderRadius: win.width / 2,
  },
  friendListName: {
    fontSize: RFValue(14),
    marginLeft: widthPercentageToDP("5%"),
  },
});
