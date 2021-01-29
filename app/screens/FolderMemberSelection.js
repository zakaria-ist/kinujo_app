import React, { useRef } from "react";
import { InteractionManager } from 'react-native';
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
  ScrollView,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import { useIsFocused } from "@react-navigation/native";
import CustomHeader from "../assets/CustomComponents/CustomHeader";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
import CheckBox from "@react-native-community/checkbox";
import ArrowDownLogo from "../assets/icons/arrow_down.svg";
import NextArrow from "../assets/icons/nextArrow.svg";
import Person from "../assets/icons/default_avatar.svg";
import Search from "../assets/icons/search.svg";
let userId;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig, "kinujo");
}
let ids = [];
let tmpFriend = [];
let tmpFriendIds = [];
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
  const isFocused = useIsFocused();
  const [friendChatShow, onFriendChatShowChanged] = useStateIfMounted(true);
  const [groupChatShow, onGroupChatShowChanged] = useStateIfMounted(true);
  const [userHtml, onUserHtmlChanged] = useStateIfMounted(<View></View>);
  const [loaded, onLoaded] = useStateIfMounted(false);
  const [searchText, onSearchTextChanged] = useStateIfMounted("");
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
    InteractionManager.runAfterInteractions(() => {
      ids = [];
      let deleteIds = [];
      AsyncStorage.getItem("tmpIds").then((friendIds) => {
        if (friendIds) {
          tmpFriendIds = JSON.parse(friendIds);
        }
        AsyncStorage.getItem("user").then(function (url) {
          request.get(url);
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
                if(item.cancel || item.delete){
                  deleteIds.push(item.id);
                }
                if (item.type == "user") {
                  if (tmpFriendIds == null) {
                    ids.push(item.id);
                    items.push({
                      id: item.id,
                      checkStatus: false,
                    });
                  } else {
                    if (tmpFriendIds.includes(item.id)) {
                      ids.push(item.id);
                      items.push({
                        id: item.id,
                        checkStatus: true,
                      });
                    } else {
                      ids.push(item.id);
                      items.push({
                        id: item.id,
                        checkStatus: false,
                      });
                    }
                  }
                }
                //item to indicate checkbox status and id
              });

              tmpFriendIds.map((id) => {
                if (
                  items.filter((item) => {
                    return item.id == id;
                  }).length == 0
                ) {
                  items.push({
                    id: id,
                    checkStatus: true,
                  });
                }
              });

              ids.filter((item) => {
                console.log(item + " " + userId);
                return item != userId;
              });
              console.log(ids);
              tmpFriend = items;

              request
                .get("user/byIds/", {
                  ids: ids,
                  userId: userId,
                  type: "contact",
                })
                .then(function (response) {
                  // console.log(response.data.users.length);
                  //response = get use details from url
                  onUserHtmlChanged(
                    processUserHtml(props, response.data.users.filter((user) => {
                      return !deleteIds.includes(user.id) && user.id != userId;
                    }), tmpFriend)
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
                      error.response.data[
                        Object.keys(error.response.data)[0]
                      ][0] +
                        "(" +
                        Object.keys(error.response.data)[0] +
                        ")"
                    );
                  }
                });
            });
          onLoaded(true);

          tmpFriendIds.map((id) => {});
        });
      });
    });

    if(!isFocused){
      onUserHtmlChanged(<View></View>)
    }
  }, [isFocused]);
  function onValueChange(friendID) {
    let found = false;
    tmpFriend = tmpFriend.map((friend) => {
      if (friendID == friend.id) {
        found = true;
        if (friend.checkStatus == true) {
          friend.checkStatus = false;
        } else {
          friend.checkStatus = true;
        }
      }
      return friend;
    });

    if (!found) {
      tmpFriend.push({
        id: friendID,
        checkStatus: true,
      });
      // console.log(tmpFriend);
    }
    onUserHtmlChanged(
      processUserHtml(props, users, tmpFriend)
    );
  }
  function onUpdate(ids, items) {
    request
      .get("user/byIds/", {
        ids: ids,
        userId: userId,
        type: "contact",
      })
      .then(function (response) {
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
      // console.log("###" + userId);
      let item = friendMaps.filter((tmp) => {
        // console.log("$$$" + tmp.id);
        return tmp.id == user.id && tmp.id != userId;
      });
      if (item.length > 0) {
        item = item[0];
      } else {
        item = null;
      }
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
              {user && user.image && user.image.image ? (
                <Image
                  style={{
                    width: RFValue(40),
                    height: RFValue(40),
                    borderRadius: win.width / 2,
                    backgroundColor: Colors.DCDCDC,
                  }}
                  source={{ uri: user.image.image }}
                />
              ) : (
                // <Image
                //   style={{
                //     width: RFValue(40),
                //     height: RFValue(40),
                //     borderRadius: win.width / 2,
                //     backgroundColor: Colors.DCDCDC,
                //   }}
                // />
                <Person
                  style={{
                    width: RFValue(40),
                    height: RFValue(40),
                    borderRadius: win.width / 2,
                    // backgroundColor: Colors.DCDCDC,
                  }}
                />
              )}

              <Text style={styles.tabText}>{user.nickname}</Text>
              <View style={styles.checkBoxContainer}>
                <CheckBox
                  color={Colors.E6DADE}
                  uncheckedColor={Colors.E6DADE}
                  disabled={false}
                  value={item ? item.checkStatus : false}
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
    // console.log(tmpFriend);
    tmpFriend.map((friend) => {
      if (friend.checkStatus == true) {
        selectedId.push(String(friend.id));
      }
    });
    AsyncStorage.setItem("ids", JSON.stringify(selectedId)).then(() => {
      props.navigation.goBack();
    });
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
      <ScrollView>
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
            <Search
              style={styles.searchIcon}
              // source={require("../assets/Images/searchIcon.png")}
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
              <ArrowDownLogo style={styles.nextIcon} />
            ) : (
              <NextArrow style={styles.nextIcon} />
            )}
          </View>
        </TouchableWithoutFeedback> */}
{/*
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
              // paddingTop: heightPercentageToDP("2%"),
              alignItems: "center",
              borderBottomWidth: 1,
              borderColor: Colors.F0EEE9,
              // paddingBottom: heightPercentageToDP("2%"),
              paddingVertical: heightPercentageToDP("2%"),
              marginTop: heightPercentageToDP("1.5%"),
              // backgroundColor: "orange",
            }}
          >
            <Person
              style={{
                width: win.width / 13,
                height: ratioProfile * 25,
                marginLeft: widthPercentageToDP("1%"),
              }}
              // source={require("../assets/Images/profileEditingIcon.png")}
            />
            <Text style={styles.tabText}> {Translate.t("friend")}</Text>
            {friendChatShow == true ? (
              <ArrowDownLogo style={styles.nextIcon} />
            ) : (
              <NextArrow style={styles.nextIcon} />
            )}
          </View>
        </TouchableWithoutFeedback>
        <View>
          <View style={{ marginBottom: heightPercentageToDP("70%") }}>
            {userHtml}
          </View>
        </View>
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
      </ScrollView>
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
    height: heightPercentageToDP("6%"),
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
    marginHorizontal: widthPercentageToDP("3%"),
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
    // width: win.width / 38,
    // height: 15 * ratioNext,
    width: RFValue(15),
    height: RFValue(15),
    position: "absolute",
    right: 0,
    marginRight: widthPercentageToDP("3%"),

    // paddingTop: heightPercentageToDP("2%"),
  },
});
