import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
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
import CheckBox from "@react-native-community/checkbox";
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioSearchIcon = win.width / 19 / 19;
let userId;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
let checkStatus;
let ids = [];
let tmpFriend = [];
export default function FolderMemberSelection(props) {
  const [searchText, onSearchTextChanged] = React.useState("");
  const [userHtml, onUserHtmlChanged] = React.useState(<View></View>);
  const [user, onUserChanged] = React.useState({});
  const [checked, onCheckedChanged] = React.useState(false);
  const [loaded, onLoaded] = React.useState(false);
  React.useEffect(() => {
    AsyncStorage.getItem("user").then(function(url) {
      request
        .get(url)
        .then(function(response) {
          onUserChanged(response.data);
        })
        .catch(function(error) {
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
          let items = [];
          querySnapshot.forEach((documentSnapshot) => {
            let item = documentSnapshot.data();
            if (item.type == "user") {
              ids.push(item.id); //push user id as array
              items.push({
                id: item.id,
                checkStatus: checked,
              });
            }
            tmpFriend = items;
            //item to indicate checkbox status and id
          });
          request
            .get("user/byIds/", {
              ids: ids,
            })
            .then(function(response) {
              //response = get use details from url
              onUserHtmlChanged(
                processUserHtml(props, response.data.users, tmpFriend)
              );
            })
            .catch(function(error) {
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
  function onValueChange(friendID) {
    tmpFriend = tmpFriend.map((friend) => {
      if (friendID == friend.id) {
        if (friend.checkStatus == true) {
          friend.checkStatus = false;
        } else {
          friend.checkStatus = true;
        }
      }
      return friend;
    });
    onUpdate(ids, tmpFriend);
  }
  function onUpdate(ids, items) {
    request
      .get("user/byIds/", {
        ids: ids,
      })
      .then(function(response) {
        onUserHtmlChanged(
          processUserHtml(props, response.data.users, tmpFriend)
        );
      })
      .catch(function(error) {
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
  }

  function processUserHtml(props, users, friendMaps) {
    let tmpUserHtml = [];
    users.map((user) => {
      let item = friendMaps.filter((tmp) => {
        return tmp.id == user.id;
      });
      item = item[0];
      tmpUserHtml.push(
        <TouchableWithoutFeedback
          key={user.id}
          onPress={() => {
            onSearchTextChanged("");
          }}
        >
          <View style={styles.tabContainer}>
            <Image style={styles.memberImage} />
            <Text style={styles.tabContainerText}>
              {user.real_name ? user.real_name : user.nickname}
            </Text>
            <View style={styles.checkBoxContainer}>
              <CheckBox
                color={Colors.E6DADE}
                uncheckedColor={Colors.E6DADE}
                disabled={false}
                value={item.checkStatus}
                onValueChange={() => onValueChange(user.id)}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    });
    return tmpUserHtml;
  }
  function finishSelect() {
    let selectedId = [];
    tmpFriend.map((friend) => {
      if (friend.checkStatus == true) {
        selectedId.push(friend.id);
      }
    });
    AsyncStorage.setItem("ids", JSON.stringify(selectedId));
    props.navigation.pop();
  }
  return (
    <SafeAreaView>
      <CustomHeader
        text="フォルダメンバー選択"
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => props.navigation.navigate("Cart")}
      />
      <TouchableWithoutFeedback onPress={() => finishSelect()}>
        <Text
          style={{
            fontSize: RFValue(12),
            right: 0,
            position: "absolute",
            marginTop: heightPercentageToDP("8%"),
            marginRight: widthPercentageToDP("8%"),
          }}
        >
          {Translate.t("next")}
        </Text>
      </TouchableWithoutFeedback>
      <View
        style={{
          marginHorizontal: widthPercentageToDP("4%"),
          marginTop: widthPercentageToDP("2%"),
        }}
      >
        <View>
          <View style={styles.searchInputContainer}>
            <TouchableWithoutFeedback
              onPress={() => props.navigation.navigate("ContactSearch")}
            >
              <TextInput
                placeholder="検索"
                placeholderTextColor={Colors.grey}
                style={styles.searchInput}
              ></TextInput>
            </TouchableWithoutFeedback>
            <Image
              style={styles.searchIcon}
              source={require("../assets/Images/searchIcon.png")}
            />
          </View>
        </View>
        <View style={{ paddingBottom: heightPercentageToDP("10%") }}>
          <ScrollView
            style={{ height: "100%" }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {userHtml}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  checkBoxContainer: {
    position: "absolute",
    right: 0,
    alignSelf: "center",
  },
  searchInputContainer: {
    marginTop: heightPercentageToDP("5%"),
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: Colors.F6F6F6,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: win.width / 2,
    height: heightPercentageToDP("5%"),
  },
  searchInput: {
    paddingLeft: widthPercentageToDP("5%"),
    paddingRight: widthPercentageToDP("15%"),
    fontSize: RFValue(11),
  },
  searchIcon: {
    width: win.width / 19,
    height: 19 * ratioSearchIcon,
    position: "absolute",
    right: 0,
    marginRight: widthPercentageToDP("5%"),
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: heightPercentageToDP("2%"),
    alignItems: "center",
  },
  tabContainerText: {
    fontSize: RFValue(12),
    marginLeft: widthPercentageToDP("5%"),
  },
  memberImage: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: win.width / 2,
    backgroundColor: Colors.DCDCDC,
  },
});
