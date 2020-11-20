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
const ratioProfile = win.width / 13 / 22;
let userId;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

function getID(url) {
  let urls = url.split("/");
  urls = urls.filter((url) => {
    return url;
  });
  userId = urls[urls.length - 1];
  return userId;
}
function addFriend(firstUserId, secondUserId) {
  firestore()
    .collection("users")
    .doc(firstUserId)
    .collection("friends")
    .where("id", "==", secondUserId)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.size > 0) {
      } else {
        db.collection("users").doc(firstUserId).collection("friends").add({
          type: "user",
          id: secondUserId,
        });
      }
    });
}
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
            .then(function () {
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
          onLongPress={() => {
            onLongPressObjChanged(user);
            onShowChanged(true);
          }}
          key={user.id}
          onPress={() => {
            redirectToChat(user.id, user.nickname);
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
            <Text style={styles.tabLeftText}>{user.nickname}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    });
    return tmpUserHtml;
  }
  const [userHtml, onUserHtmlChanged] = React.useState(<View></View>);
  const [loaded, onLoaded] = React.useState(false);
  const [user, onUserChanged] = React.useState({});
  const [show, onShowChanged] = React.useState(false);
  const [longPressObj, onLongPressObjChanged] = React.useState({});
  const [searchText, onSearchTextChanged] = React.useState("");
  React.useEffect(() => {
    AsyncStorage.getItem("user").then(function (url) {
      let userId = getID(url);
      request
        .get(url)
        .then(function (response) {
          onUserChanged(response.data);
          if (response.data.introducer) {
            let introducerId = getID(response.data.introducer);
            addFriend(userId, introducerId);
          }
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
            .then(function (response) {
              onUserHtmlChanged(processUserHtml(props, response.data.users));
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

  return (
    <TouchableWithoutFeedback onPress={() => onShowChanged(false)}>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          text={Translate.t("contact")}
          onFavoritePress={() => props.navigation.navigate("Favorite")}
          onPress={() => props.navigation.navigate("Cart")}
        />
        <CustomSecondaryHeader
          name={user.nickname}
          accountType={user.is_seller ? Translate.t("storeAccount") : ""}
        />
        <View style={{ marginHorizontal: widthPercentageToDP("4%") }}>
          <View style={styles.searchInputContainer}>
            <TouchableWithoutFeedback
              onPress={() => props.navigation.navigate("ContactSearch")}
            >
              <TextInput
                placeholder={Translate.t("search")}
                placeholderTextColor={Colors.grey}
                style={styles.searchContactInput}
              ></TextInput>
            </TouchableWithoutFeedback>
            <Image
              style={styles.searchIcon}
              source={require("../assets/Images/searchIcon.png")}
            />
          </View>
          {console.log(show)}
          <View style={show == true ? styles.popUp : styles.none}>
            <View
              style={{
                marginTop: heightPercentageToDP("3%"),
              }}
            >
              <Text style={{ fontSize: RFValue(14) }}>
                {longPressObj.real_name
                  ? longPressObj.real_name
                  : longPressObj.nickname}
              </Text>
              <View
                style={{
                  marginTop: heightPercentageToDP("2%"),
                  justifyContent: "space-evenly",
                  height: heightPercentageToDP("35%"),
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    db.collection("users")
                      .doc(String(user.id))
                      .collection("friends")
                      .where("id", "==", String(longPressObj.id))
                      .get()
                      .then((querySnapshot) => {
                        if (querySnapshot.size > 0) {
                          querySnapshot.forEach((documentSnapshot) => {
                            db.collection("users")
                              .doc(String(user.id))
                              .collection("friends")
                              .doc(documentSnapshot.id)
                              .set(
                                {
                                  pinned:
                                    longPressObj["pinned"] == "" ||
                                    longPressObj["pinned"]
                                      ? false
                                      : true,
                                },
                                {
                                  merge: true,
                                }
                              );
                          });
                        }
                      });
                    onShowChanged(false);
                  }}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("upperFixed")}
                  </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => {
                    db.collection("users")
                      .doc(String(user.id))
                      .collection("friends")
                      .where("id", "==", String(longPressObj.id))
                      .get()
                      .then((querySnapshot) => {
                        if (querySnapshot.size > 0) {
                          querySnapshot.forEach((documentSnapshot) => {
                            db.collection("users")
                              .doc(String(user.id))
                              .collection("friends")
                              .doc(documentSnapshot.id)
                              .set(
                                {
                                  notify:
                                    longPressObj["notify"] == "" ||
                                    longPressObj["notify"]
                                      ? false
                                      : true,
                                },
                                {
                                  merge: true,
                                }
                              );
                          });
                        }
                      });
                    onShowChanged(false);
                  }}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("notification")}OFF
                  </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => {
                    db.collection("users")
                      .doc(String(user.id))
                      .collection("friends")
                      .where("id", "==", String(longPressObj.id))
                      .get()
                      .then((querySnapshot) => {
                        if (querySnapshot.size > 0) {
                          querySnapshot.forEach((documentSnapshot) => {
                            db.collection("users")
                              .doc(String(user.id))
                              .collection("friends")
                              .doc(documentSnapshot.id)
                              .set(
                                {
                                  hide:
                                    longPressObj["hide"] == "" ||
                                    longPressObj["hide"]
                                      ? false
                                      : true,
                                },
                                {
                                  merge: true,
                                }
                              );
                          });
                        }
                      });
                    onShowChanged(false);
                  }}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("nonRepresent")}
                  </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => {
                    db.collection("users")
                      .doc(String(user.id))
                      .collection("friends")
                      .where("id", "==", String(longPressObj.id))
                      .get()
                      .then((querySnapshot) => {
                        if (querySnapshot.size > 0) {
                          querySnapshot.forEach((documentSnapshot) => {
                            db.collection("users")
                              .doc(String(user.id))
                              .collection("friends")
                              .doc(documentSnapshot.id)
                              .set(
                                {
                                  delete:
                                    longPressObj["delete"] == "" ||
                                    longPressObj["delete"]
                                      ? false
                                      : true,
                                },
                                {
                                  merge: true,
                                }
                              );
                          });
                        }
                      });
                    onShowChanged(false);
                  }}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("remove")}
                  </Text>
                </TouchableWithoutFeedback>
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
