import React, { useEffect, useState } from "react";
import { InteractionManager } from 'react-native';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  Modal,
  ScrollView,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import CheckBox from "@react-native-community/checkbox";
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Person from "../assets/icons/default_avatar.svg";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeader";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "firebase/app";
import _ from "lodash";
import { useIsFocused } from "@react-navigation/native";
import "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig.js";
import { block } from "react-native-reanimated";
import CustomAlert from "../lib/alert";
import Request from "../lib/request";
import Clipboard from "@react-native-community/clipboard";
import Spinner from "react-native-loading-spinner-overlay";
const alert = new CustomAlert();
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const chatRef = db.collection("chat");
const win = Dimensions.get("window");
let groupID = [];
let today = new Date().getDate();
let chats = [];
let lastReadDateField;
let unseenMessageCountField;
let ownUserID;
let totalUnseenMessage = 0;
let unseenObj = [];
let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let day = new Date().getDate();
let hour = new Date().getHours();
let minute = ("0" + new Date().getMinutes()).slice(-2);
let seconds = new Date().getSeconds();
const request = new Request();
let tmpChats;

let tmpCreatedAt =
  year + ":" + month + ":" + day + ":" + hour + ":" + minute + ":" + seconds;
let otherUsersID = [];
function getDate(string) {
  let items = string.split(":");
  return new Date(
    items[0],
    items[1] - 1,
    items[2],
    items[3],
    items[4],
    items[5]
  );
}

async function getDetail(ownId, data) {
  if (data.type && data.type == "group") {
    return {
      name: data.groupName,
      image: "",
    };
  }
  if (data.users.length > 2) {
    return {
      name: data.groupName,
      image: "",
    };
  }

  let users = data.users.filter((user) => {
    return user != ownId;
  });
  let snapShot = await db
    .collection("users")
    .doc(ownId)
    .collection("customers")
    .get();

  firebaseName = "";
  snapShot.forEach((docRef) => {
    if (docRef.data().displayName && docRef.id == users) {
      firebaseName = docRef.data().displayName;
    }
  });

  if (users.length > 0) {
    let user = users[0];
    user = await request.get("profiles/" + user);
    user = user.data;
    djangoName = user.nickname;
    return {
      name: firebaseName ? firebaseName : djangoName,
      image: user.image ? user.image.image : "",
    };
  }
  return {
    name: "",
    image: "",
  };
}

