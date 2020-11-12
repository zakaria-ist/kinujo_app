import React, { useEffect, useState } from "react";
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
} from "react-native";
import { Colors } from "../assets/Colors.js";
import RNFetchBlob from "rn-fetch-blob";
import { SafeAreaView } from "react-navigation";
import { LinearGradient } from "expo-linear-gradient";
import storage from "@react-native-firebase/storage";
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
let hour = new Date().getHours();
let minute = new Date().getMinutes();
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
export default function ChatScreen(props) {
  const [shouldShow, setShouldShow] = useState(false);
  const [loaded, onLoadedChanged] = useState(false);
  const [messages, setMessages] = React.useState("");
  const [chatHtml, onChatHtmlChanged] = React.useState(<View></View>);
  groupID = props.route.params.groupID;
  groupName = props.route.params.groupName;
  const handleBack = () => {
    chatsRef
      .doc(groupID)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          if (doc.id == groupID) {
            totalMessageCount = doc.data().totalMessage;
          }
        }
      })
      .then(function() {
        chatsRef.doc(groupID).update({
          [userTotalReadMessageField]: totalMessageCount,
        });
      });
    props.navigation.pop();
  };
  chatsRef
    .doc(groupID)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        if (doc.id == groupID) {
          totalMessageCount = doc.data().totalMessage;
        }
      }
    })
    .then(function() {
      chatsRef.doc(groupID).update({
        [userTotalReadMessageField]: totalMessageCount,
      });
    });
  AsyncStorage.getItem("user")
    .then(function(url) {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      userId = urls[urls.length - 1];
    })
    .then(function() {
      userTotalReadMessageField = "totalMessageRead_" + userId;
    });
  React.useEffect(() => {
    if (!loaded) {
      chatsRef.onSnapshot((querySnapShot) => {
        let seenMessageCount = [];
        querySnapShot.docChanges().forEach((snapShot) => {
          if (groupID == snapShot.doc.id) {
            let users = snapShot.doc.data().users;
            totalMessageCount = snapShot.doc.data().totalMessage;
            for (var i = 0; i < users.length; i++) {
              totalMessageSeenCount = "totalMessageRead_" + users[i];
              seenMessageCount.push(snapShot.doc.data()[totalMessageSeenCount]);
            }
            smallestSeenCount = seenMessageCount[0];
            for (var i = 1; i < seenMessageCount.length; i++) {
              if (smallestSeenCount > seenMessageCount[i]) {
                smallestSeenCount = seenMessageCount[i];
              }
            }
          }
        });
        tmpMessageCount = 0;
        chatsRef
          .doc(groupID)
          .collection("messages")
          .orderBy("timeStamp", "asc")
          .onSnapshot((querySnapShot) => {
            querySnapShot.docChanges().forEach((snapShot) => {
              let date = snapShot.doc.data().createdAt.split(":");
              let tmpMonth = date[1];
              let tmpDay = date[2]; //message created at
              let tmpHours = date[3];
              let tmpMinutes = date[4];
              let tmpMessageID = messageID.filter((item) => {
                return item == snapShot.doc.id;
              });
              if (tmpMessageID.length >= 1) {
                previousMessageDateToday = null;
                previousMessageDateYesterday = null;
                previousMessageDateElse = null;
                for (var i = 0; i < tmpChatHtml.length; i++) {
                  if (tmpChatHtml[i].key == snapShot.doc.id) {
                    tmpChatHtml.splice(i, 1); //find poisition delete
                  }
                }
                tmpChatHtml = _.without(tmpChatHtml, snapShot.doc.id);
              }
              ++tmpMessageCount;
              if (tmpDay == day) {
                tmpChatHtml.push(
                  <View key={snapShot.doc.id}>
                    {previousMessageDateToday == null ? (
                      <Text style={[styles.chat_date]}>{"Today"}</Text>
                    ) : (
                      <Text style={[styles.chat_date]}>{""}</Text>
                    )}
                    {/*///////////////////////////////////////*/}
                    {tmpMessageCount <= smallestSeenCount ? (
                      //seen area
                      snapShot.doc.data().userID == userId ? (
                        <ChatText
                          date={tmpHours + ":" + tmpMinutes}
                          isSelf="true"
                          seen="true"
                          text={snapShot.doc.data().message}
                        />
                      ) : (
                        <ChatText
                          date={tmpHours + ":" + tmpMinutes}
                          seen="true"
                          text={snapShot.doc.data().message}
                        />
                      )
                    ) : //unseen area
                    snapShot.doc.data().userID == userId ? (
                      <ChatText
                        date={tmpHours + ":" + tmpMinutes}
                        isSelf="true"
                        text={snapShot.doc.data().message}
                      />
                    ) : (
                      <ChatText
                        date={tmpHours + ":" + tmpMinutes}
                        text={snapShot.doc.data().message}
                      />
                    )}
                    {/*///////////////////////////////////////*/}
                  </View>
                );
                previousMessageDateToday = tmpDay;
              } else if (tmpDay == day - 1) {
                tmpChatHtml.push(
                  <View key={snapShot.doc.id}>
                    {previousMessageDateYesterday == null ? (
                      <Text style={[styles.chat_date]}>{"Yesterday"}</Text>
                    ) : (
                      <Text style={[styles.chat_date]}>{""}</Text>
                    )}
                    {/*///////////////////////////////////////*/}
                    {tmpMessageCount <= smallestSeenCount ? (
                      //seen area
                      snapShot.doc.data().userID == userId ? (
                        <ChatText
                          date={tmpHours + ":" + tmpMinutes}
                          isSelf="true"
                          seen="true"
                          text={snapShot.doc.data().message}
                        />
                      ) : (
                        <ChatText
                          date={tmpHours + ":" + tmpMinutes}
                          seen="true"
                          text={snapShot.doc.data().message}
                        />
                      )
                    ) : //unseen area
                    snapShot.doc.data().userID == userId ? (
                      <ChatText
                        date={tmpHours + ":" + tmpMinutes}
                        isSelf="true"
                        text={snapShot.doc.data().message}
                      />
                    ) : (
                      <ChatText
                        date={tmpHours + ":" + tmpMinutes}
                        text={snapShot.doc.data().message}
                      />
                    )}
                    {/*///////////////////////////////////////*/}
                  </View>
                );
                previousMessageDateYesterday = tmpDay;
              } else if (tmpDay != day && tmpDay != day - 1) {
                tmpChatHtml.push(
                  <View key={snapShot.doc.id}>
                    {previousMessageDateElse == null ? (
                      <Text style={[styles.chat_date]}>
                        {tmpMonth + "/" + tmpDay}
                      </Text>
                    ) : (
                      <Text style={[styles.chat_date]}>{""}</Text>
                    )}
                    {/*///////////////////////////////////////*/}
                    {tmpMessageCount <= smallestSeenCount ? (
                      //seen area
                      snapShot.doc.data().userID == userId ? (
                        <ChatText
                          date={tmpHours + ":" + tmpMinutes}
                          isSelf="true"
                          seen="true"
                          text={snapShot.doc.data().message}
                        />
                      ) : (
                        <ChatText
                          date={tmpHours + ":" + tmpMinutes}
                          seen="true"
                          text={snapShot.doc.data().message}
                        />
                      )
                    ) : //unseen area
                    snapShot.doc.data().userID == userId ? (
                      <ChatText
                        date={tmpHours + ":" + tmpMinutes}
                        isSelf="true"
                        text={snapShot.doc.data().message}
                      />
                    ) : (
                      <ChatText
                        date={tmpHours + ":" + tmpMinutes}
                        text={snapShot.doc.data().message}
                      />
                    )}
                    {/*///////////////////////////////////////*/}
                  </View>
                );
                previousMessageDateElse = tmpDay;
              }

              messageID.push(snapShot.doc.id);
            });
            onChatHtmlChanged(tmpChatHtml);
          });
      });
      onLoadedChanged(false);
    }
  }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height+1000"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          onBack={() => handleBack()}
          onFavoriteChanged="1"
          onPress={() => props.navigation.navigate("Cart")}
        />
        <CustomSecondaryHeader name={groupName} />
        <LinearGradient
          colors={[Colors.E4DBC0, Colors.C2A059]}
          start={[0, 0]}
          end={[1, 0.6]}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{
              width: "100%",
              paddingTop: 15,
              paddingBottom: heightPercentageToDP("3%"),
            }}
          >
            {chatHtml}
          </ScrollView>
        </LinearGradient>
        {/* Bottom Area */}
        <View
          style={{
            // position: "sticky",
            width: "100%",
            bottom: -2,
            left: 0,
            overflow: "hidden",
          }}
        >
          <View style={styles.input_bar}>
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
                  value={messages}
                  onChangeText={(value) => setMessages(value)}
                  placeholder="Type a message"
                  style={styles.user_text_input}
                ></TextInput>
                {/* <TouchableWithoutFeedback>
                  <View style={styles.user_emoji_input}>
                    <EmojiLogo
                      width={"100%"}
                      height={"100%"}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableWithoutFeedback> */}
              </View>
            </View>
            {/* SEND BUTTON */}
            <TouchableWithoutFeedback
              onPress={() => {
                let tmpMessage = messages;
                setMessages("");
                tmpMessage != ""
                  ? db
                      .collection("chat")
                      .doc(groupID)
                      .collection("messages")
                      .add({
                        userID: userId,
                        createdAt:
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
                          seconds,

                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                        message: tmpMessage,
                      })
                      .then(function() {
                        chatsRef
                          .doc(groupID)
                          .get()
                          .then(function(doc) {
                            if (doc.exists) {
                              if (doc.id == groupID) {
                                totalMessageCount = doc.data().totalMessage;
                              }
                            }
                          })
                          .then(function() {
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
                      RNFetchBlob.fs.stat(response.uri).then((stat) => {
                        reference
                          .putFile(stat.path)
                          .then((response) => {
                            alert.warning(JSON.stringify(response));
                          })
                          .catch((error) => {
                            alert.warning(JSON.stringify(error));
                          });
                      });
                    } else {
                      reference
                        .putFile(response.uri.replace("file://", ""))
                        .then((response) => {
                          alert.warning(response);
                        })
                        .catch((error) => {
                          alert.warning(error);
                        });
                    }
                  }
                });
              }}
            >
              <View style={styles.widget_box}>
                <CameraLogo style={styles.widget_icon} resizeMode="contain" />
                <Text>{"Camera"}</Text>
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
                            alert.warning(JSON.stringify(response));
                          })
                          .catch((error) => {
                            alert.warning(JSON.stringify(error));
                          });
                      });
                    } else {
                      reference
                        .putFile(response.uri.replace("file://", ""))
                        .then((response) => {
                          alert.warning(response);
                        })
                        .catch((error) => {
                          alert.warning(error);
                        });
                    }
                  }
                });
              }}
            >
              <View style={styles.widget_box}>
                <GalleryLogo style={styles.widget_icon} resizeMode="contain" />
                <Text>{"Gallery"}</Text>
              </View>
            </TouchableWithoutFeedback>
            {/* <View style={styles.widget_box}>
              <ContactLogo style={styles.widget_icon} resizeMode="contain" />
              <Text>{"Contact"}</Text>
            </View> */}
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
    height: heightPercentageToDP("8%"),
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
  user_text_input: {
    flexGrow: 1,
    color: "black",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingLeft: 15,
  },
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
