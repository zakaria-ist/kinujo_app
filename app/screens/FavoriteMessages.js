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
  try{
    // if (data.type && data.type == "group") {
    //   return {
    //     name: data.groupName,
    //     image: "",
    //   };
    // }
    // if (data.users.length > 2) {
    //   return {
    //     name: data.groupName,
    //     image: "",
    //   };
    // }
  
      let user = data.senderId;
      user = await request.get("profiles/" + user);
      user = user.data;
      djangoName = user.nickname;
      return {
        name: djangoName ? djangoName : data.groupName,
        image: user.image ? user.image.image : "",
      };
  }catch(e){
    
  }
  return {
    name: "",
    image: "",
  };
}

let unsubscribe = null;
export default function FavoriteMessages(props) {
  const isFocused = useIsFocused();
  const [show, onShowChanged] = useStateIfMounted(false);
  const [totalUnread, setTotalUnread] = useStateIfMounted(false);
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

  function processChat(tmpChats, ownUserID) {
    let tmpChatHtml = [];

    tmpChats.map((chat) => {
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

      tmpChatHtml.unshift(
        <TouchableOpacity
          key={chat.id}
          onPress={() =>
            props.navigation.navigate("ChatScreen", {
              type: chat.data.groupType,
              groupID: chat.data.groupID,
              groupName: name,
              favData: chat.data
            })
          }
          // onLongPress={() => {
          //   onLongPressObjChanged({
          //     id: chat.id,
          //     data: chat.data,
          //     name: name,
          //   });
          //   onShowChanged(true);
          // }}
        >
          <View style={styles.tabContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.tabImage} />
            ) : (
              <Image style={styles.tabImage} />
            )}
            <View style={styles.descriptionContainer}>
              <Text style={styles.tabText}>{name}</Text>
              <Text style={styles.tabText}>{chat.data.message}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
      
    });
    onChatHtmlChanged(tmpChatHtml);
  }

  async function processQuerySnapshot(ownUserID){
    chats = []
    let querySnapShot = await db
      .collection("users")
      .doc(ownUserID)
      .collection("favouriteMessages")
      .get();

    let tmpSnapshots = []
    querySnapShot.forEach((snapShot) => {
      tmpSnapshots.push(snapShot);
    });

    for(let i=0; i<tmpSnapshots.length; i++){
      let snapShot = tmpSnapshots[i];
      console.log('snapShot', snapShot.data());
      if (snapShot && snapShot.exists) {
          getDetail(ownUserID, snapShot.data()).then(function (detail) {
            chats.push({
              id: snapShot.data().groupID,
              data: snapShot.data(),
              name: detail.name,
              image: detail.image,
            });
            processChat(chats, ownUserID);
          });
      }
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
    processQuerySnapshot(ownUserID);
  }

  React.useEffect(() => {
    if(!isFocused){
      // if(this.unsub){
      //   this.unsub();
      // }
    }

    InteractionManager.runAfterInteractions(() => {
      gUnsubscribe = null
      chats = [];
      firstLoad();
    });

    return function () {
      chats = [];
      onChatHtmlChanged([]);
      // if (gUnsubscribe) {
      //   gUnsubscribe();
      // }
    };
  }, [isFocused]);
  return (
    <TouchableWithoutFeedback onPress={() => onShowChanged(false)}>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          text={Translate.t("favouriteMsg")}
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
                flexDirection: "column",
                alignItems: "stretch",
                paddingBottom: heightPercentageToDP("3%"),
                marginTop: heightPercentageToDP("3%"),
              }}
            >
            {chatHtml}
            </View>
          </View>
        </ScrollView>
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
