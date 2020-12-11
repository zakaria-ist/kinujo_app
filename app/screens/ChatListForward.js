import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "firebase/app";
import _ from "lodash";
import { useIsFocused } from "@react-navigation/native";
import "firebase/firestore";
import CustomAlert from "../lib/alert";
import Request from "../lib/request";
import CheckBox from "@react-native-community/checkbox";
const alert = new CustomAlert();
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const chatRef = db.collection("chat");
const win = Dimensions.get("window");
let groupID = [];
let today = new Date().getDate();
let ownUserID;
let tmpChatHtml = [];
let chatCheckBoxList = [];
let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let day = new Date().getDate();
let hour = new Date().getHours();
let minute = ("0" + new Date().getMinutes()).slice(-2);
let seconds = new Date().getSeconds();
let tmpChats = [];
let unsubscribe;
let messageToForward;
const request = new Request();
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

async function getName(ownId, data) {
  if (data.type && data.type == "group") {
    return data.groupName;
  }
  if (data.users.length > 2) return data.groupName;

  let users = data.users.filter((user) => {
    return user != ownId;
  });
  if (users.length > 0) {
    let user = users[0];
    user = await request.get("profiles/" + user);
    user = user.data;
    return user.real_name ? user.real_name : user.nickname;
  }
  return "";
}
function onValueChange(chatRoomID) {}
export default function ChatList(props) {
  messageToForward = props.route.params.message;
  const [chatHtml, onChatHtmlChanged] = React.useState([]);
  const [forwardChatHtml, onForwardChatHtmlChanged] = React.useState([]);
  const [loaded, onLoaded] = React.useState(false);
  const [user, onUserChanged] = React.useState({});

  async function firstLoad() {
    let url = await AsyncStorage.getItem("user");
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    ownUserID = urls[urls.length - 1];
    unsubscribe = chatRef
      .where("users", "array-contains", String(ownUserID))
      .onSnapshot((querySnapShot) => {
        querySnapShot.forEach((snapShot) => {
          if (snapShot && snapShot.exists) {
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
            let date = snapShot.data().lastMessageTime
              ? snapShot.data().lastMessageTime.split(":")
              : tmpCreatedAt.split(":");
            let tmpDay = date[2]; //message created at
            chatCheckBoxList.push({
              groupID: snapShot.id,
              checkBoxStatus: false,
            });
            getName(ownUserID, snapShot.data()).then(function (name) {
              if (tmpDay == today) {
                tmpChats.unshift({
                  checkBoxStatus: false,
                  groupID: snapShot.id,
                  groupName: name,
                  message: snapShot.data().message,
                  deleted: snapShot.data()["delete_" + ownUserID],
                });
                tmpChatHtml.unshift(
                  <TouchableWithoutFeedback
                    key={snapShot.id}
                    date={
                      snapShot.data().lastMessageTime
                        ? snapShot.data().lastMessageTime
                        : tmpCreatedAt
                    }
                    pinned={
                      snapShot.data()["pinned_" + ownUserID] ? true : false
                    }
                    hide={snapShot.data()["hide_" + ownUserID] ? true : false}
                    delete={
                      snapShot.data()["delete_" + ownUserID] ? true : false
                    }
                  >
                    <View style={styles.tabContainer}>
                      <Image style={styles.tabImage} />
                      <View style={styles.descriptionContainer}>
                        <Text style={styles.tabText}>{name}</Text>
                        <Text style={styles.tabText}>
                          {snapShot.data().message}
                        </Text>
                      </View>
                      <View style={styles.tabRightContainer}>
                        <CheckBox
                          color={Colors.E6DADE}
                          uncheckedColor={Colors.E6DADE}
                          disabled={false}
                          onValueChange={() => onValueChange(snapShot.id)}
                        />
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                );
              } else if (tmpDay == today - 1) {
                tmpChats.unshift({
                  checkBoxStatus: false,
                  groupID: snapShot.id,
                  groupName: name,
                  message: snapShot.data().message,
                  deleted: snapShot.data()["delete_" + ownUserID],
                });
                tmpChatHtml.unshift(
                  <TouchableWithoutFeedback
                    key={snapShot.id}
                    date={
                      snapShot.data().lastMessageTime
                        ? snapShot.data().lastMessageTime
                        : tmpCreatedAt
                    }
                    pinned={
                      snapShot.data()["pinned_" + ownUserID] ? true : false
                    }
                    hide={snapShot.data()["hide_" + ownUserID] ? true : false}
                    delete={
                      snapShot.data()["delete_" + ownUserID] ? true : false
                    }
                  >
                    <View style={styles.tabContainer}>
                      <Image style={styles.tabImage} />
                      <View style={styles.descriptionContainer}>
                        <Text style={styles.tabText}>{name}</Text>
                        <Text style={styles.tabText}>
                          {snapShot.data().message}
                        </Text>
                      </View>
                      <View style={styles.tabRightContainer}>
                        <CheckBox
                          color={Colors.E6DADE}
                          uncheckedColor={Colors.E6DADE}
                          disabled={false}
                          onValueChange={() => onValueChange(snapShot.id)}
                        />
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                );
              } else {
                tmpChats.unshift({
                  checkBoxStatus: false,
                  groupID: snapShot.id,
                  groupName: name,
                  message: snapShot.data().message,
                  deleted: snapShot.data()["delete_" + ownUserID],
                });
                tmpChatHtml.unshift(
                  <TouchableWithoutFeedback
                    key={snapShot.id}
                    date={
                      snapShot.data().lastMessageTime
                        ? snapShot.data().lastMessageTime
                        : tmpCreatedAt
                    }
                    pinned={
                      snapShot.data()["pinned_" + ownUserID] ? true : false
                    }
                    hide={snapShot.data()["hide_" + ownUserID] ? true : false}
                    delete={
                      snapShot.data()["delete_" + ownUserID] ? true : false
                    }
                  >
                    <View style={styles.tabContainer}>
                      <Image style={styles.tabImage} />
                      <View style={styles.descriptionContainer}>
                        <Text style={styles.tabText}>{name}</Text>
                        <Text style={styles.tabText}>
                          {snapShot.data().message}
                        </Text>
                      </View>
                      <View style={styles.tabRightContainer}>
                        <CheckBox
                          color={Colors.E6DADE}
                          uncheckedColor={Colors.E6DADE}
                          disabled={false}
                          onValueChange={() => onValueChange(snapShot.id)}
                        />
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                );
              }
              groupID.push(snapShot.id);

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
              });
              const resultChatHtml = tmpChatHtml.filter((html) => {
                return !html.props["hide"] && !html.props["delete"];
              });
              onChatHtmlChanged(resultChatHtml);
              onForwardChatHtmlChanged(processForwardChatHtml(tmpChats));
            });
          }
        });
      });
  }
  function processForwardChatHtml(items) {
    let tmpForwardChatHtml = [];
    items.map((chat) => {
      // if (chat.deleted == false) {
      tmpForwardChatHtml.push(
        <View style={styles.tabContainer} key={chat.groupID}>
          <Image style={styles.tabImage} />
          <View style={styles.descriptionContainer}>
            <Text style={styles.tabText}>{chat.groupName}</Text>
            <Text style={styles.tabText}>{chat.message}</Text>
          </View>
          <View style={styles.tabRightContainer}>
            <CheckBox
              color={Colors.E6DADE}
              uncheckedColor={Colors.E6DADE}
              disabled={false}
              value={chat.checkBoxStatus}
              onValueChange={() => onValueChange(chat.groupID)}
            />
          </View>
        </View>
      );
      // }
    });
    return tmpForwardChatHtml;
  }
  function onValueChange(groupID) {
    tmpChats = tmpChats.map((chat) => {
      if (chat.groupID == groupID) {
        if (chat.checkBoxStatus == true) {
          chat.checkBoxStatus = false;
        } else {
          chat.checkBoxStatus = true;
        }
      }
      return chat;
    });
    onForwardChatHtmlChanged(processForwardChatHtml(tmpChats));
  }
  function forwardMessage() {
    tmpChats.map((chat) => {
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
        db.collection("chat")
          .doc(chat.groupID)
          .collection("messages")
          .add({
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: messageToForward,
            userID: String(ownUserID),
            createdAt: createdAt,
          })
          .then(function () {
            props.navigation.pop();
          });
      }
    });
  }
  React.useEffect(() => {
    firstLoad();
    return function () {
      if (unsubscribe) {
        unsubscribe();
        onChatHtmlChanged([]);
        onForwardChatHtmlChanged([]);
        tmpChatHtml = [];
        tmpChats = [];
      }
    };
  }, []);

  return (
    <ScrollView>
      <CustomHeader
        text={Translate.t("chat")}
        onPress={() => props.navigation.navigate("Cart")}
        onBack={() => props.navigation.pop()}
        onFavoriteChanged="noFavorite"
      />
      <ScrollView>
        <View
          style={{
            marginHorizontal: widthPercentageToDP("4%"),
          }}
        >
          <TouchableWithoutFeedback onPress={() => forwardMessage()}>
            <Text
              style={{
                fontSize: RFValue(12),
                right: 0,
                position: "absolute",
                marginTop: heightPercentageToDP("2%"),
                marginRight: widthPercentageToDP("5%"),
              }}
            >
              {Translate.t("forward")}
            </Text>
          </TouchableWithoutFeedback>
          <View
            style={{
              width: widthPercentageToDP("30%"),
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
          </View>
          {forwardChatHtml}
        </View>
      </ScrollView>
    </ScrollView>
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
