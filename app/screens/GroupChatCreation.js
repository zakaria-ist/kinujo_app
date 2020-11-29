import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import { useIsFocused } from "@react-navigation/native";
import CustomAlert from "../lib/alert";
import storage from "@react-native-firebase/storage";
const alert = new CustomAlert();
const request = new Request();
const win = Dimensions.get("window");
var uuid = require("react-native-uuid");
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
let friendIds = [];
let memberCount = 0;
let friendNames = [];
let tmpUserHtml = [];
let userId;
let tmpGroupID;
export default function GroupChatCreation(props) {
  const isFocused = useIsFocused();
  const [userHtml, onUserHtmlChanged] = React.useState(<View></View>);
  const [groupName, setGroupName] = React.useState("");
  const [showGroupPhoto, onShowGroupPhotoChanged] = React.useState(false);
  const [loaded, onLoaded] = React.useState(false);
  if (!isFocused) {
    AsyncStorage.removeItem("ids").then(function () {
      tmpUserHtml = [];
      onUserHtmlChanged([]);
      friendNames = [];
      friendIds = null;
      memberCount = 0;
    });
  }
  AsyncStorage.getItem("user").then((url) => {
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    userId = urls[urls.length - 1];
  });
  React.useEffect(() => {
    AsyncStorage.getItem("ids")
      .then((val) => {
        friendIds = JSON.parse(val);
        memberCount = friendIds.length;
      })
      .then(function () {
        request
          .get("user/byIds/", {
            ids: friendIds,
          })
          .then(function (response) {
            response.data.users.map((user) => {
              let found =
                tmpUserHtml.filter((html) => {
                  return html.key == user.id;
                }).length > 0;
              if (!found) {
                friendNames.push(user.nickname);
                tmpUserHtml.push(
                  <TouchableWithoutFeedback key={user.id}>
                    <View style={styles.memberTabsContainer}>
                      <Image
                        style={{
                          width: RFValue(38),
                          height: RFValue(38),
                          borderRadius: win.width / 2,
                          backgroundColor: Colors.DCDCDC,
                        }}
                      />
                      <Text style={styles.folderText}>{user.nickname}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              }
            });
            onUserHtmlChanged(tmpUserHtml);
          });
        onLoaded(!loaded);
      });
  }, [isFocused]);

  function groupCreate() {
    if (groupName != "") {
      AsyncStorage.removeItem("tmpIds");
      if (friendIds) {
        props.navigation.navigate("GroupFolderCreateCompletion", {
          groupDocumentID: "",
          type: "group",
          groupName: groupName,
          friendNames: friendNames,
          friendIds: friendIds,
          ownUserID: userId,
        });
      }
      // setGroupName("");
    } else {
      alert.warning("Please fill in the group name");
    }
  }
  function addMemberHandler() {
    AsyncStorage.setItem("tmpIds", JSON.stringify(friendIds));
    props.navigation.navigate("GroupChatMember");
  }
  return (
    <SafeAreaView>
      <CustomHeader
        text={Translate.t("groupChatCreate")}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => props.navigation.navigate("Cart")}
        onBack={() => props.navigation.pop()}
      />
      <TouchableWithoutFeedback onPress={() => groupCreate()}>
        <Text
          style={{
            fontSize: RFValue(14),
            right: 0,
            position: "absolute",
            marginTop: heightPercentageToDP("10%"),
            marginRight: widthPercentageToDP("8%"),
          }}
        >
          {Translate.t("create")}
        </Text>
      </TouchableWithoutFeedback>
      <View
        style={{
          marginTop: heightPercentageToDP("8%"),
          marginHorizontal: widthPercentageToDP("4%"),
        }}
      >
        <View style={styles.createFolderContainer}>
          <TouchableWithoutFeedback
          // onPress={() => {
          //   const options = {
          //     noData: true,
          //   };
          //   ImagePicker.launchImageLibrary(options, (response) => {
          //     if (response.uri) {
          //       const reference = storage().ref(uuid.v4() + ".png");
          //       if (Platform.OS === "android") {
          //         RNFetchBlob.fs.stat(response.uri).then((stat) => {
          //           reference.putFile(stat.path).then((response) => {
          //             reference.getDownloadURL().then((url) => {
          //               db.collection("users")
          //                 .doc(String(userId))
          //                 .collection("groups")
          //                 .add({
          //                   groupPhoto: url,
          //                 })
          //                 .then(function (docRef) {
          //                   <Image
          //                     source={{ uri: docRef.data().groupPhoto }}
          //                     style={{
          //                       width: RFValue(40),
          //                       height: RFValue(40),
          //                       borderRadius: win.width / 2,
          //                       backgroundColor: Colors.DCDCDC,
          //                     }}
          //                   />;
          //                   AsyncStorage.setItem("groupID", docRef.id);
          //                   // AsyncStorage.setItem(
          //                   //   "groupPhoto",
          //                   //   docRef.data().groupPhoto
          //                   // );
          //                 });
          //             });
          //           });
          //         });
          //       } else {
          //         reference
          //           .putFile(response.uri.replace("file://", ""))
          //           .then((response) => {
          //             reference.getDownloadURL().then((url) => {
          //               db.collection("users")
          //                 .doc(String(userId))
          //                 .collection("groups")
          //                 .add({
          //                   groupPhoto: url,
          //                 })
          //                 .then(function (docRef) {
          //                   <Image
          //                     source={{ uri: docRef.data().groupPhoto }}
          //                     style={{
          //                       width: RFValue(40),
          //                       height: RFValue(40),
          //                       borderRadius: win.width / 2,
          //                       backgroundColor: Colors.DCDCDC,
          //                     }}
          //                   />;
          //                   AsyncStorage.setItem("groupID", docRef.id);
          //                   // AsyncStorage.setItem(
          //                   //   "groupPhoto",
          //                   //   docRef.data().groupPhoto
          //                   // );
          //                 });
          //             });
          //           });
          //       }
          //     }
          //   });
          // }}
          >
            <Image
              style={{
                width: RFValue(40),
                height: RFValue(40),
                borderRadius: win.width / 2,
                backgroundColor: Colors.DCDCDC,
              }}
            />
          </TouchableWithoutFeedback>
          <TextInput
            value={groupName}
            onChangeText={(value) => setGroupName(value)}
            style={styles.searchInput}
            placeholder={Translate.t("groupName")}
          ></TextInput>
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              marginTop: heightPercentageToDP("3%"),
            }}
          >
            <Text style={{ fontSize: RFValue(12) }}>
              {Translate.t("member")}
            </Text>
            <Text style={{ fontSize: RFValue(12) }}>
              {"  "}({memberCount})
            </Text>
          </View>
          <TouchableWithoutFeedback onPress={() => addMemberHandler()}>
            <View style={styles.memberListContainer}>
              <Image
                style={{
                  width: RFValue(38),
                  height: RFValue(38),
                  borderRadius: win.width / 2,
                  backgroundColor: Colors.E6DADE,
                }}
                source={require("../assets/Images/addMemberIcon.png")}
              />
              <Text style={styles.folderText}>{Translate.t("addMember")}</Text>
            </View>
          </TouchableWithoutFeedback>

          <ScrollView>{userHtml}</ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  memberTabsContainer: {
    marginTop: heightPercentageToDP("2%"),
    flexDirection: "row",
  },
  memberListContainer: {
    marginTop: heightPercentageToDP("5%"),
    flexDirection: "row",
  },
  createFolderContainer: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: Colors.D7CCA6,
    paddingBottom: heightPercentageToDP("1%"),
  },
  folderText: {
    fontSize: RFValue(12),
    alignSelf: "center",
    marginLeft: widthPercentageToDP("5%"),
  },
  searchInput: {
    fontSize: RFValue(12),
    alignSelf: "center",
    flex: 1,
    marginLeft: widthPercentageToDP("3%"),
  },
});
