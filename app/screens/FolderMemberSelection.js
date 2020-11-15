import React, { useRef } from "react";
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
  Animated,
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
const ratioCustomerList = win.width / 10 / 26;
const ratioProfile = win.width / 13 / 22;
const ratioDown = win.width / 32 / 8;
const ratioNext = win.width / 38 / 8;
export default function FolderMemberSelection(props) {
  const [checked, onCheckedChanged] = React.useState(false);
  const [groupChatShow, onGroupChatShowChanged] = React.useState(true);
  const [friendChatShow, onFriendChatShowChanged] = React.useState(true);
  const groupChatOpacity = useRef(
    new Animated.Value(heightPercentageToDP("100%"))
  ).current;
  const groupChatHeight = useRef(
    new Animated.Value(heightPercentageToDP("25%"))
  ).current;
  const friendChatOpacity = useRef(
    new Animated.Value(heightPercentageToDP("100%"))
  ).current;
  const friendChatHeight = useRef(
    new Animated.Value(heightPercentageToDP("25%"))
  ).current;
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
          {Translate.t("next")}
        </Text>
      </TouchableWithoutFeedback>
      <View
        style={{
          marginHorizontal: widthPercentageToDP("4%"),
          marginTop: widthPercentageToDP("2%"),
        }}
      >
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Colors.F0EEE9,
            paddingBottom: heightPercentageToDP("3%"),
          }}
        >
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
        <TouchableWithoutFeedback
          onPress={() => {
            groupChatShow == true
              ? Animated.parallel([
                  Animated.timing(groupChatHeight, {
                    toValue: heightPercentageToDP("0%"),
                    duration: 500,
                    useNativeDriver: false,
                  }),
                  Animated.timing(groupChatOpacity, {
                    toValue: heightPercentageToDP("0%"),
                    duration: 100,
                    useNativeDriver: false,
                  }),
                ]).start(() => {}, onGroupChatShowChanged(false))
              : Animated.parallel([
                  Animated.timing(groupChatHeight, {
                    toValue: heightPercentageToDP("25%"),
                    duration: 500,
                    useNativeDriver: false,
                  }),
                  Animated.timing(groupChatOpacity, {
                    toValue: heightPercentageToDP("100%"),
                    duration: 100,
                    useNativeDriver: false,
                  }),
                ]).start(() => {}, onGroupChatShowChanged(true));
          }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingTop: heightPercentageToDP("2%"),
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: Colors.F0EEE9,
              paddingBottom: heightPercentageToDP("2%"),
            }}
          >
            <Image
              style={{
                width: win.width / 10,
                height: ratioCustomerList * 24,
              }}
              source={require("../assets/Images/customerListIcon.png")}
            />
            <Text style={styles.tabText}> {Translate.t("groupChat")}</Text>
            {groupChatShow == true ? (
              <Image
                style={{
                  width: win.width / 32,
                  height: ratioDown * 8,
                  position: "absolute",
                  right: 0,
                  marginRight: widthPercentageToDP("2%"),
                }}
                source={require("../assets/Images/downForMoreIcon.png")}
              />
            ) : (
              <Image
                style={styles.nextIcon}
                source={require("../assets/Images/next.png")}
              />
            )}
          </View>
        </TouchableWithoutFeedback>

        <Animated.View
          style={{
            marginTop: heightPercentageToDP(".5%"),
            marginLeft: widthPercentageToDP("1%"),
            height: groupChatHeight,
            opacity: groupChatOpacity,
          }}
        >
          <View style={styles.tabContainer}>
            <Image
              style={{
                width: RFValue(40),
                height: RFValue(40),
                borderRadius: win.width / 2,
                backgroundColor: Colors.DCDCDC,
              }}
            />
            <Text style={styles.tabText}>name</Text>
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
            <Image
              style={{
                width: RFValue(40),
                height: RFValue(40),
                borderRadius: win.width / 2,
                backgroundColor: Colors.DCDCDC,
              }}
            />
            <Text style={styles.tabText}>name</Text>
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
            <Image
              style={{
                width: RFValue(40),
                height: RFValue(40),
                borderRadius: win.width / 2,
                backgroundColor: Colors.DCDCDC,
              }}
            />
            <Text style={styles.tabText}>name</Text>
            <View style={styles.checkBoxContainer}>
              <Checkbox
                color={Colors.E6DADE}
                uncheckedColor={Colors.E6DADE}
                status={checked ? "checked" : "unchecked"}
                onPress={() => onCheckedChanged(!checked)}
              />
            </View>
          </View>
        </Animated.View>
        <TouchableWithoutFeedback
          onPress={() => {
            friendChatShow == true
              ? Animated.parallel([
                  Animated.timing(friendChatHeight, {
                    toValue: heightPercentageToDP("0%"),
                    duration: 500,
                    useNativeDriver: false,
                  }),
                  Animated.timing(friendChatOpacity, {
                    toValue: heightPercentageToDP("0%"),
                    duration: 100,
                    useNativeDriver: false,
                  }),
                ]).start(() => {}, onFriendChatShowChanged(false))
              : Animated.parallel([
                  Animated.timing(friendChatHeight, {
                    toValue: heightPercentageToDP("25%"),
                    duration: 500,
                    useNativeDriver: false,
                  }),
                  Animated.timing(friendChatOpacity, {
                    toValue: heightPercentageToDP("100%"),
                    duration: 100,
                    useNativeDriver: false,
                  }),
                ]).start(() => {}, onFriendChatShowChanged(true));
          }}
        >
          <View
            style={{
              borderTopWidth: 1,
              flexDirection: "row",
              paddingTop: heightPercentageToDP("2%"),
              alignItems: "center",
              borderBottomWidth: 1,
              borderColor: Colors.F0EEE9,
              paddingBottom: heightPercentageToDP("2%"),
              marginTop: heightPercentageToDP("1.5%"),
            }}
          >
            <Image
              style={{
                width: win.width / 13,
                height: ratioProfile * 25,
                marginLeft: widthPercentageToDP("1%"),
              }}
              source={require("../assets/Images/profileEditingIcon.png")}
            />
            <Text style={styles.tabText}> {Translate.t("friend")}</Text>
            {friendChatShow == true ? (
              <Image
                style={{
                  width: win.width / 32,
                  height: ratioDown * 8,
                  position: "absolute",
                  right: 0,
                  marginRight: widthPercentageToDP("2%"),
                }}
                source={require("../assets/Images/downForMoreIcon.png")}
              />
            ) : (
              <Image
                style={styles.nextIcon}
                source={require("../assets/Images/next.png")}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            marginTop: heightPercentageToDP(".5%"),
            marginLeft: widthPercentageToDP("1%"),
            height: friendChatHeight,
            opacity: friendChatOpacity,
          }}
        >
          <View style={styles.tabContainer}>
            <Image
              style={{
                width: RFValue(40),
                height: RFValue(40),
                borderRadius: win.width / 2,
                backgroundColor: Colors.DCDCDC,
              }}
            />
            <Text style={styles.tabText}>name</Text>
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
            <Image
              style={{
                width: RFValue(40),
                height: RFValue(40),
                borderRadius: win.width / 2,
                backgroundColor: Colors.DCDCDC,
              }}
            />
            <Text style={styles.tabText}>name</Text>
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
            <Image
              style={{
                width: RFValue(40),
                height: RFValue(40),
                borderRadius: win.width / 2,
                backgroundColor: Colors.DCDCDC,
              }}
            />
            <Text style={styles.tabText}>name</Text>
            <View style={styles.checkBoxContainer}>
              <Checkbox
                color={Colors.E6DADE}
                uncheckedColor={Colors.E6DADE}
                status={checked ? "checked" : "unchecked"}
                onPress={() => onCheckedChanged(!checked)}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  tabText: {
    fontSize: RFValue(12),
    marginLeft: widthPercentageToDP("5%"),
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: heightPercentageToDP("1.5%"),
  },
  checkBoxContainer: {
    position: "absolute",
    right: 0,
    alignSelf: "center",
  },
  nextIcon: {
    width: win.width / 38,
    height: 15 * ratioNext,
    position: "absolute",
    right: 0,
    marginRight: widthPercentageToDP("2%"),
  },
});
