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
import "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig.js";
import { block } from "react-native-reanimated";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const chatRef = db.collection("chat");
const win = Dimensions.get("window");
let tmpChatHtml = [];
let groupID = [];
let today = new Date().getDate();
let lastReadDateField;
let unseenMessageCountField;
let ownUserID;
let lastReadDate;
let totalUnseenMessage = 0;
let unseenObj = [];
export default function ChatList(props) {
  const [show, onShowChanged] = React.useState(false);
  const [loaded, onLoadedChanged] = useState(false);
  const [chatHtml, onChatHtmlChanged] = React.useState(<View></View>);
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
  React.useEffect(() => {
    //where change
    AsyncStorage.getItem("user")
      .then(function(url) {
        let urls = url.split("/");
        urls = urls.filter((url) => {
          return url;
        });
        ownUserID = urls[urls.length - 1];
      })
      .then((res) => {
        if (!loaded) {
          lastReadDateField = "lastReadDate_" + ownUserID;
          unseenMessageCountField = "unseenMessageCount_" + ownUserID;
          chatRef
            .where("users", "array-contains", String(ownUserID))
            .onSnapshot((querySnapShot) => {
              querySnapShot.docChanges().forEach((snapShot) => {
                totalUnseenMessage = 0;
                totalUnseenMessage =
                  snapShot.doc.data()[unseenMessageCountField] +
                  totalUnseenMessage;
                unseenObj[snapShot.doc.id] = totalUnseenMessage;

                chatRef
                  .doc(snapShot.doc.id)
                  .collection("messages")
                  .orderBy("timeStamp", "asc")
                  .onSnapshot((querySnapShot1) => {
                    querySnapShot1.docChanges().forEach((snapShot1) => {
                      let tmpGroupID = groupID.filter((item) => {
                        return item == snapShot.doc.id;
                      });
                      if (tmpGroupID.length >= 1) {
                        for (var i = 0; i < tmpChatHtml.length; i++) {
                          if (tmpChatHtml[i].key == snapShot.doc.id) {
                            tmpChatHtml.splice(i, 1); //find poisition delete
                          }
                        }
                        tmpChatHtml = _.without(tmpChatHtml, snapShot.doc.id);
                      }
                      getUnseenMessageCount(snapShot.doc.id, ownUserID);
                      let date = snapShot1.doc.data().createdAt.split(":");
                      let tmpMonth = date[1];
                      let tmpDay = date[2]; //message created at
                      let tmpHours = date[3];
                      let tmpMinutes = date[4];
                      lastReadDate = snapShot.doc.data()[lastReadDateField];
                      if (tmpDay == today) {
                        tmpChatHtml.unshift(
                          <TouchableWithoutFeedback
                            key={snapShot.doc.id}
                            onPress={() =>
                              props.navigation.navigate("ChatScreen", {
                                groupID: snapShot.doc.id,
                                groupName: snapShot.doc.data().groupName,
                              })
                            }
                            onLongPress={() => onShowChanged(true)}
                          >
                            <View style={styles.tabContainer}>
                              <Image style={styles.tabImage} />
                              <View style={styles.descriptionContainer}>
                                <Text style={styles.tabText}>
                                  {snapShot.doc.data().groupName}
                                </Text>
                                <Text style={styles.tabText}>
                                  {snapShot1.doc.data().message}
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
                                <View
                                  style={styles.notificationNumberContainer}
                                >
                                  <Text style={styles.notificationNumberText}>
                                    {
                                      snapShot.doc.data()[
                                        unseenMessageCountField
                                      ]
                                    }
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                        );
                      } else if (tmpDay == today - 1) {
                        tmpChatHtml.unshift(
                          <TouchableWithoutFeedback
                            key={snapShot.doc.id}
                            onPress={() =>
                              props.navigation.navigate("ChatScreen", {
                                groupID: snapShot.doc.id,
                                groupName: snapShot.doc.data().groupName,
                              })
                            }
                            onLongPress={() => onShowChanged(true)}
                          >
                            <View style={styles.tabContainer}>
                              <Image style={styles.tabImage} />
                              <View style={styles.descriptionContainer}>
                                <Text style={styles.tabText}>
                                  {snapShot.doc.data().groupName}
                                </Text>
                                <Text style={styles.tabText}>
                                  {snapShot1.doc.data().message}
                                </Text>
                              </View>
                              <View style={styles.tabRightContainer}>
                                {tmpDay == today - 1 ? (
                                  <Text style={styles.tabText}>
                                    {"Yesterday"}
                                  </Text>
                                ) : (
                                  <Text style={styles.tabText}>
                                    {tmpMonth + "/" + tmpDay}
                                  </Text>
                                )}
                                <View
                                  style={styles.notificationNumberContainer}
                                >
                                  <Text style={styles.notificationNumberText}>
                                    {
                                      snapShot.doc.data()[
                                        unseenMessageCountField
                                      ]
                                    }
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                        );
                      } else {
                        tmpChatHtml.unshift(
                          <TouchableWithoutFeedback
                            key={snapShot.doc.id}
                            onPress={() =>
                              props.navigation.navigate("ChatScreen", {
                                groupID: snapShot.doc.id,
                                groupName: snapShot.doc.data().groupName,
                              })
                            }
                            onLongPress={() => onShowChanged(true)}
                          >
                            <View style={styles.tabContainer}>
                              <Image style={styles.tabImage} />
                              <View style={styles.descriptionContainer}>
                                <Text style={styles.tabText}>
                                  {snapShot.doc.data().groupName}
                                </Text>
                                <Text style={styles.tabText}>
                                  {snapShot1.doc.data().message}
                                </Text>
                              </View>
                              <View style={styles.tabRightContainer}>
                                <Text style={styles.tabText}>
                                  {tmpMonth + "/" + tmpDay}
                                </Text>
                                <View
                                  style={styles.notificationNumberContainer}
                                >
                                  <Text style={styles.notificationNumberText}>
                                    {
                                      snapShot.doc.data()[
                                        unseenMessageCountField
                                      ]
                                    }
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                        );
                      }
                      groupID.push(snapShot.doc.id);
                    });
                    onChatHtmlChanged(tmpChatHtml);
                  });

                totalUnseenMessage = 0;
                for (var i in unseenObj) {
                  totalUnseenMessage += unseenObj[i];
                }
              });
            });

          onLoadedChanged(true);
        }
      });
  });

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
                  onPress={() => props.navigation.navigate("GroupChatCreation")}
                >
                  <Text style={styles.longPressText}>グルチャ作成</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => props.navigation.navigate("CreateFolder")}
                >
                  <Text style={styles.longPressText}>フォルダ作成</Text>
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
            <View style={styles.notificationNumberContainer}>
              <Text style={styles.notificationNumberText}>
                {totalUnseenMessage}
              </Text>
            </View>
          </View>
          <View>{chatHtml}</View>
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
