import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Switch,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Animated,
  Modal,
  ScrollView,
  Keyboard,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import { useIsFocused } from "@react-navigation/native";
import RNFetchBlob from "rn-fetch-blob";
import { SafeAreaView } from "react-navigation";
import { LinearGradient } from "expo-linear-gradient";
import EmojiBoard from "react-native-emoji-board";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import ImagePicker from "react-native-image-picker";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import ChatText from "./ChatText";
import ChatContact from "./ChatContact";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig.js";
import ArrowDownLogo from "../assets/icons/arrow_down.svg";
import PlusCircleLogo from "../assets/icons/plus_circle.svg";
import EmojiLogo from "../assets/icons/emoji.svg";
import SendLogo from "../assets/icons/send.svg";
import CameraLogo from "../assets/icons/camera.svg";
import GalleryLogo from "../assets/icons/gallery.svg";
import ContactLogo from "../assets/icons/contact.svg";
import _ from "lodash";
import CustomAlert from "../lib/alert";
import storage from "@react-native-firebase/storage";
const alert = new CustomAlert();
const { width } = Dimensions.get("window");
var uuid = require("react-native-uuid");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const chatsRef = db.collection("chat");
let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let day = new Date().getDate();
let hour = String(new Date().getHours()).padStart(2, "0");
let minute = String(new Date().getMinutes()).padStart(2, "0");
let seconds = new Date().getSeconds();
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
          db.collection("users").doc(user1).collection("friends").add({
            type: "user",
            id: user2,
          });
        }
      });
    updateFriend = true;
  }
}

