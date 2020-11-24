import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView
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
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
let groupName;
let friendIds;
let friendNames;
let ownUserID;
let friendMessageUnseenField;
let friendTotalMessageReadField;
let documentID;
let groupDocumentID;
let type;
const win = Dimensions.get("window");
const ratioCancel = win.width / 20 / 15;
const ratioChat = win.width / 7 / 21;
export default function GroupFolderCreateCompletion(props) {
  const [userListHtml, onUserListHtml] = React.useState(<View></View>);
  const [loaded, onLoaded] = React.useState(false);
  groupName = props.route.params.groupName;
  friendIds = props.route.params.friendIds;
  friendNames = props.route.params.friendNames;
  ownUserID = props.route.params.ownUserID;
  groupDocumentID = props.route.params.groupDocumentID;
  type = props.route.params.type;
  function redirectToChat() {
    AsyncStorage.removeItem("ids");
    AsyncStorage.removeItem("tmpIds");
    friendIds.push(ownUserID);
    let ownMessageUnseenField = "unseenMessageCount_" + ownUserID;
    let ownTotalMessageReadField = "totalMessageRead_" + ownUserID;
    for (var i = 0; i < friendIds.length; i++) {
      friendMessageUnseenField = "unseenMessageCount_" + friendIds[i];
      friendTotalMessageReadField = "totalMessageRead_" + friendIds[i];
    }
    db.collection("chat")
      .add({
        [ownMessageUnseenField]: 0,
        [ownTotalMessageReadField]: 0,
        groupName: groupName,
        users: friendIds,
        totalMessage: 0,
        type: type,
      })
      .then(function () {
        db.collection("chat")
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              if (
                doc.data().users.length === friendIds.length &&
                doc
                  .data()
                  .users.every((value, index) => value === friendIds[index]) &&
                doc.data().lastMessageTime == null &&
                doc.data().message == null
              ) {
                documentID = doc.id;
                for (var i = 0; i < friendIds.length; i++) {
                  friendMessageUnseenField =
                    "unseenMessageCount_" + String(friendIds[i]);
                  friendTotalMessageReadField =
                    "totalMessageRead_" + String(friendIds[i]);
                  db.collection("chat")
                    .doc(documentID)
                    .update({
                      [friendTotalMessageReadField]: 0,
                      [friendMessageUnseenField]: 0,
                    });
                }
              }
            });
            props.navigation.replace("ChatScreen", {
              groupName: groupName,
              groupID: documentID,
            });
          });
      });
  }

  function addMemberHandler() {
    AsyncStorage.setItem("ids", JSON.stringify(friendIds));
    props.navigation.pop();
  }
  function cancelHanlder() {
    AsyncStorage.removeItem("ids");
    props.navigation.navigate("HomeGeneral");
  }
  if (!loaded) {
    let tmpUserListHtml = [];
    for (var i = 0; i < friendIds.length; i++) {
      tmpUserListHtml.push(
        <View
          key={friendIds[i]}
          style={{
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: RFValue(50),
              height: RFValue(50),
              borderRadius: win.width / 2,
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          />
          <Text style={styles.textForIcon}>{friendNames[i]}</Text>
        </View>
      );
    }
    onUserListHtml(tmpUserListHtml);
    onLoaded(true);
  }
  return (
    <SafeAreaView>
      <CustomHeader onPress={() => props.navigation.navigate("Cart")} />
      <View
        style={{
          marginHorizontal: widthPercentageToDP("3%"),
          borderWidth: 2,
          height: heightPercentageToDP("70%"),
          borderColor: Colors.D7CCA6,
          backgroundColor: Colors.F6F6F6,
        }}
      >
        <TouchableWithoutFeedback onPress={() => cancelHanlder()}>
          <Image
            style={{
              width: win.width / 20,
              height: 15 * ratioCancel,
              marginLeft: widthPercentageToDP("3%"),
              marginTop: heightPercentageToDP("1.5%"),
            }}
            source={require("../assets/Images/blackCancelIcon.png")}
          />
        </TouchableWithoutFeedback>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            style={{
              width: RFValue(80),
              height: RFValue(80),
              borderRadius: win.width / 2,
              marginTop: heightPercentageToDP("8%"),
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          />
          <View
            style={{
              marginTop: heightPercentageToDP("1.5%"),
              alignItems: "center",
            }}
          >
            {groupName == "" ? (
              <Text style={styles.text}>
                {Translate.t("folderOrGroupName")}
              </Text>
            ) : (
              <Text style={styles.text}>{groupName}</Text>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.text}>{Translate.t("member")} - </Text>
              <Text style={styles.text}>( {friendIds.length} )</Text>
            </View>
          </View>
        </View>
        <View>
          {/* /////////////////////////////////////////////////////////////*/}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: heightPercentageToDP("8%"),
            }}
          >
            <TouchableWithoutFeedback onPress={() => addMemberHandler()}>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    width: RFValue(50),
                    height: RFValue(50),
                    borderRadius: win.width / 2,
                    backgroundColor: Colors.E6DADE,
                  }}
                  source={require("../assets/Images/addMemberIcon.png")}
                />
                <Text style={styles.textForIcon}>
                  {Translate.t("addMember")}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            {userListHtml}
          </View>
          {/* /////////////////////////////////////////////////////////////*/}
          <TouchableWithoutFeedback onPress={() => redirectToChat()}>
            <View>
              <Image
                style={{
                  width: win.width / 7,
                  height: 18 * ratioChat,
                  alignSelf: "center",
                  marginTop: heightPercentageToDP("5%"),
                }}
                source={require("../assets/Images/chatIcon.png")}
              />
              <Text style={styles.textForIcon}>{Translate.t("talk")}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: RFValue(12),
  },
  textForIcon: {
    fontSize: RFValue(11),
    marginTop: heightPercentageToDP("1.5%"),
    alignSelf: "center",
  },
});
