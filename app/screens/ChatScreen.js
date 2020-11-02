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
} from "react-native";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import ChatImage from "./ChatImage";
import ChatText from "./ChatText";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig.js";
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const { leftMessageBackground } = "#fff";
const { rightMessageBackground } = "#a0e75a";
//firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const chatRef = db.collection("chat");
const chatsRef = db.collection("chat").doc("W8Ybmjy1wXlqIQDk34qd");
let count = 0;
let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let day = new Date().getDate();
let hour = new Date().getHours();
let minute = new Date().getMinutes();
let seconds = new Date().getSeconds();
let miliSeconds = new Date().getMilliseconds();
let userId;

export default function ChatScreen(props) {
  const [shouldShow, setShouldShow] = useState(false);
  const [loaded, onLoadedChanged] = useState(false);
  const [messages, setMessages] = React.useState("");
  const [chatHtml, onChatHtmlChanged] = React.useState(<View></View>);
  const [state, setState] = React.useState();
  AsyncStorage.getItem("user").then(function (url) {
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    userId = urls[urls.length - 1];
  });

  function showChat() {
    let previousDayDate;
    let tmpChatHtml = [];
    chatsRef
      .collection("messages")
      .orderBy("timeStamp")
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((snapShot) => {
          setState(snapShot);
          let date = ([] = snapShot.doc.data().createdAt.split(":"));
          let tmpMonth = date[1];
          let tmpDay = date[2]; //message created at
          let tmpHours = date[3];
          let tmpMinutes = date[4];
          let tmpUserID = snapShot.doc.data().userID;
          if (snapShot.type === "added") {
            if (previousDayDate == null) {
              tmpChatHtml.push(
                <View
                  key={count}
                  style={{
                    width: "100%",
                    overflow: "auto",
                    paddingTop: 15,
                    paddingBottom: heightPercentageToDP("3%"),
                  }}
                >
                  <View>
                    {tmpDay == day ? (
                      <Text style={[styles.chat_date]}>{"Today"}</Text>
                    ) : (
                      <Text style={[styles.chat_date]}>
                        {tmpMonth + "/" + tmpDay}
                      </Text>
                    )}
                    {tmpUserID == userId ? (
                      <ChatText
                        isSelf="1"
                        text={snapShot.doc.data().message}
                        date={tmpHours + ":" + tmpMinutes}
                      />
                    ) : (
                      <ChatText
                        isSelf=""
                        text={snapShot.doc.data().message}
                        date={tmpHours + ":" + tmpMinutes}
                      />
                    )}
                  </View>
                </View>
              );
              previousDayDate = tmpDay;
            } else if (previousDayDate != null && tmpDay == day) {
              tmpChatHtml.push(
                <View
                  key={count}
                  style={{
                    width: "100%",
                    overflow: "auto",
                    paddingTop: 15,
                    paddingBottom: heightPercentageToDP("3%"),
                  }}
                >
                  <View>
                    {previousDayDate == tmpDay ? (
                      <Text style={[styles.chat_date]}>{""}</Text>
                    ) : (
                      <Text style={[styles.chat_date]}>{"Today"}</Text>
                    )}

                    {tmpUserID == userId ? (
                      <ChatText
                        isSelf="1"
                        text={snapShot.doc.data().message}
                        date={tmpHours + ":" + tmpMinutes}
                      />
                    ) : (
                      <ChatText
                        isSelf=""
                        text={snapShot.doc.data().message}
                        date={tmpHours + ":" + tmpMinutes}
                      />
                    )}
                  </View>
                </View>
              );
              previousDayDate = tmpDay;
            } else if (previousDayDate != null && tmpDay != day) {
              tmpChatHtml.push(
                <View
                  key={count}
                  style={{
                    width: "100%",
                    overflow: "auto",
                    paddingTop: 15,
                    paddingBottom: heightPercentageToDP("3%"),
                  }}
                >
                  <View>
                    {previousDayDate == tmpDay ? (
                      <Text style={[styles.chat_date]}>{""}</Text>
                    ) : (
                      <Text style={[styles.chat_date]}>
                        {tmpMonth + "/" + tmpDay}
                      </Text>
                    )}
                    {tmpUserID == userId ? (
                      <ChatText
                        isSelf="1"
                        text={snapShot.doc.data().message}
                        date={tmpHours + ":" + tmpMinutes}
                      />
                    ) : (
                      <ChatText
                        isSelf=""
                        text={snapShot.doc.data().message}
                        date={tmpHours + ":" + tmpMinutes}
                      />
                    )}
                  </View>
                </View>
              );
              previousDayDate = tmpDay;
            }
          }
          count++;
        });
      });
    console.log(tmpChatHtml);
    return tmpChatHtml;
  }
  if (!loaded) {
    onChatHtmlChanged(showChat());
    onLoadedChanged(true);
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          onFavoriteChanged="1"
          onBack={() => props.navigation.pop()}
          onPress={() => props.navigation.navigate("Cart")}
        />
        <CustomSecondaryHeader name="髪長絹子 さん" />
        <LinearGradient
          colors={[Colors.E4DBC0, Colors.C2A059]}
          start={[0, 0]}
          end={[1, 0.6]}
          style={{ flex: 1 }}
        >
          {chatHtml}
        </LinearGradient>
        {/* Bottom Area */}
        <View
          style={{
            position: "sticky",
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
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={
                    shouldShow
                      ? require("../assets/icons/arrow_down.svg")
                      : require("../assets/icons/plus_circle.svg")
                  }
                  resizeMode="contain"
                />
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

                <View style={styles.user_emoji_input}>
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={require("../assets/icons/emoji.svg")}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
            {/* SEND BUTTON */}
            <TouchableWithoutFeedback
              onPress={() => {
                let tmpMessage = messages;
                setMessages("");
                tmpMessage != null
                  ? db
                      .collection("chat")
                      .doc("W8Ybmjy1wXlqIQDk34qd")
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
                          seconds +
                          ":" +
                          miliSeconds,
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                        message: tmpMessage,
                      })
                  : null;
              }}
            >
              <View style={styles.input_bar_send}>
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={require("../assets/icons/send.svg")}
                  resizeMode="contain"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Animated.View
            style={[shouldShow ? styles.input_bar_widget : styles.none]}
          >
            <View style={styles.widget_box}>
              <Image
                style={styles.widget_icon}
                source={require("../assets/icons/camera.svg")}
                resizeMode="contain"
              />
              <Text>{"Camera"}</Text>
            </View>
            <View style={styles.widget_box}>
              <Image
                style={styles.widget_icon}
                source={require("../assets/icons/gallery.svg")}
                resizeMode="contain"
              />
              <Text>{"Gallery"}</Text>
            </View>
            <View style={styles.widget_box}>
              <Image
                style={styles.widget_icon}
                source={require("../assets/icons/contact.svg")}
                resizeMode="contain"
              />
              <Text>{"Contact"}</Text>
            </View>
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
    height: heightPercentageToDP("6%"),
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
