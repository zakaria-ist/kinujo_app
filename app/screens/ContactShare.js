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
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import CustomHeader from "../assets/CustomComponents/CustomHeader";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import { Colors } from "../assets/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";

import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";

const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioSearchIcon = win.width / 19 / 19;
const ratioProfile = win.width / 13 / 22;
let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let day = new Date().getDate();
let hour = new Date().getHours();
let minute = ("0" + new Date().getMinutes()).slice(-2);
let seconds = new Date().getSeconds();
let userId;
let groupID;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default function ContactShare(props) {
  groupID = props.route.params.groupID;
  function storeShareContact(contactID, contactName) {
    let contactObj = {
      contactName: contactName,
      contactID: String(contactID),
      userID: userId,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
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
      message: "Contact",
    };

    db.collection("chat")
      .doc(groupID)
      .collection("messages")
      .add(contactObj)
      .then(function () {
        db.collection("chat")
          .doc(groupID)
          .set(
            {
              message: "Contact",
              lastMessageTime:
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
            },
            {
              merge: true,
            }
          );
        db.collection("chat")
          .doc(groupID)
          .get()
          .then(function (doc) {
            totalMessageCount = doc.data().totalMessage;
          })
          .then(function () {
            db.collection("chat")
              .doc(groupID)
              .update({
                totalMessage: totalMessageCount + 1,
              });
          });
        props.navigation.goBack();
      });
  }
  function processUserHtml(props, users) {
    let tmpUserHtml = [];
    users.map((user) => {
      tmpUserHtml.push(
        <TouchableWithoutFeedback
          key={user.id}
          onPress={() => {
            storeShareContact(user.id, user.nickname);
          }}
        >
          <View style={styles.contactTabContainer}>
            {/* <Image
              style={{
                width: win.width / 13,
                height: ratioProfile * 25,
                marginLeft: widthPercentageToDP("1%"),
              }}
              source={require("../assets/Images/profileEditingIcon.png")}
            /> */}
            {user.image != null ? (
              <Image
                style={{
                  width: RFValue(35),
                  height: RFValue(35),
                  marginLeft: widthPercentageToDP("1%"),
                  borderRadius: win.width / 2,
                }}
                source={{ uri: user.image.image }}
              />
            ) : (
              <Image
                style={{
                  width: win.width / 13,
                  height: ratioProfile * 25,
                  marginLeft: widthPercentageToDP("1%"),
                }}
                source={require("../assets/Images/profileEditingIcon.png")}
              />
            )}
            <Text style={styles.tabLeftText}>{user.nickname}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    });
    return tmpUserHtml;
  }
  const [userHtml, onUserHtmlChanged] = React.useState(<View></View>);
  const [loaded, onLoaded] = React.useState(false);
  const [user, onUserChanged] = React.useState({});

  React.useEffect(() => {
    AsyncStorage.getItem("user").then(function (url) {
      request
        .get(url)
        .then(function (response) {
          onUserChanged(response.data);
        })
        .catch(function (error) {
          if (
            error &&
            error.response &&
            error.response.data &&
            Object.keys(error.response.data).length > 0
          ) {
            alert.warning(
              error.response.data[Object.keys(error.response.data)[0]][0] +
                "(" +
                Object.keys(error.response.data)[0] +
                ")"
            );
          }
        });

      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      userId = urls[urls.length - 1];
      db.collection("users")
        .doc(userId)
        .collection("friends")
        .get()
        .then((querySnapshot) => {
          let ids = [];
          let items = [];
          querySnapshot.forEach((documentSnapshot) => {
            let item = documentSnapshot.data();
            if (item.type == "user") {
              ids.push(item.id);
            }
          });
          request
            .get("user/byIds/", {
              ids: ids,
              userId: userId,
              type: "contact",
            })
            .then(function (response) {
              onUserHtmlChanged(processUserHtml(props, response.data.users));
            })
            .catch(function (error) {
              if (
                error &&
                error.response &&
                error.response.data &&
                Object.keys(error.response.data).length > 0
              ) {
                alert.warning(
                  error.response.data[Object.keys(error.response.data)[0]][0] +
                    "(" +
                    Object.keys(error.response.data)[0] +
                    ")"
                );
              }
            });
        });
      onLoaded(true);
    });
  }, []);

  return (
    <SafeAreaView>
      <CustomHeader
        text={Translate.t("contact")}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => props.navigation.navigate("Cart")}
      />
      <CustomSecondaryHeader
        name={user.nickname}
        accountType={
          user.is_seller && user.is_master ? Translate.t("storeAccount") : ""
        }
      />
      <ScrollView style={{ marginHorizontal: widthPercentageToDP("4%") }}>
        <View style={styles.searchInputContainer}>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate("ContactSearch")}
          >
            <TextInput
              placeholder={Translate.t("search")}
              placeholderTextColor={Colors.grey}
              style={styles.searchContactInput}
            ></TextInput>
          </TouchableWithoutFeedback>
          <Image
            style={styles.searchIcon}
            source={require("../assets/Images/searchIcon.png")}
          />
        </View>

        <View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.F0EEE9,
              justifyContent: "center",
            }}
          >
            {userHtml}
          </View>
        </View>
      </ScrollView>
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
    height: heightPercentageToDP("6%"),
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
    height: heightPercentageToDP("6%"),
  },
});
