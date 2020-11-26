import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import { useIsFocused } from "@react-navigation/native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
const request = new Request();
const alert = new CustomAlert();
let userID;
const win = Dimensions.get("window");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default function FavoriteChat(props) {
  const [favouriteHtml, onFavouriteHtmlChanged] = React.useState(<View></View>);
  const [loaded, onLoaded] = React.useState(false);
  const isFocused = useIsFocused();
  AsyncStorage.getItem("user")
    .then((url) => {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      userID = urls[urls.length - 1];
    })
    .then(function () {
      loadFavoriteChat(userID);
    });
  function loadFavoriteChat(userID) {
    console.log(userID);
    let tmpFavoriteChatHtml = [];
    db.collection("users")
      .doc(String(userID))
      .collection("FavoriteChat")
      .get()
      .then((querySnapShot) => {
        querySnapShot.forEach((docRef) => {
          let date = docRef.data().createdAt.split(":");
          let tmpMonth = date[1];
          let tmpDay = date[2]; //message created at
          let tmpHours = date[3];
          let tmpMinutes = date[4];
          tmpFavoriteChatHtml.push(
            <View style={styles.container} key={docRef.id}>
              <Text style={styles.groupNameText}>
                {docRef.data().groupName}
              </Text>
              <Text style={styles.messageText}>
                {docRef.data().favoriteMessage}
              </Text>
              <Text
                style={{
                  position: "absolute",
                  fontSize: RFValue(12),
                  right: 0,
                }}
              >
                {tmpDay + "/" + tmpMonth}
              </Text>
            </View>
          );
        });
        onFavouriteHtmlChanged(tmpFavoriteChatHtml);
      });
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        text="お気に入り"
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => props.navigation.navigate("Cart")}
        onBack={() => props.navigation.pop()}
      />
      <View
        style={{
          marginHorizontal: widthPercentageToDP("5%"),
          marginTop: heightPercentageToDP("2%"),
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: RFValue(9) }}>Group Name</Text>
          <Text
            style={{
              fontSize: RFValue(9),
            }}
          >
            Favorite Message
          </Text>
          <Text style={{ fontSize: RFValue(9) }}>TimeStamp</Text>
        </View>
        {favouriteHtml}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    paddingBottom: heightPercentageToDP("2%"),
    paddingTop: heightPercentageToDP("2%"),
  },
  groupNameText: {
    fontSize: RFValue(12),
  },
  messageText: {
    width: widthPercentageToDP("50%"),
    fontSize: RFValue(12),
    marginLeft: widthPercentageToDP("15%"),
  },
});