export default function ChatScreen(props) {
  const [shouldShow, setShouldShow] = React.useState(false);
  const [loaded, onLoadedChanged] = React.useState(false);
  const [chatHtml, onChatHtmlChanged] = React.useState([]);
  const [messages, setMessages] = React.useState("");
  const [showEmoji, onShowEmojiChanged] = useState(false);
  const [prevEmoji, setPrevEmoji] = useState("");
  const [inputBarPosition, setInputBarPosition] = useState(-2);
  const scrollViewReference = useRef();
  const isFocused = useIsFocused();
  groupID = props.route.params.groupID;
  groupName = props.route.params.groupName;
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
  const [textInputHeight, setTextInputHeight] = React.useState(
    heightPercentageToDP("7%")
  );
  function handleEmojiIconPressed() {
    onShowEmojiChanged(true);
    setInputBarPosition(heightPercentageToDP("34%"));
    Keyboard.dismiss();
  }
  function hideEmoji() {
    onShowEmojiChanged(false);
    setInputBarPosition(-2);
  }
  async function firstLoad() {
    const updateHtml = [];
    onChatHtmlChanged(updateHtml);
    let url = await AsyncStorage.getItem("user");
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    userId = urls[urls.length - 1];
    userTotalReadMessageField = "totalMessageRead_" + userId;

    let documentSnapshot = await chatsRef.doc(groupID).get();
    if (documentSnapshot && documentSnapshot.data()) {
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

      unsubscribe = chatsRef
        .doc(groupID)
        .collection("messages")
        .orderBy("timeStamp", "asc")
        .onSnapshot((querySnapShot) => {
          querySnapShot.forEach((snapShot) => {
            if (snapShot && snapShot.exists) {
              const updateHtml = [];
              onChatHtmlChanged(updateHtml);
              let date = snapShot.data().createdAt.split(":");
              let tmpMonth = date[1];
              let tmpDay = date[2]; //message created at
              let tmpHours = date[3];
              let tmpMinutes = date[4];
              let tmpMessageID = messageID.filter((item) => {
                return item == snapShot.id;
              });

              if (tmpMessageID.length >= 1) {
                // tmpChatHtml = tmpChatHtml.filter((html) => {
                //   return html.key != snapShot.id;
                // })
                // tmpChatHtml = _.without(tmpChatHtml, snapShot.id);
              }
              ++tmpMessageCount;
              let found =
                tmpChatHtml.filter((html) => {
                  return html.key == snapShot.id;
                }).length > 0;

              if (!found) {
                if (tmpDay == day) {
                  tmpChatHtml.push(
                    <View key={snapShot.id}>
                      {previousMessageDateToday == null ? (
                        <Text style={[styles.chat_date]}>
                          {Translate.t("today")}
                        </Text>
                      ) : (
                        <Text style={[styles.chat_date]}>{""}</Text>
                      )}
                      {/*///////////////////////////////////////*/}
                      {tmpMessageCount <= smallestSeenCount ? (
                        //seen area
                        snapShot.data().userID == userId ? (
                          snapShot.data().image == null ? (
                            snapShot.data().contactID == null ? (
                              <ChatText
                                date={tmpHours + ":" + tmpMinutes}
                                isSelf="true"
                                seen="true"
                                text={snapShot.data().message}
                              />
                            ) : (
                              <ChatContact
                                date={tmpHours + ":" + tmpMinutes}
                                seen="true"
                                isSelf="true"
                                contactName={snapShot.data().contactName}
                              />
                            )
                          ) : (
                            <ChatText
                              date={tmpHours + ":" + tmpMinutes}
                              isSelf="true"
                              seen="true"
                              imageURL={snapShot.data().image}
                            />
                          )
                        ) : snapShot.data().image == null ? (
                          snapShot.data().contactID == null ? (
                            <ChatText
                              date={tmpHours + ":" + tmpMinutes}
                              seen="true"
                              text={snapShot.data().message}
                            />
                          ) : (
                            <ChatContact
                              date={tmpHours + ":" + tmpMinutes}
                              isSelf="true"
                              seen="true"
                              contactName={snapShot.data().contactName}
                            />
                          )
                        ) : (
                          <ChatText
                            date={tmpHours + ":" + tmpMinutes}
                            seen="true"
                            imageURL={snapShot.data().image}
                          />
                        )
                      ) : //unseen area
                      snapShot.data().userID == userId ? (
                        snapShot.data().image == null ? (
                          snapShot.data().contactID == null ? (
                            <ChatText
                              date={tmpHours + ":" + tmpMinutes}
                              isSelf="true"
                              text={snapShot.data().message}
                            />
                          ) : (
                            <ChatContact
                              date={tmpHours + ":" + tmpMinutes}
                              isSelf="true"
                              contactName={snapShot.data().contactName}
                            />
                          )
                        ) : (
                          <ChatText
                            date={tmpHours + ":" + tmpMinutes}
                            isSelf="true"
                            imageURL={snapShot.data().image}
                          />
                        )
                      ) : snapShot.data().image == null ? (
                        snapShot.data().contactID == null ? (
                          <ChatText
                            date={tmpHours + ":" + tmpMinutes}
                            text={snapShot.data().message}
                          />
                        ) : (
                          <ChatContact
                            date={tmpHours + ":" + tmpMinutes}
                            isSelf="true"
                            contactName={snapShot.data().contactName}
                          />
                        )
                      ) : (
                        <ChatText
                          date={tmpHours + ":" + tmpMinutes}
                          imageURL={snapShot.data().image}
                        />
                      )}
                      {/*///////////////////////////////////////*/}
                    </View>
                  );
                  previousMessageDateToday = tmpDay;
                } else if (tmpDay == day - 1) {
                  tmpChatHtml.push(
                    <View key={snapShot.id}>
                      {previousMessageDateYesterday == null ? (
                        <Text style={[styles.chat_date]}>
                          {Translate.t("yesterday")}
                        </Text>
                      ) : (
                        <Text style={[styles.chat_date]}>{""}</Text>
                      )}
                      {/*///////////////////////////////////////*/}
                      {tmpMessageCount <= smallestSeenCount ? (
                        //seen area
                        snapShot.data().userID == userId ? (
                          snapShot.data().image == null ? (
                            snapShot.data().contactID == null ? (
                              <ChatText
                                date={tmpHours + ":" + tmpMinutes}
                                isSelf="true"
                                seen="true"
                                text={snapShot.data().message}
                              />
                            ) : (
                              <TouchableWithoutFeedback
                                onPress={() =>
                                  console.log(snapShot.data().contactName)
                                }
                              >
                                <ChatContact
                                  date={tmpHours + ":" + tmpMinutes}
                                  seen="true"
                                  isSelf="true"
                                  contactName={snapShot.data().contactName}
                                />
                              </TouchableWithoutFeedback>
                            )
                          ) : (
                            <ChatText
                              date={tmpHours + ":" + tmpMinutes}
                              isSelf="true"
                              seen="true"
                              imageURL={snapShot.data().image}
                            />
                          )
                        ) : snapShot.data().image == null ? (
                          snapShot.data().contactID == null ? (
                            <ChatText
                              date={tmpHours + ":" + tmpMinutes}
                              seen="true"
                              text={snapShot.data().message}
                            />
                          ) : (
                            <ChatContact
                              date={tmpHours + ":" + tmpMinutes}
                              seen="true"
                              isSelf="true"
                              contactName={snapShot.data().contactName}
                            />
                          )
                        ) : (
                          <ChatText
                            date={tmpHours + ":" + tmpMinutes}
                            seen="true"
                            imageURL={snapShot.data().image}
                          />
                        )
                      ) : //unseen area
                      snapShot.data().userID == userId ? (
                        snapShot.data().image == null ? (
                          snapShot.data().contactID == null ? (
                            <ChatText
                              date={tmpHours + ":" + tmpMinutes}
                              isSelf="true"
                              text={snapShot.data().message}
                            />
                          ) : (
                            <ChatContact
                              date={tmpHours + ":" + tmpMinutes}
                              isSelf="true"
                              contactName={snapShot.data().contactName}
                            />
                          )
                        ) : (
                          <ChatText
                            date={tmpHours + ":" + tmpMinutes}
                            isSelf="true"
                            imageURL={snapShot.data().image}
                          />
                        )
                      ) : snapShot.data().image == null ? (
                        snapShot.data().contactID == null ? (
                          <ChatText
                            date={tmpHours + ":" + tmpMinutes}
                            text={snapShot.data().message}
                          />
                        ) : (
                          <ChatContact
                            date={tmpHours + ":" + tmpMinutes}
                            isSelf="true"
                            contactName={snapShot.data().contactName}
                          />
                        )
                      ) : (
                        <ChatText
                          date={tmpHours + ":" + tmpMinutes}
                          imageURL={snapShot.data().image}
                        />
                      )}
                      {/*///////////////////////////////////////*/}
                    </View>
                  );
                  previousMessageDateYesterday = tmpDay;
                } else if (tmpDay != day && tmpDay != day - 1) {
                  tmpChatHtml.push(
                    <View key={snapShot.id}>
                      {previousMessageDateElse ==
                      snapShot.data().timeStamp.toDate().toDateString() ? (
                        <Text style={[styles.chat_date]}>{""}</Text>
                      ) : (
                        <Text style={[styles.chat_date]}>
                          {tmpMonth + "/" + tmpDay}
                        </Text>
                      )}
                      {/*///////////////////////////////////////*/}
                      {tmpMessageCount <= smallestSeenCount ? (
                        //seen area
                        snapShot.data().userID == userId ? (
                          snapShot.data().image == null ? (
                            snapShot.data().contactID == null ? (
                              <ChatText
                                date={tmpHours + ":" + tmpMinutes}
                                isSelf="true"
                                seen="true"
                                text={snapShot.data().message}
                              />
                            ) : (
                              <ChatContact
                                date={tmpHours + ":" + tmpMinutes}
                                seen="true"
                                isSelf="true"
                                contactName={snapShot.data().contactName}
                              />
                            )
                          ) : (
                            <ChatText
                              date={tmpHours + ":" + tmpMinutes}
                              isSelf="true"
                              seen="true"
                              imageURL={snapShot.data().image}
                            />
                          )
                        ) : snapShot.data().image == null ? (
                          snapShot.data().contactID == null ? (
                            <ChatText
                              date={tmpHours + ":" + tmpMinutes}
                              seen="true"
                              text={snapShot.data().message}
                            />
                          ) : (
                            <ChatContact
                              date={tmpHours + ":" + tmpMinutes}
                              seen="true"
                              isSelf="true"
                              contactName={snapShot.data().contactName}
                            />
                          )
                        ) : (
                          <ChatText
                            date={tmpHours + ":" + tmpMinutes}
                            seen="true"
                            imageURL={snapShot.data().image}
                          />
                        )
                      ) : //unseen area
                      snapShot.data().userID == userId ? (
                        snapShot.data().image == null ? (
                          snapShot.data().contactID == null ? (
                            <ChatText
                              date={tmpHours + ":" + tmpMinutes}
                              isSelf="true"
                              text={snapShot.data().message}
                            />
                          ) : (
                            <ChatContact
                              date={tmpHours + ":" + tmpMinutes}
                              isSelf="true"
                              contactName={snapShot.data().contactName}
                            />
                          )
                        ) : (
                          <ChatText
                            date={tmpHours + ":" + tmpMinutes}
                            isSelf="true"
                            imageURL={snapShot.data().image}
                          />
                        )
                      ) : snapShot.data().image == null ? (
                        snapShot.data().contactID == null ? (
                          <ChatText
                            date={tmpHours + ":" + tmpMinutes}
                            text={snapShot.data().message}
                          />
                        ) : (
                          <ChatContact
                            date={tmpHours + ":" + tmpMinutes}
                            isSelf="true"
                            contactName={snapShot.data().contactName}
                          />
                        )
                      ) : (
                        <ChatText
                          date={tmpHours + ":" + tmpMinutes}
                          imageURL={snapShot.data().image}
                        />
                      )}
                      {/*///////////////////////////////////////*/}
                    </View>
                  );

                  previousMessageDateElse = snapShot
                    .data()
                    .timeStamp.toDate()
                    .toDateString();
                }
              }
              messageID.push(snapShot.id);
              onChatHtmlChanged(tmpChatHtml);
            }
          });
        });
    }
  }

  React.useEffect(() => {
    firstLoad();
    chatsRef
      .doc(groupID)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          if (doc.id == groupID) {
            totalMessageCount = doc.data().totalMessage;
          }
        }
      })
      .then(function () {
        chatsRef.doc(groupID).update({
          [userTotalReadMessageField]: totalMessageCount,
        });
      });

    chatsRef
      .doc(groupID)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          if (doc.id == groupID) {
            totalMessageCount = doc.data().totalMessage;
          }
        }
      })
      .then(function () {
        chatsRef.doc(groupID).update({
          [userTotalReadMessageField]: totalMessageCount,
        });
      });

    return function () {
      if (unsubscribe) {
        chatsRef
          .doc(groupID)
          .get()
          .then(function (doc) {
            if (doc.exists) {
              if (doc.id == groupID) {
                totalMessageCount = doc.data().totalMessage;
              }
            }
          })
          .then(function () {
            chatsRef.doc(groupID).update({
              [userTotalReadMessageField]: totalMessageCount,
            });
          });
        unsubscribe();
        onChatHtmlChanged([]);
        tmpChatHtml = [];
      }
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height+1000"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          text={Translate.t("chat")}
          onBack={() => props.navigation.pop()}
          onFavoritePress={() => props.navigation.navigate("Favorite")}
          onPress={() => props.navigation.navigate("Cart")}
        />
        <EmojiBoard
          showBoard={showEmoji}
          style={{
            height: heightPercentageToDP("30%"),
            marginBottom: heightPercentageToDP("10%"),
          }}
          onClick={onClick}
          onRemove={onRemove}
        />
        <CustomSecondaryHeader name={groupName} />
        <LinearGradient
          colors={[Colors.E4DBC0, Colors.C2A059]}
          start={[0, 0]}
          end={[1, 0.6]}
          style={{ flex: 1 }}
        >
          <ScrollView
            ref={scrollViewReference}
            onContentSizeChange={() =>
              scrollViewReference.current.scrollToEnd({ animated: true })
            }
            style={{
              width: "100%",
              paddingTop: heightPercentageToDP("1%"),
              paddingBottom: heightPercentageToDP("5%"),
            }}
          >
            {chatHtml}
          </ScrollView>
        </LinearGradient>
        {/* Bottom Area */}
        <View
          style={{
            width: "100%",
            bottom: inputBarPosition,
            left: 0,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: textInputHeight,
              backgroundColor: "#F0EEE9",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.input_bar_file}>
              <TouchableWithoutFeedback
                onPress={() => setShouldShow(!shouldShow)}
              >
                {shouldShow ? (
                  <ArrowDownLogo
                    width={"100%"}
                    height={"100%"}
                    resizeMode="contain"
                  />
                ) : (
                  <PlusCircleLogo
                    width={"100%"}
                    height={"100%"}
                    resizeMode="contain"
                  />
                )}
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.input_bar_text}>
              <View style={styles.input_bar_text_border}>
                <TextInput
                  // onContentSizeChange={(e) =>
                  //   setTextInputHeight(
                  //     textInputHeight + heightPercentageToDP("0.5%")
                  //   )
                  // }
                  onFocus={() => hideEmoji()}
                  onBlur={() => hideEmoji()}
                  multiline={true}
                  value={messages}
                  onChangeText={(value) => setMessages(value)}
                  placeholder="Type a message"
                  style={{
                    width: widthPercentageToDP("15%"),
                    flexGrow: 1,
                    color: "black",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    paddingLeft: 15,
                  }}
                ></TextInput>

                <TouchableWithoutFeedback
                  onPress={() => handleEmojiIconPressed()}
                >
                  <View style={styles.user_emoji_input}>
                    <EmojiLogo
                      width={"100%"}
                      height={"100%"}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            {/* SEND BUTTON */}
            <TouchableWithoutFeedback
              onPress={() => {
                let tmpMessage = messages;
                setMessages("");
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

                tmpMessage != ""
                  ? db
                      .collection("chat")
                      .doc(groupID)
                      .collection("messages")
                      .add({
                        userID: userId,
                        createdAt: createdAt,
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                        message: tmpMessage,
                      })
                      .then(function () {
                        db.collection("chat").doc(groupID).set(
                          {
                            message: tmpMessage,
                            lastMessageTime: createdAt,
                          },
                          {
                            merge: true,
                          }
                        );

                        chatsRef
                          .doc(groupID)
                          .get()
                          .then(function (doc) {
                            totalMessageCount = doc.data().totalMessage;
                          })
                          .then(function () {
                            chatsRef.doc(groupID).update({
                              totalMessage: totalMessageCount + 1,
                            });
                          });
                      })
                  : null;
              }}
            >
              <View style={styles.input_bar_send}>
                <SendLogo width={"100%"} height={"100%"} resizeMode="contain" />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Animated.View
            style={[shouldShow ? styles.input_bar_widget : styles.none]}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                const options = {
                  noData: true,
                  mediaType: "photo",
                };
                ImagePicker.launchCamera(options, (response) => {
                  if (response.uri) {
                    const reference = storage().ref(uuid.v4() + ".png");
                    if (Platform.OS === "android") {
                      RNFetchBlob.fs.stat(response.path).then((stat) => {
                        reference
                          .putFile(stat.path)
                          .then((response) => {
                            reference.getDownloadURL().then((url) => {
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

                              chatsRef
                                .doc(groupID)
                                .collection("messages")
                                .add({
                                  userID: userId,
                                  createdAt: createdAt,
                                  message: "Photo",
                                  timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                                  image: url,
                                })
                                .then(function () {
                                  db.collection("chat").doc(groupID).set(
                                    {
                                      message: "Photo",
                                      lastMessageTime: createdAt,
                                    },
                                    {
                                      merge: true,
                                    }
                                  );

                                  chatsRef
                                    .doc(groupID)
                                    .get()
                                    .then(function (doc) {
                                      totalMessageCount = doc.data()
                                        .totalMessage;
                                    })
                                    .then(function () {
                                      chatsRef.doc(groupID).update({
                                        totalMessage: totalMessageCount + 1,
                                      });
                                    });
                                });
                            });
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      });
                    } else {
                      reference
                        .putFile(response.path.replace("file://", ""))
                        .then((response) => {
                          reference.getDownloadURL().then((url) => {
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

                            chatsRef
                              .doc(groupID)
                              .collection("messages")
                              .add({
                                userID: userId,
                                createdAt: createdAt,
                                message: "Photo",
                                timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                                image: url,
                              })
                              .then(function () {
                                db.collection("chat").doc(groupID).set(
                                  {
                                    message: "Photo",
                                    lastMessageTime: createdAt,
                                  },
                                  {
                                    merge: true,
                                  }
                                );
                                chatsRef
                                  .doc(groupID)
                                  .get()
                                  .then(function (doc) {
                                    totalMessageCount = doc.data().totalMessage;
                                  })
                                  .then(function () {
                                    chatsRef.doc(groupID).update({
                                      totalMessage: totalMessageCount + 1,
                                    });
                                  });
                              });
                          });
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }
                  }
                });
              }}
            >
              <View style={styles.widget_box}>
                <CameraLogo style={styles.widget_icon} resizeMode="contain" />
                <Text style={{ fontSize: RFValue(11) }}>
                  {Translate.t("camera")}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                const options = {
                  noData: true,
                };
                ImagePicker.launchImageLibrary(options, (response) => {
                  if (response.uri) {
                    const reference = storage().ref(uuid.v4() + ".png");
                    if (Platform.OS === "android") {
                      RNFetchBlob.fs.stat(response.uri).then((stat) => {
                        reference
                          .putFile(stat.path)
                          .then((response) => {
                            reference.getDownloadURL().then((url) => {
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

                              chatsRef
                                .doc(groupID)
                                .collection("messages")
                                .add({
                                  userID: userId,
                                  createdAt: createdAt,
                                  message: "Photo",
                                  timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                                  image: url,
                                })
                                .then(function () {
                                  db.collection("chat").doc(groupID).set(
                                    {
                                      message: "Photo",
                                      lastMessageTime: createdAt,
                                    },
                                    {
                                      merge: true,
                                    }
                                  );
                                  chatsRef
                                    .doc(groupID)
                                    .get()
                                    .then(function (doc) {
                                      totalMessageCount = doc.data()
                                        .totalMessage;
                                    })
                                    .then(function () {
                                      chatsRef.doc(groupID).update({
                                        totalMessage: totalMessageCount + 1,
                                      });
                                    });
                                });
                            });
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      });
                    } else {
                      reference
                        .putFile(response.uri.replace("file://", ""))
                        .then((response) => {
                          reference.getDownloadURL().then((url) => {
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

                            chatsRef
                              .doc(groupID)
                              .collection("messages")
                              .add({
                                userID: userId,
                                createdAt: createdAt,
                                message: "Photo",
                                timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                                image: url,
                              })
                              .then(function () {
                                db.collection("chat").doc(groupID).set(
                                  {
                                    message: "Photo",
                                    lastMessageTime: createdAt,
                                  },
                                  {
                                    merge: true,
                                  }
                                );

                                chatsRef
                                  .doc(groupID)
                                  .get()
                                  .then(function (doc) {
                                    totalMessageCount = doc.data().totalMessage;
                                  })
                                  .then(function () {
                                    chatsRef.doc(groupID).update({
                                      totalMessage: totalMessageCount + 1,
                                    });
                                  });
                              });
                          });
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }
                  }
                });
              }}
            >
              <View style={styles.widget_box}>
                <GalleryLogo style={styles.widget_icon} resizeMode="contain" />
                <Text style={{ fontSize: RFValue(11) }}>
                  {Translate.t("gallery")}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() =>
                props.navigation.navigate("ContactShare", {
                  groupID: groupID,
                })
              }
            >
              <View style={styles.widget_box}>
                <ContactLogo style={styles.widget_icon} resizeMode="contain" />
                <Text style={{ fontSize: RFValue(11) }}>
                  {Translate.t("contact")}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    height: heightPercentageToDP("6%"),
    width: heightPercentageToDP("6%"),
    fontSize: RFValue(10),
    padding: 10,
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
});
