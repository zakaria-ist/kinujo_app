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
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig.js";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const chatRef = db.collection("chat");
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
let tmpChatHtml = [];
export default function ChatList(props) {
  const [show, onShowChanged] = React.useState(false);
  const [loaded, onLoadedChanged] = useState(false);
  const [chatHtml, onChatHtmlChanged] = React.useState(<View></View>);
  const [state, setState] = React.useState(false);
  React.useEffect(() => {
    AsyncStorage.getItem("user").then(function (url) {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      let userId = urls[urls.length - 1];
      if (!loaded) {
        chatRef
          .where("users", "array-contains", String(userId))
          .onSnapshot((querySnapshot) => {
            querySnapshot.docChanges().forEach((snapShot) => {
              tmpChatHtml.push(
                // <TouchableWithoutFeedback
                //   key={snapShot.doc.id}
                //   onPress={() => props.navigation.navigate("ChatScreen")}
                //   onLongPress={() => onShowChanged(true)}
                // >
                //   <View style={styles.tabContainer}>
                //     <Image style={styles.tabImage} />
                //     <View style={styles.descriptionContainer}>
                //       <Text style={styles.tabText}>
                //         {snapShot.doc.data().groupName}
                //         {console.log(snapShot.doc.id)}
                //       </Text>
                //       <Text style={styles.tabText}>{"message"}</Text>
                //     </View>
                //     <View style={styles.tabRightContainer}>
                //       <Text style={styles.tabText}>00：00</Text>
                //       <View style={styles.notificationNumberContainer}>
                //         <Text style={styles.notificationNumberText}>1</Text>
                //       </View>
                //     </View>
                //   </View>
                // </TouchableWithoutFeedback>
                <View key={snapShot.doc.id}>
                  <Text>{snapShot.doc.id}</Text>
                </View>
              );
              console.log(tmpChatHtml);
              onChatHtmlChanged(tmpChatHtml);
            });
          });
        onLoadedChanged(true);
      }
    });
  });
  return (
    <TouchableWithoutFeedback onPress={() => onShowChanged(false)}>
      <SafeAreaView style={{ flex: 1 }}>
        {show == true ? (
          <Modal
            visible={true}
            transparent={false}
            style={{
              flex: 1,
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              borderWidth: 1,
              backgroundColor: Colors.F6F6F6,
              borderColor: Colors.D7CCA6,
              marginHorizontal: widthPercentageToDP("10%"),
              marginVertical: heightPercentageToDP("25%"),
            }}
          >
            <View
              style={{
                marginHorizontal: widthPercentageToDP("5%"),
                marginTop: heightPercentageToDP("3%"),
              }}
            >
              <Text style={{ fontSize: RFValue(18) }}>髪長友子</Text>
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
          </Modal>
        ) : null}
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
              <Text style={styles.notificationNumberText}>3</Text>
            </View>
          </View>
          {chatHtml}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
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
    fontSize: RFValue(16),
  },
});
