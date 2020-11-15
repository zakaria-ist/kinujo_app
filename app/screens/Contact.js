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
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";

import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";

const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioSearchIcon = win.width / 19 / 19;
const ratioFolderIcon = win.width / 10 / 31;
const ratioUpIcon = win.width / 20 / 14;
const ratioFolderTabIcon = win.width / 23 / 11;
const ratioNextIcon = win.width / 36 / 8;
const ratioCustomerList = win.width / 10 / 26;
const ratioProfile = win.width / 13 / 22;
const ratioDown = win.width / 30 / 8;
let userId;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default function Contact(props) {
  function redirectToChat(friendID, friendName) {
    let groupID;
    let groupName;
    db.collection("chat")
      .where("users", "array-contains", userId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docChanges().forEach((snapShot) => {
          let users = snapShot.doc.data().users;
          for (var i = 0; i < users.length; i++) {
            if (users[i] == friendID) {
              groupID = snapShot.doc.id;
              groupName = snapShot.doc.data().groupName;
            }
          }
        });
        if (groupID != null) {
          props.navigation.navigate("ChatScreen", {
            groupID: groupID,
            groupName: groupName,
          });
        } else {
          let ownMessageUnseenField = "unseenMessageCount_" + userId;
          let friendMessageUnseenField = "unseenMessageCount_" + friendID;
          let ownTotalMessageReadField = "totalMessageRead_" + ownUserID;
          let friendTotalMessageReadField = "totalMessageRead_" + chatPersonID;
          db.collection("chat")
            .add({
              groupName: friendName,
              users: [userId, friendID],
              totalMessage: 0,
              [ownMessageUnseenField]: 0,
              [friendMessageUnseenField]: 0,
              [ownTotalMessageReadField]: 0,
              [friendTotalMessageReadField]: 0,
            })
            .then(function() {
              navigateToChatScreen(friendID);
            });
        }
      });
  }
  function navigateToChatScreen(friendID) {
    let groupID;
    let groupName;
    db.collection("chat")
      .where("users", "array-contains", userId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docChanges().forEach((snapShot) => {
          let users = snapShot.doc.data().users;
          for (var i = 0; i < users.length; i++) {
            if (users[i] == friendID) {
              groupID = snapShot.doc.id;
              groupName = snapShot.doc.data().groupName;
            }
          }
          if (groupID != null) {
            props.navigation.navigate("ChatScreen", {
              groupID: groupID,
              groupName: groupName,
            });
          }
        });
      });
  }
  function processUserHtml(props, users) {
    let tmpUserHtml = [];
    users.map((user) => {
      tmpUserHtml.push(
        <TouchableWithoutFeedback
          onLongPress={() => onShowChanged(true)}
          key={user.id}
          onPress={() => {
            redirectToChat(
              user.id,
              user.real_name ? user.real_name : user.nickname
            );
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
            <Text style={styles.tabLeftText}>
              {user.real_name ? user.real_name : user.nickname}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    });
    return tmpUserHtml;
  }
  const [folderTabsShow, onFolderTabShowChaned] = React.useState(true);
  const [groupTabShow, onGroupTabShowChaned] = React.useState(true);
  const [friendTabShow, onFriendTabShowChaned] = React.useState(true);
  const [userHtml, onUserHtmlChanged] = React.useState(<View></View>);
  const [loaded, onLoaded] = React.useState(false);
  const [user, onUserChanged] = React.useState({});
  const [show, onShowChanged] = React.useState(false);
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

  React.useEffect(() => {
    AsyncStorage.getItem("user").then(function(url) {
      request
        .get(url)
        .then(function(response) {
          onUserChanged(response.data);
        })
        .catch(function(error) {
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
          let ids = [];
          let items = [];
          querySnapshot.forEach((documentSnapshot) => {
            let item = documentSnapshot.data();
            if (item.type == "user") {
              ids.push(item.id);
            }
          });
          request
            .get("user/byIds/", {
              ids: ids,
            })
            .then(function(response) {
              onUserHtmlChanged(processUserHtml(props, response.data.users));
            })
            .catch(function(error) {
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

  return (
    <TouchableWithoutFeedback onPress={() => onShowChanged(false)}>
      <SafeAreaView>
        <CustomHeader
          text="連絡先"
          onFavoritePress={() => props.navigation.navigate("Favorite")}
          onPress={() => props.navigation.navigate("Cart")}
        />
        <CustomSecondaryHeader
          name={user.real_name ? user.real_name : user.nickname}
          accountType={user.is_seller ? Translate.t("storeAccount") : ""}
        />
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
          <View style={show == true ? styles.popUp : styles.none}>
            <View
              style={{
                marginTop: heightPercentageToDP("3%"),
              }}
            >
              <Text style={{ fontSize: RFValue(14) }}>髪長友子</Text>
              <View
                style={{
                  marginTop: heightPercentageToDP("2%"),
                  justifyContent: "space-evenly",
                  height: heightPercentageToDP("35%"),
                }}
              >
                <Text style={styles.longPressText}>上部固定（or解除）</Text>
                <Text style={styles.longPressText}>通知OFF</Text>
                <Text style={styles.longPressText}>非表示</Text>
                <Text style={styles.longPressText}>削除</Text>
                <TouchableWithoutFeedback
                  onPressIn={() => onShowChanged(false)}
                  onPress={() => props.navigation.navigate("GroupChatCreation")}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("groupChatCreate")}
                  </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPressIn={() => onShowChanged(false)}
                  onPress={() => props.navigation.navigate("CreateFolder")}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("createFolder")}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
          <View>
            {/* <TouchableWithoutFeedback
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
          </TouchableWithoutFeedback> */}
            {/* <Animated.View
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
          </Animated.View> */}
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.F0EEE9,
                justifyContent: "center",
              }}
            >
              {/* <View style={styles.contactTabContainer}>
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
            </View> */}
              {userHtml}
            </View>
          </View>

          {/* <Animated.View
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
        </Animated.View> */}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  none: {
    display: "none",
  },
  popUp: {
    position: "absolute",
    zIndex: 1,
    borderWidth: 1,
    backgroundColor: "white",
    alignSelf: "center",
    marginTop: heightPercentageToDP("15%"),
    borderColor: Colors.D7CCA6,
    alignItems: "flex-start",
    paddingLeft: widthPercentageToDP("5%"),
    paddingRight: widthPercentageToDP("25%"),
  },
});
