import React, { useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
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
const ratioFolderIcon = win.width / 10 / 31;
const ratioUpIcon = win.width / 20 / 14;
const ratioFolderTabIcon = win.width / 23 / 11;
const ratioNextIcon = win.width / 36 / 8;
const ratioCustomerList = win.width / 10 / 26;
const ratioProfile = win.width / 13 / 22;
const ratioDown = win.width / 30 / 8;

export default function Contact(props) {
  const [folderTabsShow, onFolderTabShowChaned] = React.useState(true);
  const [groupTabShow, onGroupTabShowChaned] = React.useState(true);
  const [friendTabShow, onFriendTabShowChaned] = React.useState(true);
  const folderTabOpacity = useRef(
    new Animated.Value(heightPercentageToDP("100%"))
  ).current;
  const groupTabOpacity = useRef(
    new Animated.Value(heightPercentageToDP("100%"))
  ).current;
  const friendTabOpacity = useRef(
    new Animated.Value(heightPercentageToDP("100%"))
  ).current;
  const folderTabHeight = useRef(
    new Animated.Value(heightPercentageToDP("25%"))
  ).current;
  const groupTabHeight = useRef(new Animated.Value(heightPercentageToDP("25%")))
    .current;
  const friendTabHeight = useRef(
    new Animated.Value(heightPercentageToDP("25%"))
  ).current;
  return (
    <SafeAreaView>
      <CustomHeader
        text="連絡先"
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => props.navigation.navigate("Cart")}
      />
      <CustomSecondaryHeader name="髪長絹子 さん" />
      <View style={{ marginHorizontal: widthPercentageToDP("4%") }}>
        <View style={styles.searchInputContainer}>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate("ContactSearch")}
          >
            <TextInput
              placeholder="検索"
              placeholderTextColor={Colors.grey}
              style={styles.searchContactInput}
            ></TextInput>
          </TouchableWithoutFeedback>
          <Image
            style={styles.searchIcon}
            source={require("../assets/Images/searchIcon.png")}
          />
        </View>

        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              folderTabsShow == true
                ? Animated.parallel([
                    Animated.timing(folderTabHeight, {
                      toValue: heightPercentageToDP("0%"),
                      duration: 500,
                      useNativeDriver: false,
                    }),
                    Animated.timing(folderTabOpacity, {
                      toValue: heightPercentageToDP("0%"),
                      duration: 100,
                      useNativeDriver: false,
                    }),
                  ]).start(() => {}, onFolderTabShowChaned(false))
                : Animated.parallel([
                    Animated.timing(folderTabHeight, {
                      toValue: heightPercentageToDP("25%"),
                      duration: 500,
                      useNativeDriver: false,
                    }),
                    Animated.timing(folderTabOpacity, {
                      toValue: heightPercentageToDP("100%"),
                      duration: 100,
                      useNativeDriver: false,
                    }),
                  ]).start(() => {}, onFolderTabShowChaned(true));
            }}
          >
            <View>
              <View style={styles.contactTabContainer}>
                <Image
                  style={{
                    width: win.width / 10,
                    height: ratioFolderIcon * 23,
                  }}
                  source={require("../assets/Images/folderIcon.png")}
                />
                <Text style={styles.tabLeftText}>フォルダ</Text>
                <View style={styles.tabRightContainer}>
                  {folderTabsShow == true ? (
                    <Image
                      style={{
                        width: win.width / 20,
                        height: ratioUpIcon * 8,
                        position: "absolute",
                        right: 0,
                      }}
                      source={require("../assets/Images/upIcon.png")}
                    />
                  ) : (
                    <Image
                      style={{
                        width: win.width / 30,
                        height: ratioDown * 8,
                        position: "absolute",
                        marginRight: widthPercentageToDP("1.5%"),
                        right: 0,
                      }}
                      source={require("../assets/Images/downForMoreIcon.png")}
                    />
                  )}
                  <Text style={styles.tabRightText}>100</Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <Animated.View
            style={{
              justifyContent: "center",
              height: folderTabHeight,
              opacity: folderTabOpacity,
            }}
          >
            <View style={styles.contactTabContainer}>
              <Image
                style={{
                  marginLeft: widthPercentageToDP("5%"),
                  width: win.width / 23,
                  height: ratioFolderTabIcon * 13,
                }}
                source={require("../assets/Images/folderTabIcon.png")}
              />
              <Text style={styles.tabLeftText}>仕事</Text>
              <View style={styles.tabRightContainer}>
                <Image
                  style={{
                    width: win.width / 36,
                    height: ratioNextIcon * 15,
                    position: "absolute",
                    right: 0,
                  }}
                  source={require("../assets/Images/next.png")}
                />
                <Text style={styles.tabRightText}>100</Text>
              </View>
            </View>

            <View style={styles.contactTabContainer}>
              <Image
                style={{
                  marginLeft: widthPercentageToDP("5%"),
                  width: win.width / 23,
                  height: ratioFolderTabIcon * 13,
                }}
                source={require("../assets/Images/folderTabIcon.png")}
              />
              <Text style={styles.tabLeftText}>家族</Text>
              <View style={styles.tabRightContainer}>
                <Image
                  style={{
                    width: win.width / 36,
                    height: ratioNextIcon * 15,
                    position: "absolute",
                    right: 0,
                  }}
                  source={require("../assets/Images/next.png")}
                />
                <Text style={styles.tabRightText}>100</Text>
              </View>
            </View>

            <View style={styles.contactTabContainer}>
              <Image
                style={{
                  marginLeft: widthPercentageToDP("5%"),
                  width: win.width / 23,
                  height: ratioFolderTabIcon * 13,
                }}
                source={require("../assets/Images/folderTabIcon.png")}
              />
              <Text style={styles.tabLeftText}>同級生</Text>
              <View style={styles.tabRightContainer}>
                <Image
                  style={{
                    width: win.width / 36,
                    height: ratioNextIcon * 15,
                    position: "absolute",
                    right: 0,
                  }}
                  source={require("../assets/Images/next.png")}
                />
                <Text style={styles.tabRightText}>100</Text>
              </View>
            </View>
          </Animated.View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.F0EEE9,
              justifyContent: "center",
            }}
          >
            <View style={styles.contactTabContainer}>
              <Image
                style={{
                  width: win.width / 10,
                  height: ratioCustomerList * 24,
                }}
                source={require("../assets/Images/customerListIcon.png")}
              />
              <Text style={styles.tabLeftText}>グルチャ</Text>
              <View style={styles.tabRightContainer}>
                <Image
                  style={{
                    width: win.width / 20,
                    height: ratioUpIcon * 8,
                    position: "absolute",
                    right: 0,
                  }}
                  source={require("../assets/Images/upIcon.png")}
                />
                <Text style={styles.tabRightText}>100</Text>
              </View>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                friendTabShow == true
                  ? Animated.parallel([
                      Animated.timing(friendTabHeight, {
                        toValue: heightPercentageToDP("0%"),
                        duration: 500,
                        useNativeDriver: false,
                      }),
                      Animated.timing(friendTabOpacity, {
                        toValue: heightPercentageToDP("0%"),
                        duration: 100,
                        useNativeDriver: false,
                      }),
                    ]).start(() => {}, onFriendTabShowChaned(false))
                  : Animated.parallel([
                      Animated.timing(friendTabHeight, {
                        toValue: heightPercentageToDP("25%"),
                        duration: 500,
                        useNativeDriver: false,
                      }),
                      Animated.timing(friendTabOpacity, {
                        toValue: heightPercentageToDP("100%"),
                        duration: 100,
                        useNativeDriver: false,
                      }),
                    ]).start(() => {}, onFriendTabShowChaned(true));
              }}
            >
              <View style={styles.contactTabContainer}>
                <Image
                  style={{
                    width: win.width / 13,
                    height: ratioProfile * 25,
                    marginLeft: widthPercentageToDP("1%"),
                  }}
                  source={require("../assets/Images/profileEditingIcon.png")}
                />
                <Text style={styles.tabLeftText}>友だち</Text>
                <View style={styles.tabRightContainer}>
                  {friendTabShow == true ? (
                    <Image
                      style={{
                        width: win.width / 20,
                        height: ratioUpIcon * 8,
                        position: "absolute",
                        right: 0,
                      }}
                      source={require("../assets/Images/upIcon.png")}
                    />
                  ) : (
                    <Image
                      style={{
                        width: win.width / 30,
                        height: ratioDown * 8,
                        position: "absolute",
                        marginRight: widthPercentageToDP("1.5%"),
                        right: 0,
                      }}
                      source={require("../assets/Images/downForMoreIcon.png")}
                    />
                  )}

                  <Text style={styles.tabRightText}>100</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <Animated.View
          style={{ height: friendTabHeight, opacity: friendTabOpacity }}
        >
          <View
            style={{
              marginTop: heightPercentageToDP("3%"),
              flexDirection: "row",
              alignItems: "center",
              height: friendTabHeight,
              opacity: friendTabOpacity,
            }}
          >
            <Image
              style={{
                width: RFValue(35),
                height: RFValue(35),
                borderRadius: win.width / 2,
              }}
              source={require("../assets/Images/profileEditingIcon.png")}
            />
            <Text
              style={{
                fontSize: RFValue(12),
                marginLeft: widthPercentageToDP("5%"),
              }}
            >
              name
            </Text>
          </View>
          <View
            style={{
              marginTop: heightPercentageToDP("3%"),
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: RFValue(35),
                height: RFValue(35),
                borderRadius: win.width / 2,
              }}
              source={require("../assets/Images/profileEditingIcon.png")}
            />
            <Text
              style={{
                fontSize: RFValue(12),
                marginLeft: widthPercentageToDP("5%"),
              }}
            >
              name
            </Text>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contactTabContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: heightPercentageToDP("3%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.F0EEE9,
    paddingBottom: heightPercentageToDP("2%"),
  },
  tabRightContainer: {
    flexDirection: "row-reverse",
    position: "absolute",
    right: 0,
    justifyContent: "flex-end",
    width: widthPercentageToDP("18%"),
    alignItems: "center",
  },
  tabLeftText: {
    fontSize: RFValue(12),
    marginLeft: widthPercentageToDP("5%"),
  },
  tabRightText: {
    fontSize: RFValue(12),
    marginRight: widthPercentageToDP("5%"),
  },
  searchContactInput: {
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
  searchInputContainer: {
    marginTop: heightPercentageToDP("1.5%"),
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: Colors.F6F6F6,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: win.width / 2,
    height: heightPercentageToDP("4%"),
  },
});
