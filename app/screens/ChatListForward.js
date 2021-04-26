import React, { useEffect, useState } from "react";
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
import _ from "lodash";
import firestore from '@react-native-firebase/firestore'
import Request from "../lib/request";
import Spinner from "react-native-loading-spinner-overlay";
const db = firestore();
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
  snapShot.docs.map((docRef) => {
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
let selected = []

export default function ChatListForward(props) {
  let messageToForward = props.route.params.message;
  let message = props.route.params;
  let messages = props.route.params.messages;
  let groupId = props.route.params.groupID;
  let groupName = props.route.params.groupName;
  let groupType = props.route.params.type;
  // const isFocused = useIsFocused();
  // const [show, onShowChanged] = useStateIfMounted(false);
  const [totalUnread, setTotalUnread] = useStateIfMounted(false);
  // const [loaded, onLoadedChanged] = useStateIfMounted(false);
  const [chatHtml, onChatHtmlChanged] = useStateIfMounted([]);
  // const [longPressObj, onLongPressObjChanged] = useStateIfMounted({});
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);
  // if (!isFocused) {
  //   onShowChanged(false);
  // }
  // React.useEffect(() => {
  //   onShowChanged(false);
  // }, [!isFocused]);
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
          selected = selected.filter(el => el.id != chat.id)
          chat.checkBoxStatus = false;
        } else {
          chat.checkBoxStatus = true;
          let isInSelected = selected.find(el => el.id == chat.id)
          !isInSelected && selected.push(chat)
        }
      }
      return chat;
    });
    chats = tmpChats
    processChat(tmpChats, ownUserID);
  }

  const sendMsg = async (message, chatId) => {
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

    let field = {
      timeStamp: firestore.FieldValue.serverTimestamp(),
      message: message?.message || messageToForward,
      userID: String(ownUserID),
      createdAt: createdAt,
    }
    if (message["contactID"]) {
      field['contactID'] = message["contactID"]
    }
    if (message["contactName"]) {
      field['contactName'] = message["contactName"]
    }
    if (message["image"]) {
      field['image'] = message["image"]
    }

    try {
      await db.collection("chat")
        .doc(chatId)
        .collection("messages")
        .add(field)

      return 0

    } catch (error) {
      console.log('====================================');
      console.log('chat error', error);
      console.log('====================================');
      return 1
    }
  }

  async function forwardMessage() {
    console.time('chat')
    onSpinnerChanged(true);
    let waitAll = selected.map(chat => {
      if (messageToForward) {
        return sendMsg(messageToForward, chat.id)
      } else if (messages) {
        return messages.map((message) => {
          return sendMsg(message, chat.id)
        })
      }
    })

    Promise.all(waitAll).then(rs => {
      console.timeEnd('chat')
      onSpinnerChanged(false);
      props.navigation.goBack();
      props.navigation.navigate("ChatScreen", {
        type: groupType,
        groupID: groupId,
        groupName: groupName,
      })
    })

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
                <Text style={styles.tabText}>{chat.data.lastMessage.substring(0, 30)}{chat.data.lastMessage.length > 30 ? "..." : ""}</Text>
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
                <Text style={styles.tabText}>{chat.data.lastMessage.substring(0, 30)}{chat.data.lastMessage.length > 30 ? "..." : ""}</Text>
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
                <Text style={styles.tabText}>{chat.data.lastMessage.substring(0, 30)}{chat.data.lastMessage.length > 30 ? "..." : ""}</Text>
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
        const waitEachSnapshot = querySnapShot.docs.map((snapShot) => {
          return new Promise(resolve => {
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
                  resolve(1)
                  // processChat(chats, ownUserID);
                });
              } else {
                chats = chats.map((chat) => {
                  if (chat.id == snapShot.id) {
                    chat.data = snapShot.data();
                  }
                  return chat;
                });
                resolve(1)
                // processChat(chats, ownUserID);
              }
            } else {
              resolve(0)
            }
          })
        });

        Promise.all(waitEachSnapshot).then(rs => {
          processChat(chats, ownUserID);
        })

      });
    return unsubscribe;
  }

  React.useEffect(() => {
    // InteractionManager.runAfterInteractions(() => {
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
      selected = [];
      onChatHtmlChanged([]);
      if (unsubscribe) {
        unsubscribe();
      }
    };
    // });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Spinner
        visible={spinner}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <CustomHeader
        text={Translate.t("chat")}
        onPress={() => props.navigation.navigate("Cart")}
        onBack={() => {
          props.navigation.navigate("ChatScreen", {
            type: groupType,
            groupID: groupId,
            groupName: groupName,
          })
        }}
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
    </SafeAreaView>
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
