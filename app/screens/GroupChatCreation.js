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
  Alert,
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
import Person from "../assets/icons/default_avatar.svg";
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
let friendMessageUnseenField;
let friendTotalMessageReadField;
let friendNames = [];
let tmpUserHtml = [];
let userId;
let tmpGroupID;
let chatRoomID;
export default function GroupChatCreation(props) {
  const isFocused = useIsFocused();
  const [userHtml, onUserHtmlChanged] = React.useState(<View></View>);
  const [groupName, setGroupName] = React.useState("");
  const [showGroupPhoto, onShowGroupPhotoChanged] = React.useState(false);
  const [loaded, onLoaded] = React.useState(false);
  if (!isFocused) {
    // AsyncStorage.removeItem("ids").then(function () {
    //   tmpUserHtml = [];
    //   onUserHtmlChanged([]);
    //   friendNames = [];
    //   friendIds = null;
    //   memberCount = 0;
    // });
  }

  React.useEffect(() => {

    AsyncStorage.getItem("user").then((url) => {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      userId = urls[urls.length - 1];
      
      AsyncStorage.getItem("ids")
      .then((val) => {
        friendIds = JSON.parse(val);
        dbFriendIds = JSON.parse(val);
        if (friendIds != null) {
          memberCount = friendIds.length;
        } else {
          friendIds = []
        }

        request
          .get("user/byIds/", {
            ids: friendIds,
          })
          .then(function (response) {
            let tmpUserHtml2 = [];
            response.data.users.map((user) => {
              friendNames.push(user.nickname);
              tmpUserHtml2.push(
                  <TouchableWithoutFeedback key={String(user.id)}>
                    <View style={styles.memberTabsContainer}>
                      {user && user.image && user.image.image ? (
                        <Image
                          style={{
                            width: RFValue(38),
                            height: RFValue(38),
                            borderRadius: win.width / 2,
                            backgroundColor: Colors.DCDCDC,
                          }}
                          source={{ uri: user.image.image }}
                        />
                      ) : (
                        <Person
                          style={{
                            width: RFValue(38),
                            height: RFValue(38),
                            borderRadius: win.width / 2,
                            // backgroundColor: Colors.DCDCDC,
                          }}
                        />
                        // <Image
                        //   style={{
                        //     width: RFValue(38),
                        //     height: RFValue(38),
                        //     borderRadius: win.width / 2,
                        //     backgroundColor: Colors.DCDCDC,
                        //   }}
                        // />
                      )}

                      <Text style={styles.folderText}>{user.nickname}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
            });
            tmpUserHtml = tmpUserHtml2;
            onUserHtmlChanged(tmpUserHtml);
          });
      });
    });
  }, [isFocused]);
  // console.log(friendIds);
  function groupCreate() {
    if (friendIds.length != 0) {
      if (groupName != "") {
        AsyncStorage.removeItem("tmpIds");
        if (friendIds) {
          db.collection("users").doc(String(userId)).collection("groups").add({
            groupName: groupName,
            usersName: friendNames,
          });

          friendIds.push(String(userId));
          let ownMessageUnseenField = "unseenMessageCount_" + String(userId);
          let ownTotalMessageReadField = "totalMessageRead_" + String(userId);
          db.collection("chat")
            .add({
              [ownMessageUnseenField]: 0,
              [ownTotalMessageReadField]: 0,
              groupName: groupName,

              totalMessage: 0,
              type: "group",
            })
            .then(function (docRef) {
              documentID = docRef.id;
              for (var i = 0; i < friendIds.length; i++) {
                friendMessageUnseenField =
                  "unseenMessageCount_" + String(friendIds[i]);
                friendTotalMessageReadField =
                  "totalMessageRead_" + String(friendIds[i]);
                db.collection("chat")
                  .doc(documentID)
                  .update({
                    users: friendIds,
                    [friendTotalMessageReadField]: 0,
                    [friendMessageUnseenField]: 0,
                  });
              }
              props.navigation.navigate("GroupFolderCreateCompletion", {
                groupDocumentID: documentID,
                type: "group",
                groupName: groupName,
                friendNames: friendNames,
                friendIds: friendIds,
                ownUserID: userId,
              });
            });
        }
        setGroupName("");
      } else {
        alert.warning("Please fill in the group name");
      }
    } else if (friendIds.length == 0) {
      Alert.alert(
        Translate.t("warning"),
        Translate.t("addOneOrMoreContact"),
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
    }
  }
  function addMemberHandler() {
    // console.log(friendIds)
    AsyncStorage.setItem("tmpIds", JSON.stringify(friendIds)).then(()=>{
      props.navigation.navigate("GroupChatMember")
    })
  }
  return (
    <SafeAreaView>
      <CustomHeader
        text={Translate.t("groupChatCreate")}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => props.navigation.navigate("Cart")}
        onBack={() => props.navigation.goBack()}
      />
      <TouchableWithoutFeedback onPress={() => groupCreate()}>
        <Text
          style={{
            fontSize: RFValue(14),
            right: widthPercentageToDP("4%"),
            alignSelf: "flex-end",
            // position: "absolute",
            marginTop: heightPercentageToDP("3%"),

            // marginRight: widthPercentageToDP("8%"),
          }}
        >
          {Translate.t("create")}
        </Text>
      </TouchableWithoutFeedback>
      <View
        style={{
          marginTop: heightPercentageToDP("3%"),
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
