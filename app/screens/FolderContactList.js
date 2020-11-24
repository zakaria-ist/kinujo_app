import React, { useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import { Colors } from "../assets/Colors";
import HomeProducts from "./HomeProducts";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";

import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import Format from "../lib/format";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
import "firebase/firestore";
const format = new Format();

const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const ratioSearchIcon = win.width / 19 / 19;
const ratioProfile = win.width / 13 / 22;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
let globalUsers = [];

function getID(url) {
  let urls = url.split("/");
  urls = urls.filter((url) => {
    return url;
  });
  userId = urls[urls.length - 1];
  return userId;
}

export default function FolderContactList(props) {
  const [user, onUserChanged] = React.useState({});
  const [searchTerm, onSearchTermChanged] = React.useState([]);
  const [userHtml, onUserHtmlChanged] = React.useState(<View></View>);
  function redirectToChat(friendID, friendName) {
    let groupID;
    let groupName;
    let deleted = "delete_" + userId;
    db.collection("chat")
      .where("users", "array-contains", userId)
      .get()
      .then((querySnapshot) => {
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
          db.collection("chat")
            .doc(groupID)
            .set(
              {
                [deleted]: false,
              },
              {
                merge: true,
              }
            );
          props.navigation.navigate("ChatScreen", {
            groupID: groupID,
            groupName: friendName,
          });
        } else {
          let ownMessageUnseenField = "unseenMessageCount_" + userId;
          let friendMessageUnseenField = "unseenMessageCount_" + friendID;
          let ownTotalMessageReadField = "totalMessageRead_" + ownUserID;
          let friendTotalMessageReadField = "totalMessageRead_" + chatPersonID;
          db.collection("chat")
            .add({
              groupName: friendName,
              users: [userId, String(friendID)],
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

  function processUserHtml(props, users) {
    let tmpUserHtml = [];
    users.map((user) => {
      tmpUserHtml.push(
        <TouchableWithoutFeedback
          onLongPress={() => {
            onLongPressObjChanged(user);
            onShowChanged(true);
          }}
          key={user.id}
          onPress={() => {
            redirectToChat(user.id, user.nickname);
          }}
        >
          <View style={styles.contactTabContainer}>
            <Image
              style={{
                width: win.width / 13,
                height: ratioProfile * 25,
              }}
              source={require("../assets/Images/profileEditingIcon.png")}
            />
            <Text style={styles.tabLeftText}>{user.nickname}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    });
    return tmpUserHtml;
  }

  React.useEffect(() => {
    AsyncStorage.getItem("user").then(function (url) {
      let userId = getID(url);
      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("folders")
        .doc(props.route.params.folderID)
        .get()
        .then(function (snapshot) {
          request
            .get("user/byIds/", {
              ids: snapshot.data().users,
            })
            .then(function (response) {
              globalUsers = response.data.users;
              onUserHtmlChanged(processUserHtml(props, response.data.users));
            });
        });
    });
  }, [useIsFocused]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        onBack={() => {
          props.navigation.pop();
        }}
        text={Translate.t("contact")}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => props.navigation.navigate("Cart")}
      />
      <View style={{ marginHorizontal: widthPercentageToDP("4%") }}>
        <View style={styles.searchInputContainer}>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate("ContactSearch")}
          >
            <TextInput
              placeholder={Translate.t("search")}
              placeholderTextColor={Colors.grey}
              style={styles.searchContactInput}
              value={searchTerm}
              onChangeText={(value) => {
                onSearchTermChanged(value);
                onUserHtmlChanged(
                  processUserHtml(
                    props,
                    globalUsers.filter((user) => {
                      return (
                        user.real_name
                          .toLowerCase()
                          .indexOf(value.toLowerCase()) >= 0 ||
                        user.nickname
                          .toLowerCase()
                          .indexOf(value.toLowerCase()) >= 0
                      );
                    })
                  )
                );
              }}
            ></TextInput>
          </TouchableWithoutFeedback>
          <Image
            style={styles.searchIcon}
            source={require("../assets/Images/searchIcon.png")}
          />
        </View>
      </View>
      <ScrollView style={styles.home_product_view}>{userHtml}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contactTabContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: heightPercentageToDP("3%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.F0EEE9,
    paddingBottom: heightPercentageToDP("2%"),
    marginHorizontal: widthPercentageToDP("1%"),
  },
  tabRightContainer: {
    flexDirection: "row-reverse",
    position: "absolute",
    right: 0,
    justifyContent: "flex-end",
    width: widthPercentageToDP("18%"),
    alignItems: "center",
  },
  tabLeftText: {
    fontSize: RFValue(12),
    marginLeft: widthPercentageToDP("5%"),
  },
  tabRightText: {
    fontSize: RFValue(12),
    marginRight: widthPercentageToDP("5%"),
  },
  searchContactInput: {
    fontSize: RFValue(11),
    paddingLeft: widthPercentageToDP("5%"),
    paddingRight: widthPercentageToDP("15%"),
    flex: 1,
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
  home_product_view: {
    height: height - 48 - heightPercentageToDP("17%"),
    padding: 15,
    paddingTop: 0,
    marginTop: 15,
    backgroundColor: "#FFF",
    overflow: "scroll",
  },
  section_header: {
    width: "100%",
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  section_header_text: {
    borderBottomColor: "black",
    fontSize: RFValue(14),
    paddingBottom: 5,
  },
  section_product: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
});
