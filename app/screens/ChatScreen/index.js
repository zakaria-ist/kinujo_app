import React, { useEffect, useState, useRef } from "react";
import { InteractionManager } from 'react-native';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Switch,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Animated,
  Modal,
  ScrollView,
  Keyboard,
  SafeAreaView,
  PixelRatio,
  FlatList
} from "react-native";

import Spinner from "react-native-loading-spinner-overlay";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import { Colors } from "../../assets/Colors.js";
import { useIsFocused } from "@react-navigation/native";
import GroupImages from "../../assets/CustomComponents/GroupImages";
import RNFetchBlob from "rn-fetch-blob";
import { LinearGradient } from "expo-linear-gradient";
import EmojiBoard from "react-native-emoji-board";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../../assets/Translates/Translate";
import ImagePicker from "react-native-image-picker";
import { RFValue } from "react-native-responsive-fontsize";
import AndroidKeyboardAdjust from "react-native-android-keyboard-adjust";
import CustomHeader from "../../assets/CustomComponents/ChatCustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../../assets/CustomComponents/CustomSecondaryHeader";
import CustomSelectHeader from "../../assets/CustomComponents/ChatSelectHeader";
import ChatText from "../ChatText";
import ChatContact from "../ChatContact";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../../../firebaseConfig.js";
import ArrowDownLogo from "../../assets/icons/arrow_down.svg";
import PlusCircleLogo from "../../assets/icons/plus_circle.svg";
import EmojiLogo from "../../assets/icons/emoji.svg";
import SendLogo from "../../assets/icons/send.svg";
import CameraLogo from "../../assets/icons/camera.svg";
import GalleryLogo from "../../assets/icons/gallery.svg";
import ContactLogo from "../../assets/icons/contact.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import _, { sample } from "lodash";
import Request from "../../lib/request";
import CustomAlert from "../../lib/alert";
import storage from "@react-native-firebase/storage";
import Clipboard from "@react-native-community/clipboard";
import moment from 'moment-timezone';
import * as Localization from "expo-localization";
import FooterChat from "./FooterChat.js";
const alert = new CustomAlert();
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const win = Dimensions.get("window");
var uuid = require("react-native-uuid");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
if (Platform.OS === "android") {
  AndroidKeyboardAdjust.setAdjustResize();
}
const db = firebase.firestore();
const chatsRef = db.collection("chat");
const request = new Request();
let userId;
let groupID;
let groupName;
let userTotalReadMessageField;
let totalMessageCount = 0;
let tmpChatHtml = [];
let messageID = [];
let tmpMessageCount = 0;
let previousMessageDateToday;
let previousMessageDateYesterday;
let previousMessageDateElse;
let smallestSeenCount = 0;
let seenMessageCount = [];
let updateFriend = false;
let unsubscribe;
let unsubscribe1;
let finalGroupName;
let chatPersonID;
let chats = [];
let old30Chats = [];
let oldChats = [];
let totalMessageRead = 0;
let totalMessage = 0;
let allUsers = [];
let imageMap = {};
let selects = [];
let day = new Date().getDate();
let tmpMultiSelect = false;
let lastDoc = null;
let old30LastDoc = null;
let isUserBlocked = false;
function checkUpdateFriend(user1, user2) {
  if (!updateFriend && user1 && user2 && user1 != user2) {
    db.collection("users")
      .doc(user1)
      .collection("friends")
      .where("id", "==", user2)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
        } else {
          request.addFriend(user1, user2);
        }
      });
    updateFriend = true;
  }
}
function getTime() {
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let day = new Date().getDate();
  let hour = String(new Date().getHours()).padStart(2, "0");
  let minute = ("0" + new Date().getMinutes()).slice(-2);
  let seconds = new Date().getSeconds();
  return (
    year + ":" + month + ":" + day + ":" + hour + ":" + minute + ":" + seconds
  );
}
export default function ChatScreen(props) {
  const [shouldShow, setShouldShow] = useStateIfMounted(false);
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);
  const [secretMode, setSecretMode] = useStateIfMounted(false);
  const [showPopUp, onShowPopUpChanged] = useStateIfMounted(false);
  const [loaded, onLoadedChanged] = useStateIfMounted(false);
  const [newChats, setChats] = useStateIfMounted([]);
  const [chatHtml, onChatHtmlChanged] = useStateIfMounted([]);
  const [old30ChatHtml, onOld30ChatHtmlChanged] = useStateIfMounted([]);
  const [oldChatHtml, onOldChatHtmlChanged] = useStateIfMounted([]);
  const [messages, setMessages] = useStateIfMounted("");
  const [showEmoji, onShowEmojiChanged] = useStateIfMounted(false);
  const [prevEmoji, setPrevEmoji] = useStateIfMounted("");
  const [showCheckBox, onShowCheckBoxChanged] = useStateIfMounted(false);
  const [users, onUserChanged] = useStateIfMounted("");
  const [userUrl, onUserUrlChanged] = useStateIfMounted("group");
  const [images, setImages] = useStateIfMounted([]);
  const [friendImage, onFriendImageChanged] = useStateIfMounted("");
  const [copiedText, setCopiedText] = useStateIfMounted("");
  const [multiSelect, setMultiSelect] = useStateIfMounted(false);
  // const [user, processUser] = useStateIfMounted("");
  const [inputBarPosition, setInputBarPosition] = useStateIfMounted(0);
  const scrollViewReference = useRef();
  const isFocused = useIsFocused();
  groupID = props.route.params.groupID;
  groupName = props.route.params.groupName;
  groupType = props.route.params.type;
  const [longPressObj, onLongPressObjChanged] = useStateIfMounted({});
  const [name, onNameChanged] = useStateIfMounted("");
  const insets = useSafeAreaInsets();
  const myTimeZone = Localization.timezone;


  function findParams(data, param) {
    let tmps = data.split("?");
    if (tmps.length > 0) {
      let tmp = tmps[1];
      let params = tmp.split("&");
      let searchParams = params.filter((tmpParam) => {
        return tmpParam.indexOf(param) >= 0;
      });
      if (searchParams.length > 0) {
        let foundParam = searchParams[0];
        let foundParams = foundParam.split("=");
        if (foundParams.length > 0) {
          return foundParams[1];
        }
      }
    }
    return "";
  }

  React.useEffect(() => {
    hideEmoji();
    setMultiSelect(false);
    tmpMultiSelect = false;
    selects = []
    setChats([]);
  }, [!isFocused]);
  function redirectToChat(contactID, contactName) {
    AsyncStorage.getItem("user").then((url) => {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      userId = urls[urls.length - 1];

      let groupId;
      // let groupName;
      let deleted = "delete_" + userId;
      db.collection("chat")
        .where("users", "array-contains", userId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.docChanges().forEach((snapShot) => {
            if (
              snapShot.doc.data().type != "groups" &&
              snapShot.doc.data().users.length == 2
            ) {
              let users = snapShot.doc.data().users;
              for (var i = 0; i < users.length; i++) {
                if (users[i] == contactID) {
                  groupId = snapShot.doc.id;
                }
              }
            }
          });
          if (groupId != null) {
            db.collection("chat")
              .doc(groupId)
              .set(
                {
                  [deleted]: false,
                },
                {
                  merge: true,
                }
              );
            AsyncStorage.setItem(
              "chat",
              JSON.stringify({
                groupID: groupId,
                groupName: contactName,
              })
            ).then(() => {
              props.navigation.goBack();
            });
          } else {
            let ownMessageUnseenField = "unseenMessageCount_" + userId;
            let friendMessageUnseenField = "unseenMessageCount_" + contactID;
            let ownTotalMessageReadField = "totalMessageRead_" + userId;
            let friendTotalMessageReadField = "totalMessageRead_" + contactID;
            db.collection("chat")
              .add({
                groupName: contactName,
                users: [userId, contactID],
                totalMessage: 0,
                [ownMessageUnseenField]: 0,
                [friendMessageUnseenField]: 0,
                [ownTotalMessageReadField]: 0,
                [friendTotalMessageReadField]: 0,
              })
              .then(function (docRef) {
                AsyncStorage.setItem(
                  "chat",
                  JSON.stringify({
                    groupID: docRef.id,
                    groupName: contactName,
                  })
                ).then(() => {
                  props.navigation.goBack();
                });
              });
          }
        });
    });
  }

  async function getName(ownId, data) {
    if (data.type && data.type == "group") {
      return data.groupName;
    }
    if (data.users.length > 2) return data.groupName;
    let users = data.users.filter((user) => {
      return user != ownId;
    });
    let snapShot = await db
      .collection("users")
      .doc(ownId)
      .collection("customers")
      .get();

    tmpName = "";
    snapShot.forEach((docRef) => {
      if (docRef.data().displayName && docRef.id == users[0]) {
        tmpName = docRef.data().displayName;

        if (docRef.data().secretMode) {
          setSecretMode(true);
        }
      }
    });
    if (tmpName) return tmpName;
    if (users.length > 0) {
      let user = users[0];
      onUserUrlChanged("profiles/" + user);
      user = await request.get("profiles/" + user);
      user = user.data;

      return user.nickname;
    }
    return "";
  }

  const onClick = (emoji) => {
    {
      {
        messages == ""
          ? setMessages(emoji.code)
          : setMessages(messages + emoji.code);
      }
    }
    setPrevEmoji(emoji.code);
  };
  const onRemove = () => {
    setMessages(messages.slice(0, -2));
  };
  const [textInputHeight, setTextInputHeight] = useStateIfMounted(
    heightPercentageToDP("8%")
  );
  function handleEmojiIconPressed() {
    if (showEmoji == false) {
      onShowEmojiChanged(true);
      setInputBarPosition(heightPercentageToDP("30%"));
      scrollViewReference.current.scrollToEnd();
    } else {
      hideEmoji();
    }
    setShouldShow(false);

    Keyboard.dismiss();
  }
  function hideEmoji() {
    onShowEmojiChanged(false);
    setInputBarPosition(-2);
  }

  function selectedChat(chatId) {
    let tmpSelects = selects.filter((select) => {
      return select.id == chatId;
    });
    return tmpSelects.length > 0;
  }

  function getDate(dateString) {
    let date = dateString.split(":");
    let tmpYear = date[0];
    let tmpMonth = date[1];
    let tmpDay = date[2]; //message created at
    let tmpHours = date[3];
    let tmpMinutes = date[4];
    let tmpSeconds = date[5];

    return new Date(
      tmpYear,
      tmpMonth - 1,
      tmpDay,
      tmpHours,
      tmpMinutes,
      tmpSeconds
    );
  }

  function processOldChat(tmpChats) {
    return
    let tmpChatHtml = [];
    index = 1;
    // tmpChats = tmpChats.sort((a, b) => {

    //   return a.data.timeStamp.nanoseconds <= b.data.timeStamp.nanoseconds;
    // });
    tmpChats.map((chat) => {
      let date = chat.data.createdAt.split(":");
      let tmpMonth = date[1];
      let tmpDay = date[2]; //message created at
      let tmpHours = date[3];
      let tmpMinutes = date[4];
      let tmpMessageID = messageID.filter((item) => {
        return item == chat.id;
      });
      if (tmpDay == day) {
        tmpChatHtml.push(
          <TouchableNativeFeedback
            key={chat.id}
            delete={
              chat.data["delete_" + userId] || chat.data["delete"]
                ? true
                : false
            }
            onPress={() => {
              if (tmpMultiSelect) {
                if (selectedChat(chat.id)) {
                  selects = selects.filter((select) => {
                    return select.id != chat.id;
                  });
                } else {
                  selects.push({
                    id: chat.id,
                    message: chat.data.message,
                    contactID: chat.data.contactID,
                    contactName: chat.data.contactName,
                    image: chat.data.image
                  });
                }
                processOldChat(oldChats);
              }
            }}
            onLongPress={() => {
              onLongPressObjChanged({
                id: chat.id,
                message: chat.data.message,
                data: chat.data,
                contactID: chat.data.contactID,
                contactName: chat.data.contactName,
                image: chat.data.image
              });
              onShowPopUpChanged(true);
            }}
          >
            <View
              style={
                selectedChat(chat.id) ? styles.selected : styles.non_selected
              }
              key={chat.id}
            >
              {previousMessageDateToday == null ? (
                <Text style={[styles.chat_date]}>{Translate.t("today")}</Text>
              ) : (
                <Text style={[styles.chat_date]}>{""}</Text>
              )}
              {/*///////////////////////////////////////*/}
              {chat.data.contactID ? (
                <ChatContact
                  press={() => {
                    if (!tmpMultiSelect) {
                      redirectToChat(
                        chat.data.contactID,
                        chat.data.contactName
                      );
                    } else {
                      console.log("1");
                      if (selectedChat(chat.id)) {
                        selects = selects.filter((select) => {
                          return select.id != chat.id;
                        });
                      } else {
                        selects.push({
                          id: chat.id,
                          message: chat.data.message,
                          contactID: chat.data.contactID,
                          contactName: chat.data.contactName,
                          image: chat.data.image
                        });
                      }
                      processOldChat(oldChats);
                    }
                  }}
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  showCheckBox={showCheckBox}
                  props={props}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  contactID={chat.data.contactID}
                  contactName={chat.data.contactName}
                  image={imageMap[chat.data.userID]}
                />
              ) : (
                <ChatText
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  hyperLinkClicked={(url, text)=>{
                    if(!tmpMultiSelect){
                      if(findParams(url, "apn") && findParams(url, "link")){
                        let link = decodeURIComponent(findParams(url, "link"));
                        console.log(findParams(link, "product_id"));
                        if(findParams(link, "product_id")){
                          let apiUrl = request.getApiUrl() + "products/" + findParams(link, "product_id");
                          props.navigation.navigate("HomeStoreList", {
                            url: apiUrl,
                          });
                        } else {
                          Linking.openURL(url);
                        }
                      } else {
                        Linking.openURL(url);
                      }
                    }
                  }}
                  props={props}
                  showCheckBox={showCheckBox}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  text={
                    chat.data.contactID == null && chat.data.image == null
                      ? chat.data.message
                      : ""
                  }
                  imageURL={chat.data.image ? chat.data.image : ""}
                  image={imageMap[chat.data.userID]}
                />
              )}
              {/*///////////////////////////////////////*/}
            </View>
          </TouchableNativeFeedback>
        );
        previousMessageDateToday = tmpDay;
      } else if (tmpDay == day - 1) {
        tmpChatHtml.push(
          <TouchableNativeFeedback
            key={chat.id}
            delete={
              chat.data["delete_" + userId] || chat.data["delete"]
                ? true
                : false
            }
            onPress={() => {
              if (tmpMultiSelect) {
                if (selectedChat(chat.id)) {
                  selects = selects.filter((select) => {
                    return select.id != chat.id;
                  });
                } else {
                  selects.push({
                    id: chat.id,
                    message: chat.data.message,
                    contactID: chat.data.contactID,
                    contactName: chat.data.contactName,
                    image: chat.data.image
                  });
                }
                processOldChat(oldChats);
              }
            }}
            onLongPress={() => {
              onLongPressObjChanged({
                id: chat.id,
                message: chat.data.message,
                data: chat.data,
                contactID: chat.data.contactID,
                contactName: chat.data.contactName,
                image: chat.data.image
              });
              onShowPopUpChanged(true);
            }}
          >
            <View
              style={
                selectedChat(chat.id) ? styles.selected : styles.non_selected
              }
              key={chat.id}
            >
              {previousMessageDateYesterday == null ? (
                <Text style={[styles.chat_date]}>
                  {Translate.t("yesterday")}
                </Text>
              ) : (
                <Text style={[styles.chat_date]}>{""}</Text>
              )}
              {/*///////////////////////////////////////*/}
              {chat.data.contactID ? (
                <ChatContact
                  press={() => {
                    if (!tmpMultiSelect) {
                      redirectToChat(
                        chat.data.contactID,
                        chat.data.contactName
                      );
                    } else {
                      if (selectedChat(chat.id)) {
                        selects = selects.filter((select) => {
                          return select.id != chat.id;
                        });
                      } else {
                        selects.push({
                          id: chat.id,
                          message: chat.data.message,
                          contactID: chat.data.contactID,
                          contactName: chat.data.contactName,
                          image: chat.data.image
                        });
                      }
                      processOldChat(oldChats);
                    }
                  }}
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  showCheckBox={showCheckBox}
                  props={props}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  contactID={chat.data.contactID}
                  contactName={chat.data.contactName}
                  image={imageMap[chat.data.userID]}
                />
              ) : (
                <ChatText
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  hyperLinkClicked={(url, text)=>{
                    if(!tmpMultiSelect){
                      if(findParams(url, "apn") && findParams(url, "link")){
                        let link = decodeURIComponent(findParams(url, "link"));
                        console.log(findParams(link, "product_id"));
                        if(findParams(link, "product_id")){
                          let apiUrl = request.getApiUrl() + "products/" + findParams(link, "product_id");
                          props.navigation.navigate("HomeStoreList", {
                            url: apiUrl,
                          });
                        } else {
                          Linking.openURL(url);
                        }
                      } else {
                        Linking.openURL(url);
                      }
                    }
                  }}
                  props={props}
                  showCheckBox={showCheckBox}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  text={
                    chat.data.contactID == null && chat.data.image == null
                      ? chat.data.message
                      : ""
                  }
                  imageURL={chat.data.image ? chat.data.image : ""}
                  image={imageMap[chat.data.userID]}
                />
              )}
              {/*///////////////////////////////////////*/}
            </View>
          </TouchableNativeFeedback>
        );
        previousMessageDateYesterday = tmpDay;
      } else if (tmpDay != day && tmpDay != day - 1) {
        tmpChatHtml.push(
          <TouchableNativeFeedback
            key={chat.id}
            delete={
              chat.data["delete_" + userId] || chat.data["delete"]
                ? true
                : false
            }
            onPress={() => {
              if (tmpMultiSelect) {
                if (selectedChat(chat.id)) {
                  selects = selects.filter((select) => {
                    return select.id != chat.id;
                  });
                } else {
                  selects.push({
                    id: chat.id,
                    message: chat.data.message,
                    contactID: chat.data.contactID,
                    contactName: chat.data.contactName,
                    image: chat.data.image
                  });
                }
                processOldChat(oldChats);
              }
            }}
            onLongPress={() => {
              onLongPressObjChanged({
                id: chat.id,
                message: chat.data.message,
                data: chat.data,
                contactID: chat.data.contactID,
                contactName: chat.data.contactName,
                image: chat.data.image
              });
              onShowPopUpChanged(true);
            }}
          >
            <View
              style={
                selectedChat(chat.id) ? styles.selected : styles.non_selected
              }
              key={chat.id}
            >
              {previousMessageDateElse ==
              chat.data.timeStamp.toDate().toDateString() ? (
                <Text style={[styles.chat_date]}>{""}</Text>
              ) : (
                <Text style={[styles.chat_date]}>
                  {tmpMonth + "/" + tmpDay}
                </Text>
              )}
              {/*///////////////////////////////////////*/}
              {chat.data.contactID ? (
                <ChatContact
                  press={() => {
                    if (!tmpMultiSelect) {
                      redirectToChat(
                        chat.data.contactID,
                        chat.data.contactName
                      );
                    } else {
                      if (selectedChat(chat.id)) {
                        selects = selects.filter((select) => {
                          return select.id != chat.id;
                        });
                      } else {
                        selects.push({
                          id: chat.id,
                          message: chat.data.message,
                          contactID: chat.data.contactID,
                          contactName: chat.data.contactName,
                          image: chat.data.image
                        });
                      }
                      processOldChat(oldChats);
                    }
                  }}
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  showCheckBox={showCheckBox}
                  props={props}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  contactID={chat.data.contactID}
                  contactName={chat.data.contactName}
                  image={imageMap[chat.data.userID]}
                />
              ) : (
                <ChatText
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  hyperLinkClicked={(url, text)=>{
                    if(!tmpMultiSelect){
                      if(findParams(url, "apn") && findParams(url, "link")){
                        let link = decodeURIComponent(findParams(url, "link"));
                        console.log(findParams(link, "product_id"));
                        if(findParams(link, "product_id")){
                          let apiUrl = request.getApiUrl() + "products/" + findParams(link, "product_id");
                          props.navigation.navigate("HomeStoreList", {
                            url: apiUrl,
                          });
                        } else {
                          Linking.openURL(url);
                        }
                      } else {
                        Linking.openURL(url);
                      }
                    }
                  }}
                  props={props}
                  showCheckBox={showCheckBox}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  text={
                    chat.data.contactID == null && chat.data.image == null
                      ? chat.data.message
                      : ""
                  }
                  imageURL={chat.data.image ? chat.data.image : ""}
                  image={imageMap[chat.data.userID]}
                />
              )}
              {/*///////////////////////////////////////*/}
            </View>
          </TouchableNativeFeedback>
        );

        previousMessageDateElse = chat.data.timeStamp.toDate().toDateString();
      }
    });
    const resultChatHtml = tmpChatHtml.filter((html) => {
      return !html.props["delete"];
    });
    onOldChatHtmlChanged(resultChatHtml);
    index++;
  }

  function processOld30Chat(tmpChats) {
    return;
    let tmpChatHtml = [];
    index = 1;
    // tmpChats = tmpChats.sort((a, b) => {

    //   return a.data.timeStamp.nanoseconds <= b.data.timeStamp.nanoseconds;
    // });
    tmpChats.map((chat) => {
      let date = chat.data.createdAt.split(":");
      let tmpMonth = date[1];
      let tmpDay = date[2]; //message created at
      let tmpHours = date[3];
      let tmpMinutes = date[4];
      let tmpMessageID = messageID.filter((item) => {
        return item == chat.id;
      });
      if (tmpDay == day) {
        tmpChatHtml.push(
          <TouchableNativeFeedback
            key={chat.id}
            delete={
              chat.data["delete_" + userId] || chat.data["delete"]
                ? true
                : false
            }
            onPress={() => {
              if (tmpMultiSelect) {
                if (selectedChat(chat.id)) {
                  selects = selects.filter((select) => {
                    return select.id != chat.id;
                  });
                } else {
                  selects.push({
                    id: chat.id,
                    message: chat.data.message,
                    contactID: chat.data.contactID,
                    contactName: chat.data.contactName,
                    image: chat.data.image
                  });
                }
                processOld30Chat(old30Chats);
              }
            }}
            onLongPress={() => {
              onLongPressObjChanged({
                id: chat.id,
                message: chat.data.message,
                data: chat.data,
                contactID: chat.data.contactID,
                contactName: chat.data.contactName,
                image: chat.data.image
              });
              onShowPopUpChanged(true);
            }}
          >
            <View
              style={
                selectedChat(chat.id) ? styles.selected : styles.non_selected
              }
              key={chat.id}
            >
              {previousMessageDateToday == null ? (
                <Text style={[styles.chat_date]}>{Translate.t("today")}</Text>
              ) : (
                <Text style={[styles.chat_date]}>{""}</Text>
              )}
              {/*///////////////////////////////////////*/}
              {chat.data.contactID ? (
                <ChatContact
                  press={() => {
                    if (!tmpMultiSelect) {
                      redirectToChat(
                        chat.data.contactID,
                        chat.data.contactName
                      );
                    } else {
                      console.log("1");
                      if (selectedChat(chat.id)) {
                        selects = selects.filter((select) => {
                          return select.id != chat.id;
                        });
                      } else {
                        selects.push({
                          id: chat.id,
                          message: chat.data.message,
                          contactID: chat.data.contactID,
                          contactName: chat.data.contactName,
                          image: chat.data.image
                        });
                      }
                      processOld30Chat(old30Chats);
                    }
                  }}
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  showCheckBox={showCheckBox}
                  props={props}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  contactID={chat.data.contactID}
                  contactName={chat.data.contactName}
                  image={imageMap[chat.data.userID]}
                />
              ) : (
                <ChatText
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  hyperLinkClicked={(url, text)=>{
                    if(!tmpMultiSelect){
                      if(findParams(url, "apn") && findParams(url, "link")){
                        let link = decodeURIComponent(findParams(url, "link"));
                        console.log(findParams(link, "product_id"));
                        if(findParams(link, "product_id")){
                          let apiUrl = request.getApiUrl() + "products/" + findParams(link, "product_id");
                          props.navigation.navigate("HomeStoreList", {
                            url: apiUrl,
                          });
                        } else {
                          Linking.openURL(url);
                        }
                      } else {
                        Linking.openURL(url);
                      }
                    }
                  }}
                  props={props}
                  showCheckBox={showCheckBox}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  text={
                    chat.data.contactID == null && chat.data.image == null
                      ? chat.data.message
                      : ""
                  }
                  imageURL={chat.data.image ? chat.data.image : ""}
                  image={imageMap[chat.data.userID]}
                />
              )}
              {/*///////////////////////////////////////*/}
            </View>
          </TouchableNativeFeedback>
        );
        previousMessageDateToday = tmpDay;
      } else if (tmpDay == day - 1) {
        tmpChatHtml.push(
          <TouchableNativeFeedback
            key={chat.id}
            delete={
              chat.data["delete_" + userId] || chat.data["delete"]
                ? true
                : false
            }
            onPress={() => {
              if (tmpMultiSelect) {
                if (selectedChat(chat.id)) {
                  selects = selects.filter((select) => {
                    return select.id != chat.id;
                  });
                } else {
                  selects.push({
                    id: chat.id,
                    message: chat.data.message,
                    contactID: chat.data.contactID,
                    contactName: chat.data.contactName,
                    image: chat.data.image
                  });
                }
                processOld30Chat(old30Chats);
              }
            }}
            onLongPress={() => {
              onLongPressObjChanged({
                id: chat.id,
                message: chat.data.message,
                data: chat.data,
                contactID: chat.data.contactID,
                contactName: chat.data.contactName,
                image: chat.data.image
              });
              onShowPopUpChanged(true);
            }}
          >
            <View
              style={
                selectedChat(chat.id) ? styles.selected : styles.non_selected
              }
              key={chat.id}
            >
              {previousMessageDateYesterday == null ? (
                <Text style={[styles.chat_date]}>
                  {Translate.t("yesterday")}
                </Text>
              ) : (
                <Text style={[styles.chat_date]}>{""}</Text>
              )}
              {/*///////////////////////////////////////*/}
              {chat.data.contactID ? (
                <ChatContact
                  press={() => {
                    if (!tmpMultiSelect) {
                      redirectToChat(
                        chat.data.contactID,
                        chat.data.contactName
                      );
                    } else {
                      if (selectedChat(chat.id)) {
                        selects = selects.filter((select) => {
                          return select.id != chat.id;
                        });
                      } else {
                        selects.push({
                          id: chat.id,
                          message: chat.data.message,
                          contactID: chat.data.contactID,
                          contactName: chat.data.contactName,
                          image: chat.data.image
                        });
                      }
                      processOld30Chat(old30Chats);
                    }
                  }}
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  showCheckBox={showCheckBox}
                  props={props}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  contactID={chat.data.contactID}
                  contactName={chat.data.contactName}
                  image={imageMap[chat.data.userID]}
                />
              ) : (
                <ChatText
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  hyperLinkClicked={(url, text)=>{
                    if(!tmpMultiSelect){
                      if(findParams(url, "apn") && findParams(url, "link")){
                        let link = decodeURIComponent(findParams(url, "link"));
                        console.log(findParams(link, "product_id"));
                        if(findParams(link, "product_id")){
                          let apiUrl = request.getApiUrl() + "products/" + findParams(link, "product_id");
                          props.navigation.navigate("HomeStoreList", {
                            url: apiUrl,
                          });
                        } else {
                          Linking.openURL(url);
                        }
                      } else {
                        Linking.openURL(url);
                      }
                    }
                  }}
                  props={props}
                  showCheckBox={showCheckBox}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  text={
                    chat.data.contactID == null && chat.data.image == null
                      ? chat.data.message
                      : ""
                  }
                  imageURL={chat.data.image ? chat.data.image : ""}
                  image={imageMap[chat.data.userID]}
                />
              )}
              {/*///////////////////////////////////////*/}
            </View>
          </TouchableNativeFeedback>
        );
        previousMessageDateYesterday = tmpDay;
      } else if (tmpDay != day && tmpDay != day - 1) {
        tmpChatHtml.push(
          <TouchableNativeFeedback
            key={chat.id}
            delete={
              chat.data["delete_" + userId] || chat.data["delete"]
                ? true
                : false
            }
            onPress={() => {
              if (tmpMultiSelect) {
                if (selectedChat(chat.id)) {
                  selects = selects.filter((select) => {
                    return select.id != chat.id;
                  });
                } else {
                  selects.push({
                    id: chat.id,
                    message: chat.data.message,
                    contactID: chat.data.contactID,
                    contactName: chat.data.contactName,
                    image: chat.data.image
                  });
                }
                processOld30Chat(old30Chats);
              }
            }}
            onLongPress={() => {
              onLongPressObjChanged({
                id: chat.id,
                message: chat.data.message,
                data: chat.data,
                contactID: chat.data.contactID,
                contactName: chat.data.contactName,
                image: chat.data.image
              });
              onShowPopUpChanged(true);
            }}
          >
            <View
              style={
                selectedChat(chat.id) ? styles.selected : styles.non_selected
              }
              key={chat.id}
            >
              {previousMessageDateElse ==
              chat.data.timeStamp.toDate().toDateString() ? (
                <Text style={[styles.chat_date]}>{""}</Text>
              ) : (
                <Text style={[styles.chat_date]}>
                  {tmpMonth + "/" + tmpDay}
                </Text>
              )}
              {/*///////////////////////////////////////*/}
              {chat.data.contactID ? (
                <ChatContact
                  press={() => {
                    if (!tmpMultiSelect) {
                      redirectToChat(
                        chat.data.contactID,
                        chat.data.contactName
                      );
                    } else {
                      if (selectedChat(chat.id)) {
                        selects = selects.filter((select) => {
                          return select.id != chat.id;
                        });
                      } else {
                        selects.push({
                          id: chat.id,
                          message: chat.data.message,
                          contactID: chat.data.contactID,
                          contactName: chat.data.contactName,
                          image: chat.data.image
                        });
                      }
                      processOld30Chat(old30Chats);
                    }
                  }}
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  showCheckBox={showCheckBox}
                  props={props}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  contactID={chat.data.contactID}
                  contactName={chat.data.contactName}
                  image={imageMap[chat.data.userID]}
                />
              ) : (
                <ChatText
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  hyperLinkClicked={(url, text)=>{
                    if(!tmpMultiSelect){
                      if(findParams(url, "apn") && findParams(url, "link")){
                        let link = decodeURIComponent(findParams(url, "link"));
                        console.log(findParams(link, "product_id"));
                        if(findParams(link, "product_id")){
                          let apiUrl = request.getApiUrl() + "products/" + findParams(link, "product_id");
                          props.navigation.navigate("HomeStoreList", {
                            url: apiUrl,
                          });
                        } else {
                          Linking.openURL(url);
                        }
                      } else {
                        Linking.openURL(url);
                      }
                    }
                  }}
                  props={props}
                  showCheckBox={showCheckBox}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  text={
                    chat.data.contactID == null && chat.data.image == null
                      ? chat.data.message
                      : ""
                  }
                  imageURL={chat.data.image ? chat.data.image : ""}
                  image={imageMap[chat.data.userID]}
                />
              )}
              {/*///////////////////////////////////////*/}
            </View>
          </TouchableNativeFeedback>
        );

        previousMessageDateElse = chat.data.timeStamp.toDate().toDateString();
      }
    });
    const resultChatHtml = tmpChatHtml.filter((html) => {
      return !html.props["delete"];
    });
    onOld30ChatHtmlChanged(resultChatHtml);
    index++;
  }

  function processChat(tmpChats) {
    return;
    let tmpChatHtml = [];
    index = 1;
    // tmpChats = tmpChats.sort((a, b) => {

    //   return a.data.timeStamp.nanoseconds <= b.data.timeStamp.nanoseconds;
    // });
    tmpChats.map((chat) => {
      let date = chat.data.createdAt.split(":");
      let tmpMonth = date[1];
      let tmpDay = date[2]; //message created at
      let tmpHours = date[3];
      let tmpMinutes = date[4];
      let tmpMessageID = messageID.filter((item) => {
        return item == chat.id;
      });
      if (tmpDay == day) {
        tmpChatHtml.push(
          <TouchableNativeFeedback
            key={chat.id}
            delete={
              chat.data["delete_" + userId] || chat.data["delete"]
                ? true
                : false
            }
            onPress={() => {
              if (tmpMultiSelect) {
                if (selectedChat(chat.id)) {
                  selects = selects.filter((select) => {
                    return select.id != chat.id;
                  });
                } else {
                  selects.push({
                    id: chat.id,
                    message: chat.data.message,
                    contactID: chat.data.contactID,
                    contactName: chat.data.contactName,
                    image: chat.data.image
                  });
                }
                processChat(chats);
              }
            }}
            onLongPress={() => {
              onLongPressObjChanged({
                id: chat.id,
                message: chat.data.message,
                data: chat.data,
                contactID: chat.data.contactID,
                contactName: chat.data.contactName,
                image: chat.data.image
              });
              onShowPopUpChanged(true);
            }}
          >
            <View
              style={
                selectedChat(chat.id) ? styles.selected : styles.non_selected
              }
              key={chat.id}
            >
              {previousMessageDateToday == null ? (
                <Text style={[styles.chat_date]}>{Translate.t("today")}</Text>
              ) : (
                <Text style={[styles.chat_date]}>{""}</Text>
              )}
              {/*///////////////////////////////////////*/}
              {chat.data.contactID ? (
                <ChatContact
                  press={() => {
                    if (!tmpMultiSelect) {
                      redirectToChat(
                        chat.data.contactID,
                        chat.data.contactName
                      );
                    } else {
                      console.log("1");
                      if (selectedChat(chat.id)) {
                        selects = selects.filter((select) => {
                          return select.id != chat.id;
                        });
                      } else {
                        selects.push({
                          id: chat.id,
                          message: chat.data.message,
                          contactID: chat.data.contactID,
                          contactName: chat.data.contactName,
                          image: chat.data.image
                        });
                      }
                      processChat(chats);
                    }
                  }}
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  showCheckBox={showCheckBox}
                  props={props}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  contactID={chat.data.contactID}
                  contactName={chat.data.contactName}
                  image={imageMap[chat.data.userID]}
                />
              ) : (
                <ChatText
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  hyperLinkClicked={(url, text)=>{
                    if(!tmpMultiSelect){
                      if(findParams(url, "apn") && findParams(url, "link")){
                        let link = decodeURIComponent(findParams(url, "link"));
                        console.log(findParams(link, "product_id"));
                        if(findParams(link, "product_id")){
                          let apiUrl = request.getApiUrl() + "products/" + findParams(link, "product_id");
                          props.navigation.navigate("HomeStoreList", {
                            url: apiUrl,
                          });
                        } else {
                          Linking.openURL(url);
                        }
                      } else {
                        Linking.openURL(url);
                      }
                    }
                  }}
                  props={props}
                  showCheckBox={showCheckBox}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  text={
                    chat.data.contactID == null && chat.data.image == null
                      ? chat.data.message
                      : ""
                  }
                  imageURL={chat.data.image ? chat.data.image : ""}
                  image={imageMap[chat.data.userID]}
                />
              )}
              {/*///////////////////////////////////////*/}
            </View>
          </TouchableNativeFeedback>
        );
        previousMessageDateToday = tmpDay;
      } else if (tmpDay == day - 1) {
        tmpChatHtml.push(
          <TouchableNativeFeedback
            key={chat.id}
            delete={
              chat.data["delete_" + userId] || chat.data["delete"]
                ? true
                : false
            }
            onPress={() => {
              if (tmpMultiSelect) {
                if (selectedChat(chat.id)) {
                  selects = selects.filter((select) => {
                    return select.id != chat.id;
                  });
                } else {
                  selects.push({
                    id: chat.id,
                    message: chat.data.message,
                    contactID: chat.data.contactID,
                    contactName: chat.data.contactName,
                    image: chat.data.image
                  });
                }
                processChat(chats);
              }
            }}
            onLongPress={() => {
              onLongPressObjChanged({
                id: chat.id,
                message: chat.data.message,
                data: chat.data,
                contactID: chat.data.contactID,
                contactName: chat.data.contactName,
                image: chat.data.image
              });
              onShowPopUpChanged(true);
            }}
          >
            <View
              style={
                selectedChat(chat.id) ? styles.selected : styles.non_selected
              }
              key={chat.id}
            >
              {previousMessageDateYesterday == null ? (
                <Text style={[styles.chat_date]}>
                  {Translate.t("yesterday")}
                </Text>
              ) : (
                <Text style={[styles.chat_date]}>{""}</Text>
              )}
              {/*///////////////////////////////////////*/}
              {chat.data.contactID ? (
                <ChatContact
                  press={() => {
                    if (!tmpMultiSelect) {
                      redirectToChat(
                        chat.data.contactID,
                        chat.data.contactName
                      );
                    } else {
                      if (selectedChat(chat.id)) {
                        selects = selects.filter((select) => {
                          return select.id != chat.id;
                        });
                      } else {
                        selects.push({
                          id: chat.id,
                          message: chat.data.message,
                          contactID: chat.data.contactID,
                          contactName: chat.data.contactName,
                          image: chat.data.image
                        });
                      }
                      processChat(chats);
                    }
                  }}
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  showCheckBox={showCheckBox}
                  props={props}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  contactID={chat.data.contactID}
                  contactName={chat.data.contactName}
                  image={imageMap[chat.data.userID]}
                />
              ) : (
                <ChatText
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  hyperLinkClicked={(url, text)=>{
                    if(!tmpMultiSelect){
                      if(findParams(url, "apn") && findParams(url, "link")){
                        let link = decodeURIComponent(findParams(url, "link"));
                        console.log(findParams(link, "product_id"));
                        if(findParams(link, "product_id")){
                          let apiUrl = request.getApiUrl() + "products/" + findParams(link, "product_id");
                          props.navigation.navigate("HomeStoreList", {
                            url: apiUrl,
                          });
                        } else {
                          Linking.openURL(url);
                        }
                      } else {
                        Linking.openURL(url);
                      }
                    }
                  }}
                  props={props}
                  showCheckBox={showCheckBox}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  text={
                    chat.data.contactID == null && chat.data.image == null
                      ? chat.data.message
                      : ""
                  }
                  imageURL={chat.data.image ? chat.data.image : ""}
                  image={imageMap[chat.data.userID]}
                />
              )}
              {/*///////////////////////////////////////*/}
            </View>
          </TouchableNativeFeedback>
        );
        previousMessageDateYesterday = tmpDay;
      } else if (tmpDay != day && tmpDay != day - 1) {
        tmpChatHtml.push(
          <TouchableNativeFeedback
            key={chat.id}
            delete={
              chat.data["delete_" + userId] || chat.data["delete"]
                ? true
                : false
            }
            onPress={() => {
              if (tmpMultiSelect) {
                if (selectedChat(chat.id)) {
                  selects = selects.filter((select) => {
                    return select.id != chat.id;
                  });
                } else {
                  selects.push({
                    id: chat.id,
                    message: chat.data.message,
                    contactID: chat.data.contactID,
                    contactName: chat.data.contactName,
                    image: chat.data.image
                  });
                }
                processChat(chats);
              }
            }}
            onLongPress={() => {
              onLongPressObjChanged({
                id: chat.id,
                message: chat.data.message,
                data: chat.data,
                contactID: chat.data.contactID,
                contactName: chat.data.contactName,
                image: chat.data.image
              });
              onShowPopUpChanged(true);
            }}
          >
            <View
              style={
                selectedChat(chat.id) ? styles.selected : styles.non_selected
              }
              key={chat.id}
            >
              {previousMessageDateElse ==
              chat.data.timeStamp.toDate().toDateString() ? (
                <Text style={[styles.chat_date]}>{""}</Text>
              ) : (
                <Text style={[styles.chat_date]}>
                  {tmpMonth + "/" + tmpDay}
                </Text>
              )}
              {/*///////////////////////////////////////*/}
              {chat.data.contactID ? (
                <ChatContact
                  press={() => {
                    if (!tmpMultiSelect) {
                      redirectToChat(
                        chat.data.contactID,
                        chat.data.contactName
                      );
                    } else {
                      if (selectedChat(chat.id)) {
                        selects = selects.filter((select) => {
                          return select.id != chat.id;
                        });
                      } else {
                        selects.push({
                          id: chat.id,
                          message: chat.data.message,
                          contactID: chat.data.contactID,
                          contactName: chat.data.contactName,
                          image: chat.data.image
                        });
                      }
                      processChat(chats);
                    }
                  }}
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}
                  showCheckBox={showCheckBox}
                  props={props}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  contactID={chat.data.contactID}
                  contactName={chat.data.contactName}
                  image={imageMap[chat.data.userID]}
                />
              ) : (
                <ChatText
                  longPress={() => {
                    onLongPressObjChanged({
                      id: chat.id,
                      message: chat.data.message,
                      data: chat.data,
                      contactID: chat.data.contactID,
                      contactName: chat.data.contactName,
                      image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                  }}  
                  hyperLinkClicked={(url, text)=>{
                    if(!tmpMultiSelect){
                      if(findParams(url, "apn") && findParams(url, "link")){
                        let link = decodeURIComponent(findParams(url, "link"));
                        console.log(findParams(link, "product_id"));
                        if(findParams(link, "product_id")){
                          let apiUrl = request.getApiUrl() + "products/" + findParams(link, "product_id");
                          props.navigation.navigate("HomeStoreList", {
                            url: apiUrl,
                          });
                        } else {
                          Linking.openURL(url);
                        }
                      } else {
                        Linking.openURL(url);
                      }
                    }
                  }}
                  props={props}
                  showCheckBox={showCheckBox}
                  date={tmpHours + ":" + tmpMinutes}
                  isSelf={
                    chat.data.userID == userId
                      ? (isSelf = "true")
                      : (isSelf = "")
                  }
                  // seen={
                  //   totalMessage - index >= totalMessage - totalMessageRead &&
                  //   chat.data.userID == userId
                  //     ? (seen = "true")
                  //     : (seen = "")
                  // }
                  text={
                    chat.data.contactID == null && chat.data.image == null
                      ? chat.data.message
                      : ""
                  }
                  imageURL={chat.data.image ? chat.data.image : ""}
                  image={imageMap[chat.data.userID]}
                />
              )}
              {/*///////////////////////////////////////*/}
            </View>
          </TouchableNativeFeedback>
        );

        previousMessageDateElse = chat.data.timeStamp.toDate().toDateString();
      }
    });
    const resultChatHtml = tmpChatHtml.filter((html) => {
      return !html.props["delete"];
    });
    onChatHtmlChanged(resultChatHtml);
    index++;
  }

  async function updateChats(chats){
    chats = chats.map((chat) => {
      chat.first = false;

      if(selects.includes(chat.id)){
        chat.selected = true;
      }
      return chat;
    });

    //remove duplicates
    // chats = chats.filter((v, i , a)=>a.findIndex(t=>(t.id === v.id))===i)
    let last = "";
    for(let i=0; i<chats.length; i++){
      let chat = chats[i];
      let dates = chat.data.createdAt.split(":");
      let date = dates[0] + ":" + dates[1] + ":" + dates[2];
      if(date != last){
        chats[i].first = true;
        last = date;
      }
      
    }
    setChats(chats);
  }

  async function firstLoad(data) {
    chats = [];
    const updateHtml = [];
    onChatHtmlChanged(updateHtml);
    let url = await AsyncStorage.getItem("user");
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    userId = urls[urls.length - 1];

    getName(userId, data).then((name) => {
      onNameChanged(name);
    });

    userTotalReadMessageField = "totalMessageRead_" + userId;
    let documentSnapshot = await chatsRef.doc(groupID).get();
    if (documentSnapshot && documentSnapshot.data()) {
      let tmpUsers = documentSnapshot.data().users;
      tmpUsers = tmpUsers.filter((user) => {
        return user != userId;
      });

      // check if me is blocked by other party
      let blockerUser = tmpUsers;
      if (blockerUser) {
        if (blockerUser.length > 0) {
          blockerUser = blockerUser[0];
        }
        let CustSnapShots = await db
          .collection("users")
          .doc(String(blockerUser))
          .collection("customers")
          .get();
        CustSnapShots.forEach((CustSnapShot) => {
          console.log('CustSnapShot.id', CustSnapShot.id);
          if (CustSnapShot.id == String(userId)) {
            isUserBlocked = CustSnapShot.data().blockMode ? true : false;
          }
        });
        console.log('ifBlockUser Block', isUserBlocked);
      }
      if (tmpUsers.length == 1) {
        let images = await request.post("user/images", {
          users: tmpUsers,
        });
        setImages(images.data.images);
      } else {
        let images = await request.post("user/images", {
          users: documentSnapshot.data().users,
        });
        setImages(images.data.images);
      }
      if (documentSnapshot.data()["popup_addfriend_" + userId]) {
        alert.warning(Translate.t("please_add_friend"));
      }

      let users = documentSnapshot.data().users;
      if (users.length == 2) {
        checkUpdateFriend(userId, users[0]);
        checkUpdateFriend(userId, users[1]);
      }
      totalMessageCount = documentSnapshot.data().totalMessage;

      for (var i = 0; i < users.length; i++) {
        totalMessageSeenCount = "totalMessageRead_" + users[i];
        seenMessageCount.push(documentSnapshot.data()[totalMessageSeenCount]);
      }
      smallestSeenCount = seenMessageCount[0];
      for (var i = 1; i < seenMessageCount.length; i++) {
        if (smallestSeenCount > seenMessageCount[i]) {
          smallestSeenCount = seenMessageCount[i];
        }
      }

      previousMessageDateToday = null;
      previousMessageDateYesterday = null;
      previousMessageDateElse = null;
      tmpMessageCount = 0;

      // let lastQuerySnapshot = await chatsRef.doc(groupID).collection("messages").orderBy('timeStamp', "desc").limit(1).get();
      // lastQuerySnapshot.forEach((snapShot)=>{
      //   lastDoc = snapShot;
      // })

      // Read all message
      chatsRef.doc(groupID).update({
        [userTotalReadMessageField]: totalMessageCount
      })

      let build = chatsRef
        .doc(groupID)
        .collection("messages")
        .orderBy("timeStamp", "asc");
      
      // if(lastDoc){
      //   build = build.startAfter(lastDoc);
      //   chatsRef.doc(groupID).collection("messages").orderBy("timeStamp", "asc").endAt(lastDoc).get().then((querySnapShot)=>{
      //     querySnapShot.forEach((snapShot) => {
      //       if(!old30LastDoc){
      //         old30LastDoc = snapShot;
      //       }
      //       let tmpChats = old30Chats.filter((chat) => {
      //         return chat.id == snapShot.id;
      //       });
      //       if (tmpChats.length == 0) {
      //         old30Chats.push({
      //           id: snapShot.id,
      //           data: snapShot.data(),
      //         });
      //       } else {
      //         old30Chats = old30Chats.map((chat) => {
      //           if (chat.id == snapShot.id) {
      //             chat.data = snapShot.data();
      //           }
      //           return chat;
      //         });
      //       }
      //     })
      //     updateChats(oldChats.concat(old30Chats, chats))
      //   })
      // }

      this.unsub = build
        .onSnapshot(
          {
            includeMetadataChanges: false,
          },
          (querySnapShot) => {
            querySnapShot.forEach((snapShot) => {
              if (snapShot && snapShot.exists) {
                let tmpChats = chats.filter((chat) => {
                  return chat.id == snapShot.id;
                });
                if (tmpChats.length == 0) {
                  chats.push({
                    id: snapShot.id,
                    data: snapShot.data(),
                  });
                } else {
                  chats = chats.map((chat) => {
                    if (chat.id == snapShot.id) {
                      chat.data = snapShot.data();
                    }
                    return chat;
                  });
                }
              }
            });
            processChat(chats);
            updateChats(oldChats.concat(old30Chats, chats))
          }
        );

      // this.unsub1 = chatsRef.doc(groupID).onSnapshot((snapshot) => {
      //   totalMessage = snapshot.data()["totalMessageRead"];
      //   totalMessageRead = snapshot.data()["totalMessage"];
      //   processChat(chats);
      //   if (
      //     snapshot.data()["totalMessageRead_" + userId] !=
      //     snapshot.data()["totalMessage"]
      //   ) {
      //     chatsRef.doc(groupID).collection("read").add({
      //       user_id: userId,
      //     });
      //   }

      //   request
      //     .get("user/byIds/", {
      //       ids: snapshot.data()["users"],
      //     })
      //     .then((response) => {
      //       allUsers = response.data.users;
      //       allUsers.map((user) => {
      //         imageMap[user.id] = user.image ? user.image.image : "";
      //       });
      //       processChat(chats);
      //     });
      // });
      
      if(old30LastDoc){
        chatsRef.doc(groupID).collection("messages").orderBy("timeStamp", "asc").endAt(old30LastDoc).get().then((querySnapShot)=>{
          querySnapShot.forEach((snapShot) => {
            let tmpChats = oldChats.filter((chat) => {
              return chat.id == snapShot.id;
            });
            if (tmpChats.length == 0) {
              oldChats.push({
                id: snapShot.id,
                data: snapShot.data(),
              });
            } else {
              oldChats = oldChats.map((chat) => {
                if (chat.id == snapShot.id) {
                  chat.data = snapShot.data();
                }
                return chat;
              });
            }
          })
          processOldChat(oldChats);
          updateChats(oldChats.concat(old30Chats, chats))
        })
      }
    }
  }

  React.useEffect(() => {
    if (!multiSelect) {
      scrollViewReference.current.scrollToEnd({ animated: true });
    }
  }, [chatHtml]);

  React.useEffect(() => {
    if (!isFocused) {
      onNameChanged("");
      setShouldShow(false);
      processChat([]);
      processOld30Chat([]);
      processOldChat([]);
      setImages([""]);
      chats = [];
      old30Chats = [];
      if (this.unsub) {
        this.unsub();
      }
      if (this.unsub1) {
        this.unsub1();
      }
    }
    if (props.route.params.groupName) {
      onNameChanged(props.route.params.groupName);
    }

    InteractionManager.runAfterInteractions(() => {
      chatsRef
        .doc(groupID)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            if (doc.id == groupID) {
              firstLoad(doc.data());
            }
          }
        })
        .then(function () {});
      });

    return function () {
      if (this?.unsub) {
        this.unsub();
      }
      if (this?.unsub1) {
        this.unsub1();
      }
      setShouldShow(false);
      onShowPopUpChanged(false);
      onChatHtmlChanged([]);
      onOldChatHtmlChanged([]);
      onOld30ChatHtmlChanged([]);
      tmpChatHtml = [];
    };
  }, [isFocused]);

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ];

  function renderItem(item){
    let chat = item["item"];
    let created = chat.data.createdAt;
    try{
      let tStamps = chat.data.timeStamp.toDate();
      created = moment(tStamps).tz(myTimeZone).format('YYYY:MM:DD:HH:mm:ss');
    } catch(e){
      console.log('ERROR', e);
    }
    
    // let date = chat.data.createdAt.split(":");
    let date = created.split(":");
    let tmpMonth = date[1].length > 1 ? date[1] : '0' + date[1];
    let tmpDay = date[2].length > 1 ? date[2] : '0' + date[2]; //message created at
    let tmpHours = date[3].length > 1 ? date[3] : '0' + date[3];
    let tmpMinutes = date[4].length > 1 ? date[4] : '0' + date[4];
    let tmpMessageID = messageID.filter((item) => {
      return item == chat.id;
    });
    if (tmpDay == day) {
      return (
        <TouchableNativeFeedback
          key={chat.id}
          delete={
            chat.data["delete_" + userId] || chat.data["delete"]
              ? true
              : false
          }
          onPress={() => {
            if (tmpMultiSelect) {
              if (selectedChat(chat.id)) {
                selects = selects.filter((select) => {
                  return select.id != chat.id;
                });
              } else {
                selects.push({
                  id: chat.id,
                  message: chat.data.message,
                  contactID: chat.data.contactID,
                  contactName: chat.data.contactName,
                  image: chat.data.image
                });
              }
              processOldChat(oldChats);
            }
          }}
          onLongPress={() => {
            onLongPressObjChanged({
              id: chat.id,
              message: chat.data.message,
              data: chat.data,
              contactID: chat.data.contactID,
              contactName: chat.data.contactName,
              image: chat.data.image
            });
            onShowPopUpChanged(true);
          }}
        >
          <View
            style={
              selectedChat(chat.id) ? styles.selected : styles.non_selected
            }
            key={chat.id}
          >
            {chat.first ? (
              <Text style={[styles.chat_date]}>{Translate.t("today")}</Text>
            ) : (
              <Text style={[styles.chat_date]}>{""}</Text>
            )}
            {/*///////////////////////////////////////*/}
            {chat.data.contactID ? (
              <ChatContact
                press={() => {
                  if (!tmpMultiSelect) {
                    redirectToChat(
                      chat.data.contactID,
                      chat.data.contactName
                    );
                  } else {
                    console.log("1");
                    if (selectedChat(chat.id)) {
                      selects = selects.filter((select) => {
                        return select.id != chat.id;
                      });
                    } else {
                      selects.push({
                        id: chat.id,
                        message: chat.data.message,
                        contactID: chat.data.contactID,
                        contactName: chat.data.contactName,
                        image: chat.data.image
                      });
                    }
                    processOldChat(oldChats);
                  }
                }}
                longPress={() => {
                  onLongPressObjChanged({
                    id: chat.id,
                    message: chat.data.message,
                    data: chat.data,
                    contactID: chat.data.contactID,
                    contactName: chat.data.contactName,
                    image: chat.data.image
                  });
                  onShowPopUpChanged(true);
                }}
                showCheckBox={showCheckBox}
                props={props}
                date={tmpHours + ":" + tmpMinutes}
                isSelf={
                  chat.data.userID == userId
                    ? (isSelf = "true")
                    : (isSelf = "")
                }
                // seen={
                //   totalMessage - index >= totalMessage - totalMessageRead &&
                //   chat.data.userID == userId
                //     ? (seen = "true")
                //     : (seen = "")
                // }
                contactID={chat.data.contactID}
                contactName={chat.data.contactName}
                image={imageMap[chat.data.userID]}
              />
            ) : (
              <ChatText
                longPress={() => {
                  onLongPressObjChanged({
                    id: chat.id,
                    message: chat.data.message,
                    data: chat.data,
                    contactID: chat.data.contactID,
                    contactName: chat.data.contactName,
                    image: chat.data.image
                  });
                  onShowPopUpChanged(true);
                }}
                hyperLinkClicked={(url, text)=>{
                  if(!tmpMultiSelect){
                    if(findParams(url, "apn") && findParams(url, "link")){
                      let link = decodeURIComponent(findParams(url, "link"));
                      console.log(findParams(link, "product_id"));
                      if(findParams(link, "product_id")){
                        let apiUrl = request.getApiUrl() + "products/" + findParams(link, "product_id");
                        props.navigation.navigate("HomeStoreList", {
                          url: apiUrl,
                        });
                      } else {
                        Linking.openURL(url);
                      }
                    } else {
                      Linking.openURL(url);
                    }
                  }
                }}
                props={props}
                showCheckBox={showCheckBox}
                date={tmpHours + ":" + tmpMinutes}
                isSelf={
                  chat.data.userID == userId
                    ? (isSelf = "true")
                    : (isSelf = "")
                }
                // seen={
                //   totalMessage - index >= totalMessage - totalMessageRead &&
                //   chat.data.userID == userId
                //     ? (seen = "true")
                //     : (seen = "")
                // }
                text={
                  chat.data.contactID == null && chat.data.image == null
                    ? chat.data.message
                    : ""
                }
                imageURL={chat.data.image ? chat.data.image : ""}
                image={imageMap[chat.data.userID]}
              />
            )}
            {/*///////////////////////////////////////*/}
          </View>
        </TouchableNativeFeedback>
      );
      previousMessageDateToday = tmpDay;
    } else if (tmpDay == day - 1) {
      return (
        <TouchableNativeFeedback
          key={chat.id}
          delete={
            chat.data["delete_" + userId] || chat.data["delete"]
              ? true
              : false
          }
          onPress={() => {
            if (tmpMultiSelect) {
              if (selectedChat(chat.id)) {
                selects = selects.filter((select) => {
                  return select.id != chat.id;
                });
              } else {
                selects.push({
                  id: chat.id,
                  message: chat.data.message,
                  contactID: chat.data.contactID,
                  contactName: chat.data.contactName,
                  image: chat.data.image
                });
              }
              updateChats(newChats);
              processOldChat(oldChats);
            }
          }}
          onLongPress={() => {
            onLongPressObjChanged({
              id: chat.id,
              message: chat.data.message,
              data: chat.data,
              contactID: chat.data.contactID,
              contactName: chat.data.contactName,
              image: chat.data.image
            });
            onShowPopUpChanged(true);
          }}
        >
          <View
            style={
              selectedChat(chat.id) ? styles.selected : styles.non_selected
            }
            key={chat.id}
          >
            {chat.first ? (
              <Text style={[styles.chat_date]}>
                {Translate.t("yesterday")}
              </Text>
            ) : (
              <Text style={[styles.chat_date]}>{""}</Text>
            )}
            {/*///////////////////////////////////////*/}
            {chat.data.contactID ? (
              <ChatContact
                press={() => {
                  if (!tmpMultiSelect) {
                    redirectToChat(
                      chat.data.contactID,
                      chat.data.contactName
                    );
                  } else {
                    if (selectedChat(chat.id)) {
                      selects = selects.filter((select) => {
                        return select.id != chat.id;
                      });
                    } else {
                      selects.push({
                        id: chat.id,
                        message: chat.data.message,
                        contactID: chat.data.contactID,
                        contactName: chat.data.contactName,
                        image: chat.data.image
                      });
                      updateChats(newChats);
                    }
                    processOldChat(oldChats);
                  }
                }}
                longPress={() => {
                  onLongPressObjChanged({
                    id: chat.id,
                    message: chat.data.message,
                    data: chat.data,
                    contactID: chat.data.contactID,
                    contactName: chat.data.contactName,
                    image: chat.data.image
                  });
                  onShowPopUpChanged(true);
                }}
                hyperLinkClicked={(url, text)=>{
                  if(!tmpMultiSelect){
                    if(findParams(url, "apn") && findParams(url, "link")){
                      let link = decodeURIComponent(findParams(url, "link"));
                      console.log(findParams(link, "product_id"));
                      if(findParams(link, "product_id")){
                        let apiUrl = request.getApiUrl() + "products/" + findParams(link, "product_id");
                        props.navigation.navigate("HomeStoreList", {
                          url: apiUrl,
                        });
                      } else {
                        Linking.openURL(url);
                      }
                    } else {
                      Linking.openURL(url);
                    }
                  }
                }}
                showCheckBox={showCheckBox}
                props={props}
                date={tmpHours + ":" + tmpMinutes}
                isSelf={
                  chat.data.userID == userId
                    ? (isSelf = "true")
                    : (isSelf = "")
                }
                // seen={
                //   totalMessage - index >= totalMessage - totalMessageRead &&
                //   chat.data.userID == userId
                //     ? (seen = "true")
                //     : (seen = "")
                // }
                contactID={chat.data.contactID}
                contactName={chat.data.contactName}
                image={imageMap[chat.data.userID]}
              />
            ) : (
              <ChatText
                longPress={() => {
                  onLongPressObjChanged({
                    id: chat.id,
                    message: chat.data.message,
                    data: chat.data,
                    contactID: chat.data.contactID,
                    contactName: chat.data.contactName,
                    image: chat.data.image
                  });
                  onShowPopUpChanged(true);
                }}
                hyperLinkClicked={(url, text)=>{
                  if(!tmpMultiSelect){
                    if(findParams(url, "apn") && findParams(url, "link")){
                      let link = decodeURIComponent(findParams(url, "link"));
                      console.log(findParams(link, "product_id"));
                      if(findParams(link, "product_id")){
                        let apiUrl = request.getApiUrl() + "products/" + findParams(link, "product_id");
                        props.navigation.navigate("HomeStoreList", {
                          url: apiUrl,
                        });
                      } else {
                        Linking.openURL(url);
                      }
                    } else {
                      Linking.openURL(url);
                    }
                  }
                }}
                props={props}
                showCheckBox={showCheckBox}
                date={tmpHours + ":" + tmpMinutes}
                isSelf={
                  chat.data.userID == userId
                    ? (isSelf = "true")
                    : (isSelf = "")
                }
                // seen={
                //   totalMessage - index >= totalMessage - totalMessageRead &&
                //   chat.data.userID == userId
                //     ? (seen = "true")
                //     : (seen = "")
                // }
                text={
                  chat.data.contactID == null && chat.data.image == null
                    ? chat.data.message
                    : ""
                }
                imageURL={chat.data.image ? chat.data.image : ""}
                image={imageMap[chat.data.userID]}
              />
            )}
            {/*///////////////////////////////////////*/}
          </View>
        </TouchableNativeFeedback>
      );
      previousMessageDateYesterday = tmpDay;
    } else if (tmpDay != day && tmpDay != day - 1) {
      return (
        <TouchableNativeFeedback
          key={chat.id}
          delete={
            chat.data["delete_" + userId] || chat.data["delete"]
              ? true
              : false
          }
          onPress={() => {
            if (multiSelect) {
              if (selectedChat(chat.id)) {
                selects = selects.filter((select) => {
                  return select.id != chat.id;
                });
              } else {
                selects.push({
                  id: chat.id,
                  message: chat.data.message,
                  contactID: chat.data.contactID,
                  contactName: chat.data.contactName,
                  image: chat.data.image
                });
              }
              updateChats(newChats);
              onShowPopUpChanged(false);
            }
          }}
          onLongPress={() => {
            onLongPressObjChanged({
              id: chat.id,
              message: chat.data.message,
              data: chat.data,
              contactID: chat.data.contactID,
              contactName: chat.data.contactName,
              image: chat.data.image
            });
            onShowPopUpChanged(true);
          }}
        >
          <View
            style={
              selectedChat(chat.id) ? styles.selected : styles.non_selected
            }
            key={chat.id}
          >
            {!chat.first ? (
              <Text style={[styles.chat_date]}>{""}</Text>
            ) : (
              <Text style={[styles.chat_date]}>
                {tmpMonth + "/" + tmpDay}
              </Text>
            )}
            {/*///////////////////////////////////////*/}
            {chat.data.contactID ? (
              <ChatContact
                press={() => {
                  console.log("ERE");
                  if (!tmpMultiSelect) {
                    redirectToChat(
                      chat.data.contactID,
                      chat.data.contactName
                    );
                  } else {
                    if (selectedChat(chat.id)) {
                      selects = selects.filter((select) => {
                        return select.id != chat.id;
                      });
                    } else {
                      selects.push({
                        id: chat.id,
                        message: chat.data.message,
                        contactID: chat.data.contactID,
                        contactName: chat.data.contactName,
                        image: chat.data.image
                      });
                      console.log(selects.length)
                    }
                  }
                }}
                longPress={() => {
                  onLongPressObjChanged({
                    id: chat.id,
                    message: chat.data.message,
                    data: chat.data,
                    contactID: chat.data.contactID,
                    contactName: chat.data.contactName,
                    image: chat.data.image
                  });
                  onShowPopUpChanged(true);
                }}
                showCheckBox={showCheckBox}
                props={props}
                date={tmpHours + ":" + tmpMinutes}
                isSelf={
                  chat.data.userID == userId
                    ? (isSelf = "true")
                    : (isSelf = "")
                }
                // seen={
                //   totalMessage - index >= totalMessage - totalMessageRead &&
                //   chat.data.userID == userId
                //     ? (seen = "true")
                //     : (seen = "")
                // }
                contactID={chat.data.contactID}
                contactName={chat.data.contactName}
                image={imageMap[chat.data.userID]}
              />
            ) : (
              <ChatText
                longPress={() => {
                  onLongPressObjChanged({
                    id: chat.id,
                    message: chat.data.message,
                    data: chat.data,
                    contactID: chat.data.contactID,
                    contactName: chat.data.contactName,
                    image: chat.data.image
                  });
                  onShowPopUpChanged(true);
                }}
                hyperLinkClicked={(url, text)=>{
                  if(!tmpMultiSelect){
                    if(findParams(url, "apn") && findParams(url, "link")){
                      let link = decodeURIComponent(findParams(url, "link"));
                      console.log(findParams(link, "product_id"));
                      if(findParams(link, "product_id")){
                        let apiUrl = request.getApiUrl() + "products/" + findParams(link, "product_id");
                        props.navigation.navigate("HomeStoreList", {
                          url: apiUrl,
                        });
                      } else {
                        Linking.openURL(url);
                      }
                    } else {
                      Linking.openURL(url);
                    }
                  }
                }}
                props={props}
                showCheckBox={showCheckBox}
                date={tmpHours + ":" + tmpMinutes}
                isSelf={
                  chat.data.userID == userId
                    ? (isSelf = "true")
                    : (isSelf = "")
                }
                // seen={
                //   totalMessage - index >= totalMessage - totalMessageRead &&
                //   chat.data.userID == userId
                //     ? (seen = "true")
                //     : (seen = "")
                // }
                text={
                  chat.data.contactID == null && chat.data.image == null
                    ? chat.data.message
                    : ""
                }
                imageURL={chat.data.image ? chat.data.image : ""}
                image={imageMap[chat.data.userID]}
              />
            )}
            {/*///////////////////////////////////////*/}
          </View>
        </TouchableNativeFeedback>
      );

      previousMessageDateElse = chat.data.timeStamp.toDate().toDateString();
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Spinner
        visible={spinner}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      {!multiSelect ? (
        <CustomHeader
          text={Translate.t("chat")}
          onBack={() => props.navigation.goBack()}
          images={images}
          name={name} userUrl={userUrl}
          onFavoritePress={() => props.navigation.navigate("Favorite")}
          onPress={() => props.navigation.navigate("Cart")}
        />
      ) : (
        <CustomSelectHeader
          onSend={() => {
            if (selects.length > 0) {
              props.navigation.navigate("ChatListForward", {
                messages: selects,
              });
            }
          }}
          onCancel={() => {
            setMultiSelect(false);
            tmpMultiSelect = false;
            selects = [];
            processChat(chats);
            processOld30Chat(old30Chats);
            processOldChat(oldChats);
          }}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS == "ios" ? 20 : 0}
        style={{ flex: 1 }}
      >
        <EmojiBoard
          numCols={parseInt(heightPercentageToDP("30%") / 60)}
          showBoard={showEmoji}
          style={{
            height: heightPercentageToDP("50%"),
            marginBottom: heightPercentageToDP("10%"),
          }}
          containerStyle={{
            height: heightPercentageToDP("30%"),
          }}
          onClick={onClick}
          onRemove={onRemove}
        />
        <LinearGradient
          colors={[Colors.E4DBC0, Colors.C2A059]}
          start={[0, 0]}
          end={[1, 0.6]}
          style={{ flex: 1 }}
        >
          <FlatList
            ref={scrollViewReference}
            data={newChats}
            extraData={newChats}
            renderItem={renderItem}
            onContentSizeChange={() =>
              scrollViewReference.current.scrollToEnd({ animated: true })
            }
            keyExtractor={chat=> groupID + "_chat_" + chat.id}>
          </FlatList>
        </LinearGradient>
        <Modal
          presentationStyle={"overFullScreen"}
          visible={showPopUp}
          transparent={true}
        >
          <TouchableNativeFeedback  >
            <View style={{ flex: 1, backgroundColor: "transparent" }}>
              <View style={showPopUp == true ? styles.popUpView : styles.none}>
                <View
                  style={{
                    marginTop: heightPercentageToDP("1%"),
                    // paddingBottom: heightPercentageToDP("1.5%"),
                    flex: 1,
                    width: "100%",
                  }}
                >
                  <View>
                    <TouchableOpacity
                      onPress={() => {Clipboard.setString(longPressObj.message); onShowPopUpChanged(false)}}
                    >
                      <Text style={styles.popUpText}>
                        {Translate.t("copy")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate("ChatListForward", {
                          message: longPressObj.message,
                          contactID: longPressObj.contactID,
                          contactName: longPressObj.contactName,
                          image: longPressObj.image
                        })
                      }
                    >
                      <Text style={styles.popUpText}>
                        {Translate.t("forward")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        let update = {};
                        update["delete"] = longPressObj.data["delete"]
                          ? false
                          : true;
                        db.collection("chat")
                          .doc(groupID)
                          .collection("messages")
                          .doc(longPressObj.id)
                          .set(update, {
                            merge: true,
                          });

                        chats = chats.map((chat) => {
                          if(chat.id == longPressObj.id){
                            chat.data["delete"] = update["delete"]
                          }
                          return chat;
                        })
                        oldChats = oldChats.map((chat) => {
                          if(chat.id == longPressObj.id){
                            chat.data["delete"] = update["delete"]
                          }
                          return chat;
                        })
                        old30Chats = old30Chats.map((chat) => {
                          if(chat.id == longPressObj.id){
                            chat.data["delete"] = update["delete"]
                          }
                          return chat;
                        })

                        processChat(chats);
                        processOldChat(oldChats);
                        processOld30Chat(old30Chats);
                        onShowPopUpChanged(false);
                      }}
                    >
                      <Text style={styles.popUpText}>
                        {Translate.t("cancelOnlyMe")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        let update = {};
                        update["delete_" + userId] = longPressObj.data[
                          "delete_" + userId
                        ]
                          ? false
                          : true;
                        db.collection("chat")
                          .doc(groupID)
                          .collection("messages")
                          .doc(longPressObj.id)
                          .set(update, {
                            merge: true,
                          });

                        chats = chats.map((chat) => {
                          if(chat.id == longPressObj.id){
                            chat.data["delete_" + userId] = update["delete_" + userId]
                          }
                          return chat;
                        })
                        oldChats = oldChats.map((chat) => {
                          if(chat.id == longPressObj.id){
                            chat.data["delete_" + userId] = update["delete_" + userId]
                          }
                          return chat;
                        })
                        old30Chats = old30Chats.map((chat) => {
                          if(chat.id == longPressObj.id){
                            chat.data["delete_" + userId] = update["delete_" + userId]
                          }
                          return chat;
                        })

                        processChat(chats);
                        processOldChat(oldChats);
                        processOld30Chat(old30Chats);
                        onShowPopUpChanged(false);
                      }}
                    >
                      <Text style={styles.popUpText}>
                        {Translate.t("remove")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        let update = {};
                        update["favourite_" + userId] = true;
                        db.collection("chat")
                          .doc(groupID)
                          .set(update, {
                            merge: true,
                          })
                          .then(() => {
                            onShowPopUpChanged(false);
                            alert.warning(Translate.t("chat_favourite_added"));
                          });

                        // db.collection("users")
                        //   .doc(userId)
                        //   .collection("FavoriteChat")
                        //   .doc(longPressObj.id)
                        //   .set({
                        //     createdAt: longPressObj.data.createdAt,
                        //     favoriteMessage: longPressObj.message,
                        //     groupID: groupID,
                        //     groupName: groupName,
                        //     timeStamp: longPressObj.data.timeStamp,
                        //   })
                        //   .then(function () {
                        //   });
                      }}
                    >
                      <Text style={styles.popUpText}>
                        {Translate.t("addToFav")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setMultiSelect(true);
                        tmpMultiSelect = true;
                        selects.push({
                          id: longPressObj.id,
                          message: longPressObj.message,
                          contactID: longPressObj.contactID,
                          contactName: longPressObj.contactName,
                          image: longPressObj.image
                        });
                        onShowPopUpChanged(false);
                      }}
                    >
                      <Text style={styles.popUpText}>
                        {Translate.t("multiSelect")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </TouchableNativeFeedback>
        </Modal>
        {/* Bottom Area */}

        <FooterChat
        inputBarPosition={inputBarPosition}
        textInputHeight={textInputHeight}
        shouldShow={shouldShow}
        hideEmoji={hideEmoji}
        onHide={() => {
            hideEmoji();
            setShouldShow(!shouldShow);
        }}

        onContentSizeChange={() => {
            scrollViewReference.current.scrollToEnd({
                animated: true,
            })
            }}
        messages={messages}
        onChangeText={(value) => setMessages(value)}
        handleEmojiIconPressed={handleEmojiIconPressed}
        shareContact={() =>
            props.navigation.navigate("ContactShare", {
                groupID: groupID,
            })
            }
        />

      </KeyboardAvoidingView>
    </SafeAreaView>
    // </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  textInputArea: {
    height: heightPercentageToDP("7%"),
    backgroundColor: "#F0EEE9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInputAreaWithEmoji: {
    height: heightPercentageToDP("7%"),
    backgroundColor: "#F0EEE9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    bottom: RFValue(35),
  },
  emojiBoard: {
    bottom: 0,
    height: heightPercentageToDP("30%"),
  },
  modal_view: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    maxWidth: width - 160,
    minHeight: 20,
  },
  none: {
    display: "none",
  },
  chat_date: {
    textAlign: "center",
    fontSize: RFValue(10),
  },
  input_bar: {
    height: heightPercentageToDP("7%"),
    backgroundColor: "#F0EEE9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input_bar_file: {
    marginLeft: 5,
    height: heightPercentageToDP("6%"),
    width: heightPercentageToDP("6%"),
    padding: 10,
  },
  input_bar_text: {
    height: "100%",
    flexGrow: 1,
    padding: 5,
  },
  input_bar_text_border: {
    borderRadius: 25,
    backgroundColor: "#FFF",
    width: "100%",
    height: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  popUpView: {
    position: "absolute",
    backgroundColor: "white",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderWidth: 1,
    borderColor: Colors.D7CCA6,
    // alignSelf: "center",
    // marginTop: -heightPercentageToDP("15%"),
    // justifyContent: "space-evenly",
    marginHorizontal: widthPercentageToDP("15%"),
    marginVertical: heightPercentageToDP("34%"),
    // paddingTop: heightPercentageToDP("1%"),
    // paddingBottom: heightPercentageToDP("3%"),
    // alignItems: "center",
  },
  popUpText: {
    marginLeft: widthPercentageToDP("2%"),
    fontSize: RFValue(12),
    paddingBottom: heightPercentageToDP("2%"),
  },
  // user_text_input: {
  //   width: widthPercentageToDP("15%"),
  //   height: heightPercentageToDP("5%"),
  //   backgroundColor: "orange",
  //   flexGrow: 1,
  //   color: "black",
  //   flexDirection: "row",
  //   justifyContent: "flex-end",
  //   paddingLeft: 15,
  // },
  user_emoji_input: {
    // height: heightPercentageToDP("6%"),
    width: heightPercentageToDP("6%"),
    fontSize: RFValue(10),
    padding: 10,
    alignItems: "center",
  },
  input_bar_send: {
    marginRight: 5,
    height: heightPercentageToDP("6%"),
    width: heightPercentageToDP("6%"),
    padding: 10,
  },
  input_bar_widget: {
    height: heightPercentageToDP("10%"),
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  widget_box: {
    alignItems: "center",
    height: heightPercentageToDP("8%"),
    width: heightPercentageToDP("10%"),
    padding: 10,
    color: "#000",
    textAlign: "center",
  },
  widget_icon: {
    height: heightPercentageToDP("7%") - 20,
    width: heightPercentageToDP("7%") - 20,
    margin: "auto",
  },
  scrollViewStyleWithoutEmoji: {
    width: "100%",
    // paddingTop: heightPercentageToDP("1%"),
    // paddingBottom: heightPercentageToDP("5%"),
    marginBottom: 5,
    paddingBottom: 30,
    // showEmoji == true ? heightPercentageToDP("30%") : 0,
  },
  scrollViewStyleWithEmoji: {
    width: "100%",
    // paddingTop: heightPercentageToDP("1%"),
    // paddingBottom: heightPercentageToDP("5%"),
    marginBottom: heightPercentageToDP("30%"),
    paddingBottom: 30,
    // showEmoji == true ? heightPercentageToDP("30%") : 0,
  },
  selected: {
    backgroundColor: "#BBD8B3",
  },
  non_selected: {},
});
