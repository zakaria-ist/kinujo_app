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
import { Colors } from "../assets/Colors.js";

import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Person from "../assets/icons/default_avatar.svg";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeader";
import GroupImages from "../assets/CustomComponents/GroupImages";
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
import moment from 'moment-timezone';
import * as Localization from "expo-localization";
const alert = new CustomAlert();
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const chatRef = db.collection("chat");
const win = Dimensions.get("window");
const ratioProfile = win.width / 9 / 512;
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
let tmpCreatedAt =
  year + ":" + month + ":" + day + ":" + hour + ":" + minute + ":" + seconds;
let otherUsersID = [];
let allUserImage = [];
const myTimeZone = Localization.timezone;

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

async function getDetail(ownId, snapShotId, data) {
  try{
    let timeStamp;
    chatRef.doc(snapShotId).collection("messages").orderBy("timeStamp", "desc").limit(1).get()
      .then((querySnapShot)=>{
        querySnapShot.forEach((snapShot) => {
          let tStamps = snapShot.data().timeStamp.toDate();
          timeStamp = moment(tStamps).tz(myTimeZone).format('YYYY:MM:DD:HH:mm:ss');
        })
      })

    if (data.type && data.type == "group") {
      let grpImages = [];
      allUserImage.forEach((item) => {
        if (data.users.length && data.users.includes(item.id)) {
          grpImages.push(item.image);
        }
      });
      return {
        name: data.groupName,
        images: grpImages,
        timeStamp: timeStamp,
      };
    }
    if (data.users.length > 2) {
      let usrImages = [];
      allUserImage.forEach((item) => {
        if (data.users.includes(item.id)) {
          usrImages.push(item.image);
        }
      });
      return {
        name: data.groupName,
        images: usrImages,
        timeStamp: timeStamp
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
    let isBlock = false;
    let isHide = false;
    snapShot.forEach((docRef) => {
      let customers = users;
      if (customers.length > 0) {
        customers = customers[0];
      }
      if (docRef.data().displayName && docRef.id == JSON.parse(customers)) {
        firebaseName = docRef.data().displayName;
        isBlock = docRef.data().blockMode ? true : false;
        isHide = docRef.data().secretMode ? true : false;
      }
    });

    if (users.length > 0) {
      let user = users[0];
      let img = [];
      let djangoName = "";
      allUserImage.forEach((item) => {
        if (user == item.id) {
          img.push(item.image);
          djangoName = item.name;
        }
      });
      return {
        name: firebaseName ? firebaseName : djangoName,
        images: img,
        block: isBlock,
        hide: isHide,
        timeStamp: timeStamp
      };
    }
  }catch(e){
    console.log('ERORROROROROROR', e);
  }
  return {
    name: "",
    images: [],
  };
}

let gUnsubscribe = null;

export default function ChatList(props) {
  const isFocused = useIsFocused();
  const [show, onShowChanged] = useStateIfMounted(false);
  const [totalUnread, setTotalUnread] = useStateIfMounted(0);
  const [loaded, onLoadedChanged] = useStateIfMounted(false);
  const [chatHtml, onChatHtmlChanged] = useStateIfMounted([]);
  const [longPressObj, onLongPressObjChanged] = useStateIfMounted({});
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
  
  async function processQuerySnapshot(querySnapShot){
    let tmpSnapshots = [];
    querySnapShot.forEach((snapshot)=>{
      tmpSnapshots.push(snapshot);
    });
    // looping two times for improving UI response
    // One without user detail, next with the detail
    // for (let i=0; i<tmpSnapshots.length; i++) {
    //   let snapShot = tmpSnapshots[i];
    //   if (snapShot && snapShot.exists) {
    //     if(!snapShot.data()["delete_" + ownUserID] &&
    //     !snapShot.data()["hide_" + ownUserID] &&
    //     !snapShot.data()["hide"] && snapShot.data()['totalMessage'] > 0){
    //       let tempChats = chats.filter((chat) => {
    //         return chat.id == snapShot.id;
    //       });
    //       if (tempChats.length == 0) {
    //         chats.push({
    //           id: snapShot.id,
    //           data: snapShot.data(),
    //           name: "",
    //           images: [""],
    //           block: false,
    //           hide: false,
    //         });
    //       } else {
    //         chats = chats.map((chat) => {
    //           if (chat.id == snapShot.id) {
    //             chat.data = snapShot.data();
    //           }
    //           return chat;
    //         });
    //       }
    //     }
    //   }
    // }
    // chats = chats.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i) // remove duplicates
    // processChat(chats, ownUserID, false);

    chats = [];
    for (let i=0; i<tmpSnapshots.length; i++) {
      let snapShot = tmpSnapshots[i];
      if (snapShot && snapShot.exists) {
        if(!snapShot.data()["delete_" + ownUserID] &&
        !snapShot.data()["hide_" + ownUserID] &&
        !snapShot.data()["hide"] && snapShot.data()['totalMessage'] > 0){
          let tempChats = chats.filter((chat) => {
            return chat.id == snapShot.id;
          });
          if (tempChats.length == 0) {
            let detail = await getDetail(ownUserID, snapShot.id, snapShot.data());
            chats.push({
              id: snapShot.id,
              data: snapShot.data(),
              name: detail.name,
              images: detail.images,
              block: detail.block,
              hide: detail.hide,
              timeStamp: detail.timeStamp,
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
      }
    }
    chats = chats.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i) // remove duplicates
    chats.sort(function(x, y) {
      let pinQuery = "pinned_" + ownUserID
      let pinTimeQuery = pinQuery + '_pintime'
      try {
        if(x?.data[pinQuery] && y.data[pinQuery]){
          return x.data[pinTimeQuery] > y.data[pinTimeQuery] ? -1 : 1
         }
      } catch (error) {
        
      }

      if(!x?.data[pinQuery] && !y.data[pinQuery]){
        return x.timeStamp > y.timeStamp ? -1 : 1
      }

        // true values first
        return (x.data[pinQuery] === y.data[pinQuery])? 0 : x.data[pinQuery]? -1 : 1;
    });
    setTotalUnread(0);
    processChat(chats, ownUserID, true);
  }

  function processChat(tmpChats, ownUserID, updateUnread = false) {
    let tmpChatHtml = [];
    lastReadDateField = "lastReadDate_" + ownUserID;
    unseenMessageCountField = "unseenMessageCount_" + ownUserID;
    let unreadMessage = 0;
    // setTotalUnread(unreadMessage);
    
    tmpChats = tmpChats.filter((chat) => {
      return (
        !chat.data["delete_" + ownUserID] &&
        !chat.data["hide_" + ownUserID] &&
        !chat["hide"] //&&
        //!chat["block"]
      );
    });
    tmpChats.map((chat) => {
      console.log('chat', chat.data['lastMessage']);
      let myMsgSeenCount = parseInt(chat.data["totalMessageRead_" + ownUserID]);
      let totalMsgCount = parseInt(chat.data["totalMessage"]);
      let myUnreadCount = totalMsgCount - myMsgSeenCount;
      // console.log('myMsgSeenCount', myMsgSeenCount)
      // console.log('totalMsgCount', totalMsgCount)
      // console.log('myUnreadCount', myUnreadCount)
      if (updateUnread && myUnreadCount
        // parseInt(chat.data["unseenMessageCount_" + ownUserID]) > 0
      ) {
        unreadMessage++;
        console.log('unreadMessage', unreadMessage);
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
      let date = chat.timeStamp ? chat.timeStamp.split(':') : chat.data.lastMessageTime
        ? chat.data.lastMessageTime.split(":")
        : tmpCreatedAt.split(":");
      let tmpMonth = date[1].length > 1 ? date[1] : '0' + date[1];
      let tmpDay = date[2].length > 1 ? date[2] : '0' + date[2]; //message created at
      let tmpHours = date[3].length > 1 ? date[3] : '0' + date[3];
      let tmpMinutes = date[4].length > 1 ? date[4] : '0' + date[4];
      lastReadDate = chat.data[lastReadDateField];

      name = chat.name;
      images = chat.images;
      if (tmpDay == today && chat.data.totalMessage > 0) {
        tmpChatHtml.push(
          <TouchableWithoutFeedback
            key={chat.id}
            date={
              chat.data.lastMessageTime
                ? chat.data.lastMessageTime
                : tmpCreatedAt
            }
            // pinned={chat.data["pinned_" + ownUserID] ? true : false}
            hide={chat.data["hide_" + ownUserID] ? true : false}
            delete={chat.data["delete_" + ownUserID] ? true : false}
            onPress={() =>
              props.navigation.navigate("ChatScreen", {
                type: chat.data.type,
                groupID: chat.id,
                groupName: chat.name,
              })
            }
            onLongPress={() => {
              onLongPressObjChanged({
                id: chat.id,
                data: chat.data,
                name: chat.name,
              });
              onShowChanged(true);
            }}
          >
            <View style={styles.tabContainer}>
              {images ? (
                <GroupImages
                  width={RFValue(40)}
                  height={RFValue(40)}
                  images={images}
                ></GroupImages>
              ) : (
                <GroupImages
                  width={RFValue(40)}
                  height={RFValue(40)}
                  images={images}
                ></GroupImages>
              )}
              <View style={styles.descriptionContainer}>
                <Text style={styles.tabText}>{name}</Text>
                <Text style={styles.tabText}>
                  {chat.secret ? "" : chat.data.lastMessage.substring(0,30)}{chat.data.lastMessage.length > 30 ? "..." : ""}
                </Text>
              </View>
              <View style={styles.tabRightContainer}>
                {tmpDay == today ? (
                  <Text style={styles.tabTextTime}>
                    {tmpHours + ":" + tmpMinutes}
                  </Text>
                ) : (
                  <Text style={styles.tabTextTime}>{tmpMonth + "/" + tmpDay}</Text>
                )}
                {/* {chat.data[unseenMessageCountField] &&
                chat.data[unseenMessageCountField] > 0 ? (
                  <View style={styles.notificationNumberContainer}>
                    <Text style={styles.notificationNumberText}>
                      {chat.data[unseenMessageCountField]}
                    </Text>
                  </View> */}
                {myUnreadCount &&
                myUnreadCount > 0 ? (
                  <View style={styles.notificationNumberContainer}>
                    <Text style={styles.notificationNumberText}>
                      {myUnreadCount}
                    </Text>
                  </View>
                ) : (
                  <View></View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      } else if (tmpDay == today - 1 && chat.data.totalMessage > 0) {
        tmpChatHtml.push(
          <TouchableWithoutFeedback
            key={chat.id}
            date={
              chat.data.lastMessageTime
                ? chat.data.lastMessageTime
                : tmpCreatedAt
            }
            // pinned={chat.data["pinned_" + ownUserID] ? true : false}
            hide={chat.data["hide_" + ownUserID] ? true : false}
            delete={chat.data["delete_" + ownUserID] ? true : false}
            onPress={() =>
              props.navigation.navigate("ChatScreen", {
                type: chat.data.type,
                groupID: chat.id,
                groupName: chat.name,
              })
            }
            onLongPress={() => {
              onLongPressObjChanged({
                id: chat.id,
                data: chat.data,
                name: chat.name,
              });
              onShowChanged(true);
            }}
          >
            <View style={styles.tabContainer}>
              {images ? (
                <GroupImages
                  width={RFValue(40)}
                  height={RFValue(40)}
                  images={images}
                ></GroupImages>
              ) : (
                <GroupImages
                  width={RFValue(40)}
                  height={RFValue(40)}
                  images={images}
                ></GroupImages>
              )}
              <View style={styles.descriptionContainer}>
                <Text style={styles.tabText}>{name}</Text>
                <Text style={styles.tabText}>
                {chat.secret ? "" : chat.data.lastMessage.substring(0,30)}{chat.data.lastMessage.length > 30 ? "..." : ""}
                </Text>
              </View>
              <View style={styles.tabRightContainer}>
                {tmpDay == today - 1 ? (
                  <Text style={styles.tabTextTime}>{"Yesterday"}</Text>
                ) : (
                  <Text style={styles.tabTextTime}>{tmpMonth + "/" + tmpDay}</Text>
                )}
                {myUnreadCount &&
                myUnreadCount > 0 ? (
                  <View style={styles.notificationNumberContainer}>
                    <Text style={styles.notificationNumberText}>
                      {myUnreadCount}
                    </Text>
                  </View>
                ) : (
                  <View></View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      } else if (chat.data.totalMessage > 0) {
        tmpChatHtml.push(
          <TouchableWithoutFeedback
            key={chat.id}
            date={
              chat.data.lastMessageTime
                ? chat.data.lastMessageTime
                : tmpCreatedAt
            }
            // pinned={chat.data["pinned_" + ownUserID] ? true : false}
            hide={chat.data["hide_" + ownUserID] ? true : false}
            delete={chat.data["delete_" + ownUserID] ? true : false}
            onPress={() =>
              props.navigation.navigate("ChatScreen", {
                type: chat.data.type,
                groupID: chat.id,
                groupName: chat.name,
              })
            }
            onLongPress={() => {
              onLongPressObjChanged({
                id: chat.id,
                data: chat.data,
                name: chat.name,
              });
              onShowChanged(true);
            }}
          >
            <View style={styles.tabContainer}>
              {images ? (
                <GroupImages
                  width={RFValue(40)}
                  height={RFValue(40)}
                  images={images}
                ></GroupImages>
              ) : (
                <GroupImages
                  width={RFValue(40)}
                  height={RFValue(40)}
                  images={images}
                ></GroupImages>
              )}
              <View style={styles.descriptionContainer}>
                <Text style={styles.tabText}>{name}</Text>
                <Text style={styles.tabText}>
                {chat.secret ? "" : chat.data.lastMessage.substring(0,30)}{chat.data.lastMessage.length > 30 ? "..." : ""}
                </Text>
              </View>
              <View style={styles.tabRightContainer}>
                <Text style={styles.tabTextTime}>{tmpMonth + "/" + tmpDay}</Text>
                {chat.data[unseenMessageCountField] &&
                chat.data[unseenMessageCountField] > 0 ? (
                  <View style={styles.notificationNumberContainer}>
                    <Text style={styles.notificationNumberText}>
                      {chat.data[unseenMessageCountField]}
                    </Text>
                  </View>
                ) : (
                  <View></View>
                )}
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
      // tmpChatHtml.sort((html1, html2) => {
      //   // if (html1.props["pinned"] && !html2.props["pinned"]) {
      //   //   return 1;
      //   // }

      //   // if (!html1.props["pinned"] && html2.props["pinned"]) {
      //   //   return -1;
      //   // }

      //   // if (html1.props["pinned"] && html2.props["pinned"]) {
      //   //   let date1 = getDate(html1.props["date"]);
      //   //   let date2 = getDate(html2.props["date"]);

      //   //   if (date1 > date2) {
      //   //     return -1;
      //   //   }
      //   //   if (date1 < date2) {
      //   //     return 1;
      //   //   }
      //   // }

      //   if (!html1.props["pinned"] && !html2.props["pinned"]) {
      //     let date1 = getDate(html1.props["date"]);
      //     let date2 = getDate(html2.props["date"]);

      //     if (date1 > date2) {
      //       return -1;
      //     }
      //     if (date1 < date2) {
      //       return 1;
      //     }
      //   }
      //   return 0;
      // });
      const resultChatHtml = tmpChatHtml.filter((html) => {
        return !html.props["hide"] && !html.props["delete"];
      });
      onChatHtmlChanged(resultChatHtml);
    });
    
    if(updateUnread){
      setTotalUnread(unreadMessage);
      console.log('totalUnread', totalUnread);
    }
  }
  async function firstLoad() {
    let url = await AsyncStorage.getItem("user");
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    // onChatHtmlChanged([]);
    ownUserID = urls[urls.length - 1];
    this.unsub = chatRef
      .where("users", "array-contains", String(ownUserID))
      .onSnapshot((querySnapShot) => {
        if(!isFocused) return
        processQuerySnapshot(querySnapShot).then(()=>{

        }).catch((error)=>{
          console.log("ERROR: " + error);
        })
      });
    return ()=>{};
    
  }

  React.useEffect(() => {
    if(!isFocused){
        if(this.unsub){
          this.unsub();
        }
      // }
    }
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem("chat").then((item) => {
        if (item) {
          AsyncStorage.removeItem("chat");
          item = JSON.parse(item);
          props.navigation.push("ChatScreen", item);
        }
      });
      AsyncStorage.getItem("chatuserlist").then((item) => {
        if (item) {
          allUserImage = JSON.parse(item);
        }
      });

      gUnsubscribe = null;
      chats = [];
      firstLoad().then((unsub) => {
      });
    });

    return function () {
      chats = [];
      onChatHtmlChanged([]);
      if (gUnsubscribe) {
        gUnsubscribe();
      }
    };
  }, [isFocused]);

    const onUpperFix = () => {
      let update = {};
      let pinQuery = "pinned_" + ownUserID
      let pinTimeQuery = pinQuery + '_pintime'
      update[pinQuery] = !longPressObj.data[pinQuery]
        // longPressObj.data["pinned_" + ownUserID] == "" ||
        // !longPressObj.data[pinQuery]
      update[pinQuery] && (update[pinTimeQuery] = new Date().getTime())
      
      db.collection("chat").doc(longPressObj.id).set(update, {
        merge: true,
      });
      onShowChanged(false);
    }

  return (
    <TouchableWithoutFeedback onPress={() => onShowChanged(false)}>
      <SafeAreaView style={{ flex: 1 }}>
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
                alignItems: "center",
                paddingBottom: heightPercentageToDP("3%"),
                marginTop: heightPercentageToDP("3%"),
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(14),
                  paddingRight: widthPercentageToDP("2%"),
                }}
              >
                {Translate.t("chat")}
              </Text>
              {totalUnread ? (
                <View style={styles.notificationNumberContainer}>
                  <Text style={styles.notificationNumberText}>
                    {totalUnread}
                  </Text>
                </View>
              ) : (
                <View></View>
              )}
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
                <TouchableOpacity
                  onPress={onUpperFix}
                >
                  <Text style={styles.longPressText}>
                    {longPressObj && longPressObj.data && longPressObj.data["pinned_" + ownUserID] == true ? Translate.t("removeUpperFixed") : Translate.t("upperFixed")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    let update = {};
                    update["notify_" + ownUserID] =
                      longPressObj.data["notify_" + ownUserID] == false
                        ? true
                        : false;
                    db.collection("chat").doc(longPressObj.id).set(update, {
                      merge: true,
                    });
                    onShowChanged(false);
                  }}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("notification")}{" "}
                    {longPressObj &&
                    longPressObj.data &&
                    longPressObj.data["notify_" + ownUserID] == false
                      ? "ON"
                      : "OFF"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    let update = {};
                    update["hide_" + ownUserID] =
                      longPressObj.data["hide_" + ownUserID] == false
                        ? true
                        : false;
                    db.collection("chat").doc(longPressObj.id).set(update, {
                      merge: true,
                    });
                    onShowChanged(false);
                  }}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("nonRepresent")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
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
                </TouchableOpacity>
                <TouchableOpacity
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
                </TouchableOpacity>
                <TouchableOpacity
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
                </TouchableOpacity>
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
  tabTextTime: {
    fontSize: RFValue(12),
    width: widthPercentageToDP("15%"),
    textAlign: "right"
  },
  descriptionContainer: {
    justifyContent: "center",
    width: widthPercentageToDP("60%"),
    marginLeft: widthPercentageToDP("3%"),
  },
  tabContainer: {
    alignItems: "center",
    // justifyContent: "center",
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
    // paddingVertical: heightPercentageToDP("2%"),
  },
  longPressText: {
    fontSize: RFValue(12),
  },
});
