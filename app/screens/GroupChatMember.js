import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import { Checkbox } from "react-native-paper";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeader";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";

const request = new Request();
const alert = new CustomAlert();

const win = Dimensions.get("window");
const ratioSearchIcon = win.width / 16 / 19;
export default function FolderMemberSelection(props) {
  const [checked, onCheckedChanged] = React.useState(false);
  return (
    <SafeAreaView>
      <CustomHeader
        text="フォルダメンバー選択"
        onPress={() => props.navigation.navigate("Cart")}
      />
      <TouchableWithoutFeedback onPress={() => props.navigation.pop()}>
        <Text
          style={{
            fontSize: RFValue(14),
            right: 0,
            position: "absolute",
            marginTop: heightPercentageToDP("8%"),
            marginRight: widthPercentageToDP("8%"),
          }}
        >
          次へ
        </Text>
      </TouchableWithoutFeedback>
      <View
        style={{
          marginHorizontal: widthPercentageToDP("4%"),
          marginTop: widthPercentageToDP("2%"),
        }}
      >
        <View>
          <View style={styles.searchInputContainer}>
            <TextInput
              placeholder="検索"
              placeholderTextColor={Colors.grey}
              style={styles.searchInput}
            ></TextInput>
            <Image
              style={styles.searchIcon}
              source={require("../assets/Images/searchIcon.png")}
            />
          </View>
        </View>
        <View style={styles.tabContainer}>
          <Image style={styles.memberImage} />
          <Text style={styles.tabContainerText}>髪長絹子</Text>
          <View style={styles.checkBoxContainer}>
            <Checkbox
              color={Colors.E6DADE}
              uncheckedColor={Colors.E6DADE}
              status={checked ? "checked" : "unchecked"}
              onPress={() => onCheckedChanged(!checked)}
            />
          </View>
        </View>
        <View style={styles.tabContainer}>
          <Image style={styles.memberImage} />
          <Text style={styles.tabContainerText}>髪長絹子</Text>
          <View style={styles.checkBoxContainer}>
            <Checkbox
              color={Colors.E6DADE}
              uncheckedColor={Colors.E6DADE}
              status={checked ? "checked" : "unchecked"}
              onPress={() => onCheckedChanged(!checked)}
            />
          </View>
        </View>
        <View style={styles.tabContainer}>
          <Image style={styles.memberImage} />
          <Text style={styles.tabContainerText}>髪長絹子</Text>
          <View style={styles.checkBoxContainer}>
            <Checkbox
              color={Colors.E6DADE}
              uncheckedColor={Colors.E6DADE}
              status={checked ? "checked" : "unchecked"}
              onPress={() => onCheckedChanged(!checked)}
            />
          </View>
        </View>
        <View style={styles.tabContainer}>
          <Image style={styles.memberImage} />
          <Text style={styles.tabContainerText}>髪長絹子</Text>
          <View style={styles.checkBoxContainer}>
            <Checkbox
              color={Colors.E6DADE}
              uncheckedColor={Colors.E6DADE}
              status={checked ? "checked" : "unchecked"}
              onPress={() => onCheckedChanged(!checked)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  checkBoxContainer: {
    position: "absolute",
    right: 0,
    alignSelf: "center",
  },
  searchInputContainer: {
    marginTop: heightPercentageToDP("1.5%"),
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: Colors.F6F6F6,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: win.width / 2,
    height: heightPercentageToDP("5%"),
  },
  searchInput: {
    paddingLeft: widthPercentageToDP("5%"),
    paddingRight: widthPercentageToDP("15%"),
    flex: 1,
  },
  searchIcon: {
    width: win.width / 16,
    height: 19 * ratioSearchIcon,
    position: "absolute",
    right: 0,
    marginRight: widthPercentageToDP("5%"),
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: heightPercentageToDP("2%"),
    alignItems: "center",
  },
  tabContainerText: {
    fontSize: RFValue(12),
    marginLeft: widthPercentageToDP("5%"),
  },
  memberImage: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: win.width / 2,
    backgroundColor: Colors.DCDCDC,
  },
});
