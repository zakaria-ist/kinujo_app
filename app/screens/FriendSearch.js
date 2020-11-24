import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import { Colors } from "../assets/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
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
let ownUserID;
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioSearchIcon = win.width / 19 / 19;

export default function FriendSearch(props) {
  const [searchText, onSearchTextChanged] = React.useState("");
  const [friendHtml, onFriendHtmlChanged] = React.useState(<View></View>);
  AsyncStorage.getItem("user").then(function (url) {
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    ownUserID = urls[urls.length - 1];
  });
  function sendMessageHandler(friendID, friendName) {
    let groupID;
    let groupName;
    chatRef
      .where("users", "array-contains", ownUserID)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.docChanges().forEach((snapShot) => {
          let users = snapShot.doc.data().users;
          for (var i = 0; i < users.length; i++) {
            if (users[i] == friendID) {
              groupID = snapShot.doc.id;
              groupName = snapShot.doc.data().groupName;
            }
          }
        });
        if (groupID != null) {
          props.navigation.navigate("ChatScreen", {
            groupID: groupID,
            groupName: friendName,
          });
        } else {
          let ownMessageUnseenField = "unseenMessageCount_" + ownUserID;
          let friendMessageUnseenField = "unseenMessageCount_" + friendID;
          let ownTotalMessageReadField = "totalMessageRead_" + ownUserID;
          let friendTotalMessageReadField = "totalMessageRead_" + friendID;
          chatRef
            .add({
              groupName: friendName,
              users: [String(ownUserID), String(friendID)],
              totalMessage: 0,
              [ownMessageUnseenField]: 0,
              [friendMessageUnseenField]: 0,
              [ownTotalMessageReadField]: 0,
              [friendTotalMessageReadField]: 0,
            })
            .then(function (docRef) {
              props.navigation.navigate("ChatScreen", {
                groupID: docRef.id,
                groupName: friendName,
              });
            });
        }
      });
  }

  function processFriendHtml(props, friends) {
    let tmpFriendHtml = [];
    friends.map((friend) => {
      tmpFriendHtml.push(
        <TouchableWithoutFeedback
          key={friend.id}
          onPress={() => {
            sendMessageHandler(friend.id, friend.real_name);
            onSearchTextChanged("");
          }}
        >
          <View style={styles.friendListContainer}>
            <View style={styles.friendTabCotainer}>
              <Image
                style={styles.friendListImage}
                source={require("../assets/Images/profileEditingIcon.png")}
              />
              <Text style={styles.friendListName}>
                {friend.real_name ? friend.real_name : friend.nickname}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    });
    return tmpFriendHtml;
  }
  return (
    <SafeAreaView>
      <CustomHeader
        text={Translate.t("friendSearch")}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => props.navigation.navigate("Cart")}
        onBack={() => props.navigation.pop()}
      />
      <View style={{ marginHorizontal: widthPercentageToDP("4%") }}>
        <View style={styles.searchInputContainer}>
          <TextInput
            placeholder={Translate.t("friendSearchByID")}
            placeholderTextColor={Colors.grey}
            onChangeText={(text) => {
              onSearchTextChanged(text);
              request
                .get("profiles/", {
                  search: text,
                })
                .then(function (response) {
                  onFriendHtmlChanged(processFriendHtml(props, response.data));
                })
                .catch(function (error) {
                  if (
                    error &&
                    error.response &&
                    error.response.data &&
                    Object.keys(error.response.data).length > 0
                  ) {
                    alert.warning(
                      error.response.data[
                        Object.keys(error.response.data)[0]
                      ][0] +
                        "(" +
                        Object.keys(error.response.data)[0] +
                        ")"
                    );
                  }
                });
            }}
            value={searchText}
            style={styles.searchFriendTextInput}
          ></TextInput>
          <Image
            style={styles.searchIcon}
            source={require("../assets/Images/searchIcon.png")}
          />
        </View>
        <View style={{ paddingBottom: heightPercentageToDP("20%") }}>
          <ScrollView>{friendHtml}</ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  friendTabCotainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchFriendTextInput: {
    paddingLeft: widthPercentageToDP("5%"),
    paddingRight: widthPercentageToDP("15%"),
    fontSize: RFValue(11),
    flex: 1,
  },
  friendListContainer: {
    marginTop: heightPercentageToDP("3%"),
  },
  searchIcon: {
    width: win.width / 19,
    height: 19 * ratioSearchIcon,
    position: "absolute",
    right: 0,
    marginRight: widthPercentageToDP("5%"),
  },
  searchInputContainer: {
    marginTop: heightPercentageToDP("3%"),
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: Colors.F6F6F6,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: win.width / 2,
    height: heightPercentageToDP("5%"),
  },
  friendListImage: {
    width: RFValue(40),
    height: RFValue(40),
    alignSelf: "center",
    borderRadius: win.width / 2,
  },
  friendListName: {
    fontSize: RFValue(14),
    marginLeft: widthPercentageToDP("5%"),
  },
});