export default function ChatList(props) {
  let messageToForward = props.route.params.message;
  let message = props.route.params;
  let messages = props.route.params.messages;
  const isFocused = useIsFocused();
  const [show, onShowChanged] = useStateIfMounted(false);
  const [totalUnread, setTotalUnread] = useStateIfMounted(false);
  const [loaded, onLoadedChanged] = useStateIfMounted(false);
  const [chatHtml, onChatHtmlChanged] = useStateIfMounted([]);
  const [longPressObj, onLongPressObjChanged] = useStateIfMounted({});
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);
  // if (!isFocused) {
  //   onShowChanged(false);
  // }
  React.useEffect(() => {
    onShowChanged(false);
  }, [!isFocused]);
  function getUnseenMessageCount(groupID, userID) {
    let userTotalMessageReadField = "totalMessageRead_" + userID;
    let userTotalMessageReadCount;
    let totalMessageCount;
    chatRef
      .doc(groupID)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          userTotalMessageReadCount = doc.data()[userTotalMessageReadField];
          totalMessageCount = doc.data().totalMessage;
        }
      })
      .then(function () {
        chatRef.doc(groupID).update({
          [unseenMessageCountField]:
            totalMessageCount - userTotalMessageReadCount,
        });
      });
  }
  function onValueChange(tmpChats, groupID) {
    tmpChats = tmpChats.map((chat) => {
      if (chat.id == groupID) {
        if (chat.checkBoxStatus == true) {
          chat.checkBoxStatus = false;
        } else {
          chat.checkBoxStatus = true;
        }
      }
      return chat;
    });
    chats = tmpChats
    processChat(tmpChats, ownUserID);
  }
  async function forwardMessage() {
    onSpinnerChanged(true);
    for(j=0;j<chats.length; j++){
      let chat = chats[j];
      if (chat.checkBoxStatus == true) {
        let createdAt =
          year +
          ":" +
          month +
          ":" +
          day +
          ":" +
          hour +
          ":" +
          minute +
          ":" +
          seconds;

        if(messageToForward){
          let field = {
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: messageToForward,
            userID: String(ownUserID),
            createdAt: createdAt,
          }
          if(message["contactID"]){
            field['contactID'] = message["contactID"]
          }
          if(message["contactName"]){
            field['contactName'] = message["contactName"]
          }
          if(message["image"]){
            field['image'] = message["image"]
          }

          db.collection("chat")
            .doc(chat.id)
            .collection("messages")
            .add(field)
            .then(function () {
              onSpinnerChanged(false);
              props.navigation.goBack();
            }).catch(()=>{
              onSpinnerChanged(false);
              props.navigation.goBack();
            })
        } else if(messages){
          const batch = db.batch();
          for(i=0; i<messages.length; i++){
            let message = messages[i];

            let field = {
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
              message: message["message"],
              userID: String(ownUserID),
              createdAt: createdAt,
            }
            if(message["contactID"]){
              field['contactID'] = message["contactID"]
            }
            if(message["contactName"]){
              field['contactName'] = message["contactName"]
            }
            if(message["image"]){
              field['image'] = message["image"]
            }
            let newDoc = db.collection("chat")
              .doc(chat.id)
              .collection("messages")
              .doc();
            batch.set(newDoc, field);
          }
          batch.commit().then(()=>{
            onSpinnerChanged(false);
            props.navigation.goBack();
          }).catch((error)=>{
            onSpinnerChanged(false);
            props.navigation.goBack();
          })
        }
      }
    }

  }
  function processChat(tmpChats, ownUserID) {
    let tmpChatHtml = [];
    lastReadDateField = "lastReadDate_" + ownUserID;
    unseenMessageCountField = "unseenMessageCount_" + ownUserID;
    let unreadMessage = 0;

    tmpChats = tmpChats.filter((chat) => {
      return !chat["delete_" + ownUserID] && !chat["hide_" + ownUserID];
    });
    tmpChats.map((chat) => {
      if (
        chat.data["totalMessageRead_" + ownUserID] < chat.data["totalMessage"]
      ) {
        unreadMessage++;
      }

      totalUnseenMessage = 0;
      totalUnseenMessage =
        chat.data[unseenMessageCountField] + totalUnseenMessage;
      unseenObj[chat.id] = totalUnseenMessage;
      let tmpGroupID = groupID.filter((item) => {
        return item == chat.id;
      });
      if (tmpGroupID.length >= 1) {
        for (var i = 0; i < tmpChatHtml.length; i++) {
          if (tmpChatHtml[i].key == chat.id) {
            tmpChatHtml.splice(i, 1); //find poisition delete
          }
        }
        tmpChatHtml = _.without(tmpChatHtml, chat.id);
      }
      getUnseenMessageCount(chat.id, ownUserID);
      let date = chat.data.lastMessageTime
        ? chat.data.lastMessageTime.split(":")
        : tmpCreatedAt.split(":");
      let tmpMonth = date[1];
      let tmpDay = date[2]; //message created at
      let tmpHours = date[3];
      let tmpMinutes = date[4];
      lastReadDate = chat.data[lastReadDateField];

      name = chat.name;
      image = chat.image;
      if (tmpDay == today && chat.data.totalMessage > 0) {
        tmpChatHtml.unshift(
          <TouchableWithoutFeedback
            key={chat.id}
            date={
              chat.data.lastMessageTime
                ? chat.data.lastMessageTime
                : tmpCreatedAt
            }
            pinned={chat.data["pinned_" + ownUserID] ? true : false}
            hide={chat.data["hide_" + ownUserID] ? true : false}
            delete={chat.data["delete_" + ownUserID] ? true : false}
          >
            <View style={styles.tabContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.tabImage} />
              ) : (
                <Person style={styles.tabImage} />
              )}
              <View style={styles.descriptionContainer}>
                <Text style={styles.tabText}>{name}</Text>
                <Text style={styles.tabText}>{chat.data.lastMessage.substring(0,30)}{chat.data.lastMessage.length > 30 ? "..." : ""}</Text>
              </View>
              <View style={styles.tabRightContainer}>
                <CheckBox
                  color={Colors.E6DADE}
                  uncheckedColor={Colors.E6DADE}
                  disabled={false}
                  onValueChange={() => onValueChange(tmpChats, chat.id)}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      } else if (tmpDay == today - 1 && chat.data.totalMessage > 0) {
        tmpChatHtml.unshift(
          <TouchableWithoutFeedback
            key={chat.id}
            date={
              chat.data.lastMessageTime
                ? chat.data.lastMessageTime
                : tmpCreatedAt
            }
            pinned={chat.data["pinned_" + ownUserID] ? true : false}
            hide={chat.data["hide_" + ownUserID] ? true : false}
            delete={chat.data["delete_" + ownUserID] ? true : false}
          >
            <View style={styles.tabContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.tabImage} />
              ) : (
                <Person style={styles.tabImage} />
              )}
              <View style={styles.descriptionContainer}>
                <Text style={styles.tabText}>{name}</Text>
                <Text style={styles.tabText}>{chat.data.lastMessage.substring(0,30)}{chat.data.lastMessage.length > 30 ? "..." : ""}</Text>
              </View>
              <View style={styles.tabRightContainer}>
                <CheckBox
                  color={Colors.E6DADE}
                  uncheckedColor={Colors.E6DADE}
                  disabled={false}
                  onValueChange={() => onValueChange(tmpChats, chat.id)}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      } else if (chat.data.totalMessage > 0) {
        tmpChatHtml.unshift(
          <TouchableWithoutFeedback
            key={chat.id}
            date={
              chat.data.lastMessageTime
                ? chat.data.lastMessageTime
                : tmpCreatedAt
            }
            pinned={chat.data["pinned_" + ownUserID] ? true : false}
            hide={chat.data["hide_" + ownUserID] ? true : false}
            delete={chat.data["delete_" + ownUserID] ? true : false}
          >
            <View style={styles.tabContainer}>
              {/*console.log(chat)*/}
              {image ? (
                <Image source={{ uri: image }} style={styles.tabImage} />
              ) : (
                <Person style={styles.tabImage} />
              )}
              <View style={styles.descriptionContainer}>
                <Text style={styles.tabText}>{name}</Text>
                <Text style={styles.tabText}>{chat.data.lastMessage.substring(0,30)}{chat.data.lastMessage.length > 30 ? "..." : ""}</Text>
              </View>
              <View style={styles.tabRightContainer}>
                <CheckBox
                  color={Colors.E6DADE}
                  uncheckedColor={Colors.E6DADE}
                  disabled={false}
                  onValueChange={() => onValueChange(tmpChats, chat.id)}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      }
      groupID.push(chat.id);
      totalUnseenMessage = 0;
      for (var i in unseenObj) {
        totalUnseenMessage += unseenObj[i];
      }
      tmpChatHtml.sort((html1, html2) => {
        if (html1.props["pinned"] && !html2.props["pinned"]) {
          return 1;
        }

        if (!html1.props["pinned"] && html2.props["pinned"]) {
          return -1;
        }

        if (html1.props["pinned"] && html2.props["pinned"]) {
          let date1 = getDate(html1.props["date"]);
          let date2 = getDate(html2.props["date"]);

          if (date1 > date2) {
            return -1;
          }
          if (date1 < date2) {
            return 1;
          }
        }

        if (!html1.props["pinned"] && !html2.props["pinned"]) {
          let date1 = getDate(html1.props["date"]);
          let date2 = getDate(html2.props["date"]);

          if (date1 > date2) {
            return -1;
          }
          if (date1 < date2) {
            return 1;
          }
        }
        return 0;
      });
      const resultChatHtml = tmpChatHtml.filter((html) => {
        return !html.props["hide"] && !html.props["delete"];
      });
      onChatHtmlChanged(resultChatHtml);
    });
    setTotalUnread(unreadMessage);
  }
  async function firstLoad() {
    let url = await AsyncStorage.getItem("user");
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    // onChatHtmlChanged([]);
    ownUserID = urls[urls.length - 1];
    const unsubscribe = chatRef
      .where("users", "array-contains", String(ownUserID))
      .onSnapshot((querySnapShot) => {
        querySnapShot.forEach((snapShot) => {
          if (snapShot && snapShot.exists) {
            tmpChats = chats.filter((chat) => {
              return chat.id == snapShot.id;
            });
            if (tmpChats.length == 0) {
              getDetail(ownUserID, snapShot.data()).then(function (detail) {
                chats.push({
                  id: snapShot.id,
                  data: snapShot.data(),
                  name: detail.name,
                  image: detail.image,
                  checkBoxStatus: false,
                });
                processChat(chats, ownUserID);
              });
            } else {
              chats = chats.map((chat) => {
                if (chat.id == snapShot.id) {
                  chat.data = snapShot.data();
                }
                return chat;
              });
              processChat(chats, ownUserID);
            }
          }
        });
      });
    return unsubscribe;
  }

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem("chat").then((item) => {
        if (item) {
          AsyncStorage.removeItem("chat");
          item = JSON.parse(item);
          props.navigation.push("ChatScreen", item);
        }
      });

      let unsubscribe;
      chats = [];
      firstLoad().then((unsub) => {
        unsubscribe = unsub;
      });

      return function () {
        chats = [];
        onChatHtmlChanged([]);
        if (unsubscribe) {
          unsubscribe();
        }
      };
    });
  }, [isFocused]);
  return (
    <TouchableWithoutFeedback onPress={() => onShowChanged(false)}>
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner
          visible={spinner}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
        <CustomHeader
          text={Translate.t("chat")}
          onPress={() => props.navigation.navigate("Cart")}
          onBack={() => props.navigation.goBack()}
          onFavoriteChanged="noFavorite"
        />
        <ScrollView>
          <View
            style={{
              marginHorizontal: widthPercentageToDP("4%"),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                // backgroundColor: "orange",
                paddingBottom: heightPercentageToDP("3%"),
                marginTop: heightPercentageToDP("3%"),
                height: heightPercentageToDP("5%"),
              }}
            >
              <TouchableWithoutFeedback onPress={() => forwardMessage()}>
                <Text
                  style={{
                    fontSize: RFValue(12),
                    right: 0,
                    position: "absolute",
                  }}
                >
                  {Translate.t("forward")}
                </Text>
              </TouchableWithoutFeedback>
            </View>
            {chatHtml}
          </View>
        </ScrollView>
        <View style={show == true ? styles.popUp : styles.none}>
          <View
            style={{
              zIndex: 1,
              borderWidth: 1,
              backgroundColor: "white",
              alignSelf: "center",
              marginTop: heightPercentageToDP("30%"),
              borderColor: Colors.D7CCA6,
              alignItems: "flex-start",
              paddingLeft: widthPercentageToDP("5%"),
              paddingRight: widthPercentageToDP("25%"),
            }}
          >
            <View
              style={{
                marginTop: heightPercentageToDP("3%"),
              }}
            >
              <Text style={{ fontSize: RFValue(14) }}>
                {longPressObj ? longPressObj.name : ""}
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
                    let update = {};
                    update["pinned_" + ownUserID] =
                      longPressObj.data["pinned_" + ownUserID] == "" ||
                      longPressObj.data["pinned_" + ownUserID]
                        ? false
                        : true;
                    db.collection("chat").doc(longPressObj.id).set(update, {
                      merge: true,
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
                    let update = {};
                    update["notify_" + ownUserID] =
                      longPressObj.data["notify_" + ownUserID] == "" ||
                      longPressObj.data["notify_" + ownUserID]
                        ? false
                        : true;
                    db.collection("chat").doc(longPressObj.id).set(update, {
                      merge: true,
                    });
                    onShowChanged(false);
                  }}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("notification")} OFF
                  </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => {
                    let update = {};
                    update["hide_" + ownUserID] =
                      longPressObj.data["hide_" + ownUserID] == "" ||
                      longPressObj.data["hide_" + ownUserID]
                        ? false
                        : true;
                    db.collection("chat").doc(longPressObj.id).set(update, {
                      merge: true,
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
                    let update = {};
                    update["delete_" + ownUserID] =
                      longPressObj.data["delete_" + ownUserID] == "" ||
                      longPressObj.data["delete_" + ownUserID] == false;
                    longPressObj.data["delete_" + ownUserID] ? false : true;
                    db.collection("chat").doc(longPressObj.id).set(update, {
                      merge: true,
                    });
                    onShowChanged(false);
                  }}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("remove")}
                  </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  // onPressIn={() => onShowChanged(false)}
                  onPress={() => {
                    onShowChanged(false);
                    let tmpUsers = longPressObj.data.users.filter((user) => {
                      return user != ownUserID;
                    });
                    AsyncStorage.setItem("ids", JSON.stringify(tmpUsers)).then(
                      () => {
                        AsyncStorage.setItem(
                          "tmpIds",
                          JSON.stringify(tmpUsers)
                        ).then(() => {
                          props.navigation.navigate("GroupChatCreation");
                        });
                      }
                    );
                  }}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("groupChatCreate")}
                  </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  // onPressIn={() => onShowChanged(false)}
                  onPress={() => {
                    onShowChanged(false);
                    let tmpUsers = longPressObj.data.users.filter((user) => {
                      return user != ownUserID;
                    });
                    AsyncStorage.setItem("ids", JSON.stringify(tmpUsers)).then(
                      () => {
                        AsyncStorage.setItem(
                          "tmpIds",
                          JSON.stringify(tmpUsers)
                        ).then(() => {
                          props.navigation.navigate("CreateFolder");
                        });
                      }
                    );
                  }}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("createFolder")}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  none: {
    display: "none",
  },
  popUp: {
    position: "absolute",
    zIndex: 100,
    borderWidth: 1,
    alignSelf: "center",
    width: widthPercentageToDP("100%"),
    height: heightPercentageToDP("100%"),
    borderColor: Colors.D7CCA6,
    alignItems: "flex-start",
  },
  tabRightContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    position: "absolute",
    right: 0,
  },
  notificationNumberText: {
    fontSize: RFValue(12),
    color: "white",
  },
  notificationNumberContainer: {
    borderRadius: win.width / 2,
    width: RFValue(25),
    height: RFValue(25),
    backgroundColor: Colors.BC9747,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    marginRight: widthPercentageToDP("3%"),
  },
  tabText: {
    fontSize: RFValue(12),
  },
  descriptionContainer: {
    justifyContent: "center",
    marginLeft: widthPercentageToDP("3%"),
  },
  tabContainer: {
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.F0EEE9,
    paddingVertical: heightPercentageToDP("1%"),
  },
  tabImage: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: win.width / 2,
    backgroundColor: Colors.DCDCDC,
  },
  longPressText: {
    fontSize: RFValue(12),
  },
});
