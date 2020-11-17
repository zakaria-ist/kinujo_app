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
} from "react-native";
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

const alert = new CustomAlert();
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const chatRef = db.collection("chat");
const win = Dimensions.get("window");
let groupID = [];
let today = new Date().getDate();
let lastReadDateField;
let unseenMessageCountField;
let ownUserID;
let totalUnseenMessage = 0;
let unseenObj = [];
let tmpChatHtml = [];
let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let day = new Date().getDate();
let hour = new Date().getHours();
let minute = ("0" + new Date().getMinutes()).slice(-2);
let seconds = new Date().getSeconds();
let tmpCreatedAt =
  year + ":" + month + ":" + day + ":" + hour + ":" + minute + ":" + seconds;

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
export default function ChatList(props) {
  const isFocused = useIsFocused();
  const [show, onShowChanged] = React.useState(false);
  const [loaded, onLoadedChanged] = React.useState(false);
  const [chatHtml, onChatHtmlChanged] = React.useState([]);
  const [longPressObj, onLongPressObjChanged] = React.useState({});

  function getUnseenMessageCount(groupID, userID) {
    let userTotalMessageReadField = "totalMessageRead_" + userID;
    let userTotalMessageReadCount;
    let totalMessageCount;
    chatRef
      .doc(groupID)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          userTotalMessageReadCount = doc.data()[userTotalMessageReadField];
          totalMessageCount = doc.data().totalMessage;
        }
      })
      .then(function() {
        chatRef.doc(groupID).update({
          [unseenMessageCountField]:
            totalMessageCount - userTotalMessageReadCount,
        });
      });
  }

  async function firstLoad() {
    let url = await AsyncStorage.getItem("user");
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    ownUserID = urls[urls.length - 1];
    lastReadDateField = "lastReadDate_" + ownUserID;
    unseenMessageCountField = "unseenMessageCount_" + ownUserID;
    const unsubscribe = chatRef
      .where("users", "array-contains", String(ownUserID))
      .onSnapshot((querySnapShot) => {
        querySnapShot.forEach((snapShot) => {
          if (snapShot && snapShot.exists) {
            totalUnseenMessage = 0;
            totalUnseenMessage =
              snapShot.data()[unseenMessageCountField] + totalUnseenMessage;
            unseenObj[snapShot.id] = totalUnseenMessage;
            let tmpGroupID = groupID.filter((item) => {
              return item == snapShot.id;
            });
            if (tmpGroupID.length >= 1) {
              for (var i = 0; i < tmpChatHtml.length; i++) {
                if (tmpChatHtml[i].key == snapShot.id) {
                  tmpChatHtml.splice(i, 1); //find poisition delete
                }
              }
              tmpChatHtml = _.without(tmpChatHtml, snapShot.id);
            }
            getUnseenMessageCount(snapShot.id, ownUserID);
            let date = snapShot.data().lastMessageTime
              ? snapShot.data().lastMessageTime.split(":")
              : tmpCreatedAt.split(":");
            let tmpMonth = date[1];
            let tmpDay = date[2]; //message created at
            let tmpHours = date[3];
            let tmpMinutes = date[4];
            lastReadDate = snapShot.data()[lastReadDateField];
            if (tmpDay == today) {
              tmpChatHtml.unshift(
                <TouchableWithoutFeedback
                  key={snapShot.id}
                  date={
                    snapShot.data().lastMessageTime
                      ? snapShot.data().lastMessageTime
                      : tmpCreatedAt
                  }
                  pinned={snapShot.data()["pinned_" + ownUserID] ? true : false}
                  hide={snapShot.data()["hide_" + ownUserID] ? true : false}
                  delete={snapShot.data()["delete_" + ownUserID] ? true : false}
                  onPress={() =>
                    props.navigation.navigate("ChatScreen", {
                      groupID: snapShot.id,
                      groupName: snapShot.data().groupName,
                    })
                  }
                  onLongPress={() => {
                    onLongPressObjChanged({
                      id: snapShot.id,
                      data: snapShot.data(),
                    });
                    onShowChanged(true);
                  }}
                >
                  <View style={styles.tabContainer}>
                    <Image style={styles.tabImage} />
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.tabText}>
                        {snapShot.data().groupName}
                      </Text>
                      <Text style={styles.tabText}>
                        {snapShot.data().message}
                      </Text>
                    </View>
                    <View style={styles.tabRightContainer}>
                      {tmpDay == today ? (
                        <Text style={styles.tabText}>
                          {tmpHours + ":" + tmpMinutes}
                        </Text>
                      ) : (
                        <Text style={styles.tabText}>
                          {tmpMonth + "/" + tmpDay}
                        </Text>
                      )}
                      {snapShot.data()[unseenMessageCountField] &&
                      snapShot.data()[unseenMessageCountField] > 0 ? (
                        <View style={styles.notificationNumberContainer}>
                          <Text style={styles.notificationNumberText}>
                            {snapShot.data()[unseenMessageCountField]}
                          </Text>
                        </View>
                      ) : (
                        <View></View>
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            } else if (tmpDay == today - 1) {
              tmpChatHtml.unshift(
                <TouchableWithoutFeedback
                  key={snapShot.id}
                  date={
                    snapShot.data().lastMessageTime
                      ? snapShot.data().lastMessageTime
                      : tmpCreatedAt
                  }
                  pinned={snapShot.data()["pinned_" + ownUserID] ? true : false}
                  hide={snapShot.data()["hide_" + ownUserID] ? true : false}
                  delete={snapShot.data()["delete_" + ownUserID] ? true : false}
                  onPress={() =>
                    props.navigation.navigate("ChatScreen", {
                      groupID: snapShot.id,
                      groupName: snapShot.data().groupName,
                    })
                  }
                  onLongPress={() => onShowChanged(true)}
                >
                  <View style={styles.tabContainer}>
                    <Image style={styles.tabImage} />
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.tabText}>
                        {snapShot.data().groupName}
                      </Text>
                      <Text style={styles.tabText}>
                        {snapShot.data().message}
                      </Text>
                    </View>
                    <View style={styles.tabRightContainer}>
                      {tmpDay == today - 1 ? (
                        <Text style={styles.tabText}>{"Yesterday"}</Text>
                      ) : (
                        <Text style={styles.tabText}>
                          {tmpMonth + "/" + tmpDay}
                        </Text>
                      )}
                      {snapShot.data()[unseenMessageCountField] &&
                      snapShot.data()[unseenMessageCountField] > 0 ? (
                        <View style={styles.notificationNumberContainer}>
                          <Text style={styles.notificationNumberText}>
                            {snapShot.data()[unseenMessageCountField]}
                          </Text>
                        </View>
                      ) : (
                        <View></View>
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            } else {
              tmpChatHtml.unshift(
                <TouchableWithoutFeedback
                  key={snapShot.id}
                  date={
                    snapShot.data().lastMessageTime
                      ? snapShot.data().lastMessageTime
                      : tmpCreatedAt
                  }
                  pinned={snapShot.data()["pinned_" + ownUserID] ? true : false}
                  hide={snapShot.data()["hide_" + ownUserID] ? true : false}
                  delete={snapShot.data()["delete_" + ownUserID] ? true : false}
                  onPress={() =>
                    props.navigation.navigate("ChatScreen", {
                      groupID: snapShot.id,
                      groupName: snapShot.data().groupName,
                    })
                  }
                  onLongPress={() => onShowChanged(true)}
                >
                  <View style={styles.tabContainer}>
                    <Image style={styles.tabImage} />
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.tabText}>
                        {snapShot.data().groupName}
                      </Text>
                      <Text style={styles.tabText}>
                        {snapShot.data().message}
                      </Text>
                    </View>
                    <View style={styles.tabRightContainer}>
                      <Text style={styles.tabText}>
                        {tmpMonth + "/" + tmpDay}
                      </Text>
                      {snapShot.data()[unseenMessageCountField] &&
                      snapShot.data()[unseenMessageCountField] > 0 ? (
                        <View style={styles.notificationNumberContainer}>
                          <Text style={styles.notificationNumberText}>
                            {snapShot.data()[unseenMessageCountField]}
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
            groupID.push(snapShot.id);

            totalUnseenMessage = 0;
            for (var i in unseenObj) {
              totalUnseenMessage += unseenObj[i];
            }
          }
        });

        tmpChatHtml.sort((html1, html2) => {
          if (html1.props["pinned"] && html2.props["pinned"]) {
            let date1 = getDate(html1.props["date"]);
            let date2 = getDate(html2.props["date"]);

            if (date1 > date2) {
              return 1;
            }
            if (date1 < date2) {
              return -1;
            }
          }

          if (!html1.props["pinned"] && !html2.props["pinned"]) {
            let date1 = getDate(html1.props["date"]);
            let date2 = getDate(html2.props["date"]);

            if (date1 > date2) {
              return 1;
            }
            if (date1 < date2) {
              return -1;
            }
          }

          if (html1.props["pinned"] && !html2.props["pinned"]) {
            return -1;
          }

          if (!html1.props["pinned"] && html2.props["pinned"]) {
            return 1;
          }
        });
        const resultChatHtml = tmpChatHtml.filter((html) => {
          return !html.props["hide"] && !html.props["delete"];
        });
        onChatHtmlChanged(resultChatHtml);
      });
  }

  React.useEffect(() => {
    firstLoad();

    return function() {};
  }, []);
  return (
    <TouchableWithoutFeedback onPress={() => onShowChanged(false)}>
      <View style={{ flex: 1 }}>
        <CustomHeader
          text="チャット"
          onPress={() => props.navigation.navigate("Cart")}
          onBack={() => props.navigation.pop()}
          onFavoriteChanged="noFavorite"
        />
        <View
          style={{
            marginHorizontal: widthPercentageToDP("4%"),
          }}
        >
          <View style={show == true ? styles.popUp : styles.none}>
            <View
              style={{
                marginTop: heightPercentageToDP("3%"),
              }}
            >
              <Text style={{ fontSize: RFValue(14) }}>
                {longPressObj && longPressObj.data
                  ? longPressObj.data.groupName
                  : ""}
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
                    db.collection("chat")
                      .doc(longPressObj.id)
                      .set(update, {
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
                    db.collection("chat")
                      .doc(longPressObj.id)
                      .set(update, {
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
                    db.collection("chat")
                      .doc(longPressObj.id)
                      .set(update, {
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
                      longPressObj.data["delete_" + ownUserID]
                        ? false
                        : true;
                    db.collection("chat")
                      .doc(longPressObj.id)
                      .set(update, {
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
                    props.navigation.navigate("GroupChatCreation");
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
                    props.navigation.navigate("CreateFolder");
                  }}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("createFolder")}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: heightPercentageToDP("3%"),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(14),
                paddingRight: widthPercentageToDP("2%"),
              }}
            >
              チャット
            </Text>
            {totalUnseenMessage ? (
              <View style={styles.notificationNumberContainer}>
                <Text style={styles.notificationNumberText}>
                  {totalUnseenMessage}
                </Text>
              </View>
            ) : (
              <View></View>
            )}
          </View>
          {chatHtml}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
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
