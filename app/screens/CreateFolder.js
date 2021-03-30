import React from "react";
import { InteractionManager } from 'react-native';

import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { useIsFocused } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
import Person from "../assets/icons/default_avatar.svg";
import AddMember from "../assets/icons/addMember.svg";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
let friendIds = [];
let memberCount = 0;
let friendNames = [];
let tmpUserHtml = [];
let userId;
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioProfile = win.width / 9 / 512;
export default function CreateFolder(props) {
  const isFocused = useIsFocused();
  const [userHtml, onUserHtmlChanged] = useStateIfMounted(<View></View>);
  const [folderName, setFolderName] = useStateIfMounted("");
  const [loaded, onLoaded] = useStateIfMounted(false);
  const [friendName, onFriendNameChanged] = useStateIfMounted([]);
  React.useEffect(() => {

    InteractionManager.runAfterInteractions(() => {
      friendNames = [];
      let routes = props.navigation.dangerouslyGetState().routes;
      AsyncStorage.getItem("user").then((url) => {
        let urls = url.split("/");
        urls = urls.filter((url) => {
          return url;
        });
        userId = urls[urls.length - 1];

        AsyncStorage.getItem("ids").then((val) => {
          friendIds = JSON.parse(val);
          dbFriendIds = JSON.parse(val);
          if (friendIds != null) {
            memberCount = friendIds.length;
          } else {
            friendIds = [];
          }

          request
            .get("user/byIds/", {
              ids: friendIds,
            })
            .then(function (response) {
              let tmpUserHtml2 = [];
              response.data.users.map((user) => {
                // friendNames = [];
                friendNames.push(user.nickname);
                // console.log(friendNames);
                tmpUserHtml2.push(
                  <TouchableWithoutFeedback
                    key={String(user.id)}
                    userId={user.id}
                  >
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
                        <Image
                          style={{
                            width: win.width / 9,
                            height: 512 * ratioProfile,
                            borderRadius: win.width / 2,
                          }}
                          source={require("../assets/Images/profileEditingIconLarge.png")}
                        />
                      )}

                      <Text style={styles.folderText}>{user.nickname}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              });
              tmpUserHtml = tmpUserHtml2;
              onUserHtmlChanged(tmpUserHtml);
            });
          onLoaded(true);
        });
      });

      // return ()=> {
      //   AsyncStorage.removeItem("ids").then(function () {
      //     memberCount = 0;
      //     tmpUserHtml = [];
      //     onUserHtmlChanged([]);
      //     friendNames = [];
      //     friendIds = null;
      //   });
      // }
    });
  }, [isFocused]);

  function folderCreate() {
    if (friendIds.length != 0) {
      if (folderName != "") {
        // AsyncStorage.removeItem("tmpIds");
        if (friendIds) {
          db.collection("users")
            .doc(userId)
            .collection("folders")
            .add({
              folderName: folderName,
              type: "folder",
              users: friendIds,
              usersName: friendNames,
            })
            .then((docRef) => {
              setFolderName("");
              console.log(friendIds);
              console.log(friendNames);
              props.navigation.navigate("GroupFolderCreateCompletion", {
                groupDocumentID: docRef.id,
                type: "folder",
                groupName: folderName,
                friendNames: friendNames,
                friendIds: friendIds,
                ownUserID: userId,
              });
            });
        }
      } else {
        alert.warning(Translate.t('groupNotFilled'));
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
    AsyncStorage.setItem("tmpIds", JSON.stringify(friendIds)).then(() => {
      props.navigation.navigate("FolderMemberSelection");
    });
  }

  function backHandler() {
    setFolderName("");
    props.navigation.goBack();
  }
  return (
    <SafeAreaView>
      <CustomHeader
        text={Translate.t("createFolder")}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => props.navigation.navigate("Cart")}
        onBack={() => {
          backHandler();
        }}
      />
      <TouchableWithoutFeedback onPress={() => folderCreate()}>
        <Text
          style={{
            fontSize: RFValue(14),
            right: widthPercentageToDP("4%"),
            alignSelf: "flex-end",
            // backgroundColor: "orange",
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
          <Image
            style={{
              width: RFValue(40),
              height: RFValue(40),
              borderRadius: win.width / 2,
              backgroundColor: Colors.DCDCDC,
            }}
          />
          <TextInput
            value={folderName}
            onChangeText={(value) => setFolderName(value)}
            style={styles.searchInput}
            placeholder={Translate.t("folderName")}
          />
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
              {"   "}
            </Text>
            <Text style={{ fontSize: RFValue(12) }}>( {memberCount} )</Text>
          </View>
          <TouchableWithoutFeedback onPress={() => addMemberHandler()}>
            <View style={styles.memberListContainer}>
              <Image
                style={{
                  width: RFValue(38),
                  height: RFValue(38),
                  borderRadius: Dimensions.get("window").width / 2,
                  backgroundColor: Colors.E6DADE,
                }}
                source={require("../assets/Images/addMemberIconLarge.png")}
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
    alignItems: "center",
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
