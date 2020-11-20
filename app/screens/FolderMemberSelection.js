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
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
import CheckBox from "@react-native-community/checkbox";
import ArrowDownLogo from "../assets/icons/arrow_down.svg";
let userId;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
let checkStatus;
let ids = [];
let tmpFriend = [];
const db = firebase.firestore();
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioSearchIcon = win.width / 19 / 19;
const ratioCustomerList = win.width / 10 / 26;
const ratioProfile = win.width / 13 / 22;
const ratioDown = win.width / 32 / 8;
const ratioNext = win.width / 38 / 8;
export default function FolderMemberSelection(props) {
  const [checked, onCheckedChanged] = React.useState(false);
  const [groupChatShow, onGroupChatShowChanged] = React.useState(true);
  const [friendChatShow, onFriendChatShowChanged] = React.useState(true);
  const [userHtml, onUserHtmlChanged] = React.useState(<View></View>);
  const [user, onUserChanged] = React.useState({});
  const [loaded, onLoaded] = React.useState(false);
  const [searchText, onSearchTextChanged] = React.useState("");
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
  React.useEffect(() => {
    AsyncStorage.getItem("user").then(function (url) {
      request
        .get(url)
        .then(function (response) {
          onUserChanged(response.data);
        })
        .catch(function (error) {
          if (
            error &&
            error.response &&
            error.response.data &&
            Object.keys(error.response.data).length > 0
          ) {
            alert.warning(
              error.response.data[Object.keys(error.response.data)[0]][0] +
                "(" +
                Object.keys(error.response.data)[0] +
                ")"
            );
          }
        });

      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      userId = urls[urls.length - 1];
      db.collection("users")
        .doc(userId)
        .collection("friends")
        .get()
        .then((querySnapshot) => {
          let items = [];
          querySnapshot.forEach((documentSnapshot) => {
            let item = documentSnapshot.data();
            if (item.type == "user") {
              ids.push(item.id); //push user id as array
              items.push({
                id: item.id,
                checkStatus: checked,
              });
            }
            tmpFriend = items;
            //item to indicate checkbox status and id
          });
          request
            .get("user/byIds/", {
              ids: ids,
            })
            .then(function (response) {
              //response = get use details from url
              onUserHtmlChanged(
                processUserHtml(props, response.data.users, tmpFriend)
              );
            })
            .catch(function (error) {
              if (
                error &&
                error.response &&
                error.response.data &&
                Object.keys(error.response.data).length > 0
              ) {
                alert.warning(
                  error.response.data[Object.keys(error.response.data)[0]][0] +
                    "(" +
                    Object.keys(error.response.data)[0] +
                    ")"
                );
              }
            });
        });
      onLoaded(true);
    });
  }, []);
  function onValueChange(friendID) {
    tmpFriend = tmpFriend.map((friend) => {
      if (friendID == friend.id) {
        if (friend.checkStatus == true) {
          friend.checkStatus = false;
        } else {
          friend.checkStatus = true;
        }
      }
      return friend;
    });
    onUpdate(ids, tmpFriend);
  }
  function onUpdate(ids, items) {
    request
      .get("user/byIds/", {
        ids: ids,
      })
      .then(function (response) {
        onUserHtmlChanged(
          processUserHtml(props, response.data.users, tmpFriend)
        );
      })
      .catch(function (error) {
        if (
          error &&
          error.response &&
          error.response.data &&
          Object.keys(error.response.data).length > 0
        ) {
          alert.warning(
            error.response.data[Object.keys(error.response.data)[0]][0] +
              "(" +
              Object.keys(error.response.data)[0] +
              ")"
          );
        }
      });
  }
  function processUserHtml(props, users, friendMaps) {
    let tmpUserHtml = [];
    users.map((user) => {
      let item = friendMaps.filter((tmp) => {
        return tmp.id == user.id;
      });
      item = item[0];
      tmpUserHtml.push(
        <TouchableWithoutFeedback
          key={user.id}
          onPress={() => {
            onSearchTextChanged("");
          }}
        >
          <Animated.View
            style={{
              marginTop: heightPercentageToDP(".5%"),
              marginLeft: widthPercentageToDP("1%"),
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
              <Text style={styles.tabText}>{user.nickname}</Text>
              <View style={styles.checkBoxContainer}>
                <CheckBox
                  color={Colors.E6DADE}
                  uncheckedColor={Colors.E6DADE}
                  disabled={false}
                  value={item.checkStatus}
                  onValueChange={() => onValueChange(user.id)}
                />
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      );
    });
    return tmpUserHtml;
  }
  function finishSelect() {
    let selectedId = [];
    tmpFriend.map((friend) => {
      if (friend.checkStatus == true) {
        selectedId.push(friend.id);
      }
    });
    AsyncStorage.setItem("ids", JSON.stringify(selectedId));
    props.navigation.pop();
  }
  return (
    <SafeAreaView>
      <CustomHeader
        text={Translate.t("folderMemberSelection")}
        onPress={() => props.navigation.navigate("Cart")}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
      />
      <TouchableWithoutFeedback onPress={() => finishSelect()}>
        <View
          style={{
            height: heightPercentageToDP("5%"),
            justifyContent: "center",
            marginLeft: widthPercentageToDP("75%"),
          }}
        >
          <Text
            style={{
              fontSize: RFValue(12),
              right: 0,
              position: "absolute",
              marginRight: widthPercentageToDP("8%"),
            }}
          >
            {Translate.t("next")}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <View
        style={{
          marginHorizontal: widthPercentageToDP("4%"),
          justifyContent: "flex-start",
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
              placeholder={Translate.t("search")}
              placeholderTextColor={Colors.grey}
              style={styles.searchInput}
            ></TextInput>
            <Image
              style={styles.searchIcon}
              source={require("../assets/Images/searchIcon.png")}
            />
          </View>
        </View>
        {/* <TouchableWithoutFeedback
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
        </Animated.View> */}
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
              <ArrowDownLogo
                width={widthPercentageToDP("5%")}
                height={heightPercentageToDP("100%")}
                resizeMode="contain"
                position="absolute"
                right={0}
                marginRight={widthPercentageToDP("3%")}
              />
            ) : (
              <Image
                style={styles.nextIcon}
                source={require("../assets/Images/next.png")}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
        {userHtml}
        {/* <Animated.View
          style={{
            marginTop: heightPercentageToDP(".5%"),
            marginLeft: widthPercentageToDP("1%"),
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
        </Animated.View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchInputContainer: {
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: Colors.F6F6F6,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: win.width / 2,
    height: heightPercentageToDP("5%"),
  },
  searchInput: {
    fontSize: RFValue(11),
    paddingLeft: widthPercentageToDP("5%"),
    paddingRight: widthPercentageToDP("15%"),
    flex: 1,
  },
  searchIcon: {
    width: win.width / 19,
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