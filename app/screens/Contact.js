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
import ArrowDownLogo from "../assets/icons/arrow_down.svg";
import { useIsFocused } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioSearchIcon = win.width / 19 / 19;
const ratioProfile = win.width / 13 / 22;
const ratioDownForMoreIcon = win.width / 18 / 16;
const ratioUpIcon = win.width / 14 / 19;
let globalFolders = [];
let globalUsers = [];
let globalGroups = [];

let userId;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

function getID(url) {
  let urls = url.split("/");
  urls = urls.filter((url) => {
    return url;
  });
  tmpUserId = urls[urls.length - 1];
  return tmpUserId;
}
function addFriend(firstUserId, secondUserId) {
  firestore()
    .collection("users")
    .doc(firstUserId)
    .collection("friends")
    .where("id", "==", secondUserId)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.size > 0) {
      } else {
        db.collection("users").doc(firstUserId).collection("friends").add({
          type: "user",
          id: secondUserId,
        });
      }
    });
}
export default function Contact(props) {
  const isFocused = useIsFocused();
  React.useEffect(() => {
    onShowChanged(false);
  }, [isFocused]);
  function redirectToChat(friendID, friendName) {
    let groupID = null;
    let groupName;
    let deleted = "delete_" + userId;
    db.collection("chat")
      .where("users", "array-contains", userId.toString())
      .get()
      .then((querySnapshot) => {
        querySnapshot.docChanges().forEach((snapShot) => {
          let users = snapShot.doc.data().users;
          for (var i = 0; i < users.length; i++) {
            console.log(users[i] + " = " + friendID)
            if (users[i] == friendID) {
              groupID = snapShot.doc.id;
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
          let ownTotalMessageReadField = "totalMessageRead_" + userId;
          let friendTotalMessageReadField = "totalMessageRead_" + friendID;
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

  function navigateToChatScreenWithGroupID(groupID, groupName) {
    props.navigation.navigate("ChatScreen", {
      groupID: groupID,
      groupName: groupName,
    });
  }
  function getName(obj) {
    if (obj.data) {
      if (obj.type == "user") {
        return obj.data.nickname;
      }
      return obj.data.name;
    }
    return "";
  }
  async function getFriendName(userID, realName) {
    let snapShot = await db
      .collection("users")
      .doc(String(user.id))
      .collection("customers")
      .get();

    tmpName = "";
    snapShot.forEach((docRef) => {
      if (docRef.data().displayName && docRef.id == userID) {
        tmpName = docRef.data().displayName;
      }
    });
    if (tmpName) return tmpName;
    else return realName;
  }

  async function processUserHtml(props, users) {
    setFriendCount(users.length);
    let tmpUserHtml = [];
    for(let i=0; i<users.length; i++){
      let user = users[i]
      name = await getFriendName(user.id, user.nickname)
      users[i].show_name = name;
    }

    users.sort((a, b)=>{
      if(!a['pinned'] && b['pinned']){
        return true;
      }
      if(a['pinned'] && !b['pinned']){
        return false;
      }
      return a.show_name > b.show_name;
    })

    for(let i=0; i<users.length; i++){
      let user = users[i]
      tmpUserHtml.push(
        <TouchableWithoutFeedback
          onLongPress={() => {
            onLongPressObjChanged({
              type: "user",
              data: user,
            });
            onShowChanged(true);
          }}
          key={user.id}
          onPress={() => {
            redirectToChat(
              user.id,
              user.show_name
            );
          }}
        >
          <View style={styles.contactTabContainer}>
            {user && user.image && user.image.image ? (<Image
              style={{
                width: win.width / 13,
                height: ratioProfile * 25,
              }}
              source={{ uri: user.image.image }}
            />) : (<Image
              style={{
                width: win.width / 13,
                height: ratioProfile * 25,
              }}
              source={require("../assets/Images/profileEditingIcon.png")}
            />)}
            
            <Text style={styles.tabLeftText}>
              {/* {user.real_name ? user.real_name : user.nickname} */}
              {user.show_name}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }

    return tmpUserHtml;
  }
  function processGroupHtml(props, groups, userId) {
    let tmpGroupHtml = [];
    groups = groups.filter((group) => {
      return !group.data["delete_" + userId] && !group.data["hide_" + userId];
    });
    groups = groups.sort((group1, group2) => {
      if (!group1.data["pinned_" + userId] && group2.data["pinned_" + userId]) {
        return 1;
      }
      if (group1.data["pinned_" + userId] && !group2.data["pinned_" + userId]) {
        return -1;
      }
      return group1['name'] > group2['name']
    });

    setGroupCount(groups.length);
    for (var i = 0; i < groups.length; i++) {
      let group = groups[i];
      tmpGroupHtml.push(
        <TouchableWithoutFeedback
          onLongPress={() => {
            onLongPressObjChanged({
              type: "group",
              data: group,
            });
            onShowChanged(true);
          }}
          key={groups[i]["id"]}
          onPress={() => {
            navigateToChatScreenWithGroupID(group["id"], group["name"]);
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
            <Text style={styles.tabLeftText}>{groups[i]["name"]}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return tmpGroupHtml;
  }
  function processFolderHtml(props, folders) {
    folders = folders.filter((folder) => {
      return !folder.data["delete"] && !folder.data["hide"];
    });
    folders.sort((folder1, folder2) => {
      if (!folder1.data["pinned"] && folder2.data["pinned"]) {
        return 1;
      }
      if (folder1.data["pinned"] && !folder2.data["pinned"]) {
        return -1;
      }
      return 0;
    });
    setFolderCount(folders.length);
    let tmpFolderHtml = [];
    for (var i = 0; i < folders.length; i++) {
      let folder = folders[i];
      tmpFolderHtml.push(
        <TouchableWithoutFeedback
          onLongPress={() => {
            onLongPressObjChanged({
              type: "folder",
              data: folder,
            });
            onShowChanged(true);
          }}
          key={folders[i]["id"]}
          onPress={() => {
            props.navigation.navigate("FolderContactList", {
              folderID: folder["folderId"],
            });
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
            <Text style={styles.tabLeftText}>{folders[i]["name"]}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return tmpFolderHtml;
  }
  const [userHtml, onUserHtmlChanged] = React.useState(<View></View>);
  const [groupHtml, onGroupHtmlChanged] = React.useState(<View></View>);
  const [folderHtml, onFolderHtmlChanged] = React.useState(<View></View>);
  const [friendLoaded, onFriendLoaded] = React.useState(false);
  const [folderLoaded, onFolderLoaded] = React.useState(false);
  const [groupLoaded, onGroupLoaded] = React.useState(false);
  const [user, onUserChanged] = React.useState({});
  const [show, onShowChanged] = React.useState(false);
  const [longPressObj, onLongPressObjChanged] = React.useState({});
  const [searchText, onSearchTextChanged] = React.useState("");
  const [friendCount, setFriendCount] = React.useState(0);
  const [groupCount, setGroupCount] = React.useState(0);
  const [folderCount, setFolderCount] = React.useState(0);
  const [showFriends, onShowFriendsChanged] = React.useState(false);
  const [showGroups, onShowGroupsChanged] = React.useState(false);
  const [showFolders, onShowFoldersChanged] = React.useState(false);
  const foldersOpacity = useRef(
    new Animated.Value(heightPercentageToDP("100%"))
  ).current;
  const groupsOpacity = useRef(new Animated.Value(heightPercentageToDP("100%")))
    .current;
  const friendsOpacity = useRef(
    new Animated.Value(heightPercentageToDP("100%"))
  ).current;

  function populateGroup() {
    AsyncStorage.getItem("user").then(function (url) {
      userId = getID(url);
      db.collection("chat")
        .where("users", "array-contains", String(userId))
        .get()
        .then((querySnapshot) => {
          let ids = [];
          let items = [];
          let total = 0;
          let groups = [];

          querySnapshot.forEach((documentSnapshot) => {
            if (
              documentSnapshot.data().users.length > 2 ||
              documentSnapshot.data().type == "group"
            ) {
              groups.push({
                id: documentSnapshot.id,
                name: documentSnapshot.data().groupName,
                data: documentSnapshot.data(),
              });
              total += 1;
            }
          });
          globalGroups = groups;
          onGroupHtmlChanged(processGroupHtml(props, groups, userId));
        });
      onGroupLoaded(true);
    });
  }

  function populateUser() {
    AsyncStorage.getItem("user").then(function (url) {
      userId = getID(url);
      request
        .get(url)
        .then(function (response) {
          onUserChanged(response.data);
          if (response.data.introducer) {
            let introducerId = getID(response.data.introducer);
            addFriend(userId, introducerId);
          }
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

      db.collection("users")
        .doc(userId)
        .collection("friends")
        .get()
        .then((querySnapshot) => {
          let ids = [];
          let items = [];
          querySnapshot.forEach((documentSnapshot) => {
            let item = documentSnapshot.data();
            if (
              (item.type == "user" && item.delete == null) ||
              item.delete == false
            ) {
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
              response = response.data;
              if (response.success) {
                globalUsers = response.users;
                processUserHtml(props, response.users).then((html)=>{
                  onUserHtmlChanged(html);
                })
              } else {
                if (
                  response.errors &&
                  Object.keys(response.errors).length > 0
                ) {
                  alert.warning(
                    response.errors[Object.keys(response.errors)[0]][0] +
                      "(" +
                      Object.keys(response.errors)[0] +
                      ")"
                  );
                } else if (response.error) {
                  alert.warning(response.error);
                }
              }
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
      onFriendLoaded(true);
    });
  }

  function populateFolder() {
    AsyncStorage.getItem("user").then(function (url) {
      userId = getID(url);
      db.collection("users")
        .doc(String(userId))
        .collection("folders")
        .get()
        .then((querySnapshot) => {
          let folders = [];

          querySnapshot.forEach((documentSnapshot) => {
            if (documentSnapshot.data().type == "folder") {
              folders.push({
                id: documentSnapshot.id,
                folderId: documentSnapshot.id,
                name: documentSnapshot.data().folderName,
                data: documentSnapshot.data(),
              });
            }
          });
          globalFolders = folders;
          onFolderHtmlChanged(processFolderHtml(props, folders));
        });
      onFolderLoaded(true);
    });
  }

  React.useEffect(() => {
    populateFolder();
  }, [isFocused]);
  React.useEffect(() => {
    populateGroup();
  }, [isFocused]);
  React.useEffect(() => {
    onShowFriendsChanged(true);
    populateUser();
  }, [isFocused]);

  return (
    <TouchableWithoutFeedback onPress={() => onShowChanged(false)}>
      <SafeAreaView style={{ flex: 1 }}>
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
        <ScrollView>
          <View style={{ marginHorizontal: widthPercentageToDP("4%") }}>
            <View style={styles.searchInputContainer}>
              <TouchableWithoutFeedback
                onPress={() => props.navigation.navigate("ContactSearch")}
              >
                <TextInput
                  placeholder={Translate.t("search")}
                  placeholderTextColor={Colors.grey}
                  style={styles.searchContactInput}
                  value={searchText}
                  onChangeText={(value) => {
                    onSearchTextChanged(value);
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
                    ).then((html)=>{
                      onUserHtmlChanged(
                        html
                      );
                    })
                    onGroupHtmlChanged(
                      processGroupHtml(
                        props,
                        globalGroups.filter((group) => {
                          return (
                            group["name"]
                              .toLowerCase()
                              .indexOf(value.toLowerCase()) >= 0
                          );
                        })
                      )
                    );
                    onFolderHtmlChanged(
                      processFolderHtml(
                        props,
                        globalFolders.filter((folder) => {
                          return (
                            folder["name"]
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
            {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
            <View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.F0EEE9,
                  justifyContent: "center",
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    showFolders == true
                      ? Animated.parallel([
                          Animated.timing(foldersOpacity, {
                            toValue: heightPercentageToDP("0%"),
                            duration: 100,
                            useNativeDriver: false,
                          }),
                        ]).start(() => {}, onShowFoldersChanged(false))
                      : Animated.parallel([
                          Animated.timing(foldersOpacity, {
                            toValue: heightPercentageToDP("100%"),
                            duration: 30000,
                            useNativeDriver: false,
                          }),
                        ]).start(() => {}, onShowFoldersChanged(true));
                  }}
                >
                  <View style={styles.contactTabContainer}>
                    <Image
                      style={{
                        width: win.width / 13,
                        height: ratioProfile * 25,
                      }}
                      source={require("../assets/Images/folderIcon.png")}
                    />
                    <Text style={styles.tabLeftText}>
                      {Translate.t("folder")}
                    </Text>
                    <View
                      style={{
                        position: "absolute",
                        right: 0,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingBottom: heightPercentageToDP("2%"),
                      }}
                    >
                      <Text style={styles.countText}>{folderCount}</Text>
                      {showFolders == false ? (
                        <Image
                          style={{
                            width: win.width / 18,
                            height: 8 * ratioDownForMoreIcon,
                          }}
                          source={require("../assets/Images/downForMoreIcon.png")}
                        />
                      ) : (
                        <Image
                          style={{
                            width: win.width / 19,
                            height: 8 * ratioUpIcon,
                          }}
                          source={require("../assets/Images/upIcon.png")}
                        />
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <Animated.View
                  style={
                    showFolders == false
                      ? styles.none
                      : (opacity = foldersOpacity)
                  }
                >
                  {folderHtml}
                </Animated.View>
              </View>
            </View>
            {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
            <View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.F0EEE9,
                  justifyContent: "center",
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    showGroups == true
                      ? Animated.parallel([
                          Animated.timing(groupsOpacity, {
                            toValue: heightPercentageToDP("0%"),
                            duration: 100,
                            useNativeDriver: false,
                          }),
                        ]).start(() => {}, onShowGroupsChanged(false))
                      : Animated.parallel([
                          Animated.timing(groupsOpacity, {
                            toValue: heightPercentageToDP("100%"),
                            duration: 30000,
                            useNativeDriver: false,
                          }),
                        ]).start(() => {}, onShowGroupsChanged(true));
                  }}
                >
                  <View style={styles.contactTabContainer}>
                    <Image
                      style={{
                        width: win.width / 13,
                        height: ratioProfile * 25,
                      }}
                      source={require("../assets/Images/customerListIcon.png")}
                    />
                    <Text style={styles.tabLeftText}>
                      {Translate.t("groupChat")}
                    </Text>
                    <View
                      style={{
                        position: "absolute",
                        right: 0,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingBottom: heightPercentageToDP("2%"),
                      }}
                    >
                      <Text style={styles.countText}>{groupCount}</Text>
                      {showGroups == false ? (
                        <Image
                          style={{
                            width: win.width / 18,
                            height: 8 * ratioDownForMoreIcon,
                          }}
                          source={require("../assets/Images/downForMoreIcon.png")}
                        />
                      ) : (
                        <Image
                          style={{
                            width: win.width / 19,
                            height: 8 * ratioUpIcon,
                          }}
                          source={require("../assets/Images/upIcon.png")}
                        />
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <Animated.View
                  style={
                    showGroups == false
                      ? styles.none
                      : (opacity = groupsOpacity)
                  }
                >
                  {groupHtml}
                </Animated.View>
              </View>
            </View>
            {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
            <View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.F0EEE9,
                  justifyContent: "center",
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    showFriends == true
                      ? Animated.parallel([
                          Animated.timing(friendsOpacity, {
                            toValue: heightPercentageToDP("0%"),
                            duration: 100,
                            useNativeDriver: false,
                          }),
                        ]).start(() => {}, onShowFriendsChanged(false))
                      : Animated.parallel([
                          Animated.timing(friendsOpacity, {
                            toValue: heightPercentageToDP("100%"),
                            duration: 30000,
                            useNativeDriver: false,
                          }),
                        ]).start(() => {}, onShowFriendsChanged(true));
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
                    <Text style={styles.tabLeftText}>
                      {Translate.t("friend")}
                    </Text>
                    <View
                      style={{
                        position: "absolute",
                        right: 0,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingBottom: heightPercentageToDP("2%"),
                      }}
                    >
                      <Text style={styles.countText}>{friendCount}</Text>
                      {showFriends == false ? (
                        <Image
                          style={{
                            width: win.width / 18,
                            height: 8 * ratioDownForMoreIcon,
                          }}
                          source={require("../assets/Images/downForMoreIcon.png")}
                        />
                      ) : (
                        <Image
                          style={{
                            width: win.width / 19,
                            height: 8 * ratioUpIcon,
                          }}
                          source={require("../assets/Images/upIcon.png")}
                        />
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <Animated.View
                  style={
                    showFriends == false
                      ? styles.none
                      : (opacity = friendsOpacity)
                  }
                >
                  {userHtml}
                </Animated.View>
              </View>
            </View>
            {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
          </View>
        </ScrollView>
        <View style={show == true ? styles.popUp : styles.none}>
          <View
            style={{
              zIndex: 1,
              borderWidth: 1,
              backgroundColor: "white",
              alignSelf: "center",
              marginTop: heightPercentageToDP("30%"),
              borderColor: Colors.D7CCA6,
              alignItems: "flex-start",
              paddingLeft: widthPercentageToDP("5%"),
              paddingRight: widthPercentageToDP("25%"),
            }}
          >
            <View
              style={{
                marginTop: heightPercentageToDP("3%"),
              }}
            >
              <Text style={{ fontSize: RFValue(14) }}>
                {getName(longPressObj)}
              </Text>
              <View
                style={{
                  marginTop: heightPercentageToDP("2%"),
                  justifyContent: "space-evenly",
                  height: heightPercentageToDP("35%"),
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (longPressObj.type == "user") {
                      db.collection("users")
                        .doc(String(user.id))
                        .collection("friends")
                        .where("id", "==", String(longPressObj.data.id))
                        .get()
                        .then((querySnapshot) => {
                          if (querySnapshot.size > 0) {
                            querySnapshot.forEach((documentSnapshot) => {
                              db.collection("users")
                                .doc(String(user.id))
                                .collection("friends")
                                .doc(documentSnapshot.id)
                                .set(
                                  {
                                    pinned:
                                      longPressObj["pinned"] == "" ||
                                      longPressObj["pinned"]
                                        ? false
                                        : true,
                                  },
                                  {
                                    merge: true,
                                  }
                                )
                                .then(() => {
                                  populateUser();
                                });
                            });
                          }
                        });
                    } else if (longPressObj.type == "folder") {
                      let update = {};
                      update["pinned"] =
                        longPressObj.data.data["pinned"] == "" ||
                        longPressObj.data.data["pinned"]
                          ? false
                          : true;
                      db.collection("users")
                        .doc(user.id.toString())
                        .collection("folders")
                        .doc(longPressObj.data.id.toString())
                        .set(update, {
                          merge: true,
                        })
                        .then(() => {
                          populateFolder();
                        });
                    } else if (longPressObj.type == "group") {
                      let update = {};
                      update["pinned_" + user.id] =
                        longPressObj.data.data["pinned_" + user.id] != false ||
                        longPressObj.data.data["pinned_" + user.id] == true
                          ? false : true
                      db.collection("chat")
                        .doc(longPressObj.data.id)
                        .set(update, {
                          merge: true,
                        })
                        .then(() => {
                          populateGroup();
                        });
                    }
                    onShowChanged(false);
                  }}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("upperFixed")}
                  </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (longPressObj.type == "user") {
                      db.collection("users")
                        .doc(String(user.id))
                        .collection("friends")
                        .where("id", "==", String(longPressObj.id))
                        .get()
                        .then((querySnapshot) => {
                          if (querySnapshot.size > 0) {
                            querySnapshot.forEach((documentSnapshot) => {
                              db.collection("users")
                                .doc(String(user.id))
                                .collection("friends")
                                .doc(documentSnapshot.id)
                                .set(
                                  {
                                    notify:
                                      longPressObj["notify"] == "" ||
                                      longPressObj["notify"]
                                        ? false
                                        : true,
                                  },
                                  {
                                    merge: true,
                                  }
                                )
                                .then(() => {
                                  populateUser();
                                });
                            });
                          }
                        });
                    } else if (longPressObj.type == "folder") {
                      let update = {};
                      update["notify"] =
                        longPressObj.data.data["notify"] == "" ||
                        longPressObj.data.data["notify"]
                          ? false
                          : true;
                      db.collection("users")
                        .doc(user.id.toString())
                        .collection("folders")
                        .doc(longPressObj.data.id.toString())
                        .set(update, {
                          merge: true,
                        })
                        .then(() => {
                          populateFolder();
                        });
                    } else if (longPressObj.type == "group") {
                      let update = {};
                      update["notify_" + user.id] =
                        longPressObj.data.data["notify_" + user.id] == "" ||
                        longPressObj.data.data["notify_" + user.id]
                          ? false
                          : true;
                      db.collection("chat")
                        .doc(longPressObj.data.id)
                        .set(update, {
                          merge: true,
                        })
                        .then(() => {
                          populateGroup();
                        });
                    }
                    onShowChanged(false);
                  }}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("notification")}OFF
                  </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (longPressObj.type == "user") {
                      db.collection("users")
                        .doc(String(user.id))
                        .collection("friends")
                        .where("id", "==", String(longPressObj.id))
                        .get()
                        .then((querySnapshot) => {
                          if (querySnapshot.size > 0) {
                            querySnapshot.forEach((documentSnapshot) => {
                              db.collection("users")
                                .doc(String(user.id))
                                .collection("friends")
                                .doc(documentSnapshot.id)
                                .set(
                                  {
                                    hide:
                                      longPressObj["hide"] == "" ||
                                      longPressObj["hide"]
                                        ? false
                                        : true,
                                  },
                                  {
                                    merge: true,
                                  }
                                )
                                .then(() => {
                                  populateUser();
                                });
                            });
                          }
                        });
                    } else if (longPressObj.type == "folder") {
                      let update = {};
                      update["hide"] =
                        longPressObj.data.data["hide"] == "" ||
                        longPressObj.data.data["hide"]
                          ? false
                          : true;
                      db.collection("users")
                        .doc(user.id.toString())
                        .collection("folders")
                        .doc(longPressObj.data.id.toString())
                        .set(update, {
                          merge: true,
                        })
                        .then(() => {
                          populateFolder();
                        });
                    } else if (longPressObj.type == "group") {
                      let update = {};
                      update["hide_" + user.id] =
                        longPressObj.data.data["hide_" + user.id] == "" ||
                        longPressObj.data.data["hide_" + user.id]
                          ? false
                          : true;
                      db.collection("chat")
                        .doc(longPressObj.data.id)
                        .set(update, {
                          merge: true,
                        })
                        .then(() => {
                          populateGroup();
                        });
                    }
                    onShowChanged(false);
                  }}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("nonRepresent")}
                  </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (longPressObj.type == "user") {
                      db.collection("users")
                        .doc(String(user.id))
                        .collection("friends")
                        .where("id", "==", String(longPressObj.data.id))
                        .get()
                        .then((querySnapshot) => {
                          if (querySnapshot.size > 0) {
                            querySnapshot.forEach((documentSnapshot) => {
                              db.collection("users")
                                .doc(String(user.id))
                                .collection("friends")
                                .doc(documentSnapshot.id)
                                .set(
                                  {
                                    delete:
                                      longPressObj.data["delete"] == "" ||
                                      longPressObj.data["delete"]
                                        ? false
                                        : true,
                                  },
                                  {
                                    merge: true,
                                  }
                                )
                                .then(() => {
                                  populateUser();
                                });
                            });
                          }
                        });
                    } else if (longPressObj.type == "folder") {
                      let update = {};
                      update["delete"] =
                        longPressObj.data.data["delete"] == "" ||
                        longPressObj.data.data["delete"]
                          ? false
                          : true;
                      db.collection("users")
                        .doc(user.id.toString())
                        .collection("folders")
                        .doc(longPressObj.data.id.toString())
                        .set(update, {
                          merge: true,
                        })
                        .then(() => {
                          populateFolder();
                        });
                    } else if (longPressObj.type == "group") {
                      let update = {};
                      update["delete_" + user.id] =
                        longPressObj.data.data["delete_" + user.id] == "" ||
                        longPressObj.data.data["delete_" + user.id]
                          ? false
                          : true;
                      db.collection("chat")
                        .doc(longPressObj.data.id)
                        .set(update, {
                          merge: true,
                        })
                        .then(() => {
                          populateGroup();
                        });
                    }
                    onShowChanged(false);
                  }}
                >
                  <Text style={styles.longPressText}>
                    {Translate.t("remove")}
                  </Text>
                </TouchableWithoutFeedback>
                {longPressObj.type == "user" ? (
                  <TouchableWithoutFeedback
                    onPressIn={() => onShowChanged(false)}
                    onPress={() => {
                      AsyncStorage.setItem(
                        "ids",
                        JSON.stringify([longPressObj.data.id.toString()])
                      ).then(() => {
                        AsyncStorage.setItem(
                          "tmpIds",
                          JSON.stringify([longPressObj.data.id.toString()])
                        ).then(() => {
                          props.navigation.navigate("GroupChatCreation");
                        });
                      });
                    }}
                  >
                    <Text style={styles.longPressText}>
                      {Translate.t("groupChatCreate")}
                    </Text>
                  </TouchableWithoutFeedback>
                ) : null}
                {longPressObj.type == "user" ? (
                  <TouchableWithoutFeedback
                    onPressIn={() => onShowChanged(false)}
                    onPress={() => {
                      AsyncStorage.setItem(
                        "ids",
                        JSON.stringify([longPressObj.data.id.toString()])
                      ).then(() => {
                        AsyncStorage.setItem(
                          "tmpIds",
                          JSON.stringify([longPressObj.data.id.toString()])
                        ).then(() => {
                          props.navigation.navigate("CreateFolder");
                        });
                      });
                    }}
                  >
                    <Text style={styles.longPressText}>
                      {Translate.t("createFolder")}
                    </Text>
                  </TouchableWithoutFeedback>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  none: {
    display: "none",
  },
  countText: {
    marginRight: widthPercentageToDP("3%"),
    fontSize: RFValue(12),
  },
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
    zIndex: 100,
    borderWidth: 1,
    alignSelf: "center",
    width: widthPercentageToDP("100%"),
    height: heightPercentageToDP("100%"),
    borderColor: Colors.D7CCA6,
    alignItems: "flex-start",
  },
});
