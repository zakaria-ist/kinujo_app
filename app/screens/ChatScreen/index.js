import React, { useRef } from "react";
import { InteractionManager } from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  SafeAreaView,
} from "react-native";

import Spinner from "react-native-loading-spinner-overlay";
import { useStateIfMounted } from "use-state-if-mounted";
import { Colors } from "../../assets/Colors.js";
import { useIsFocused } from "@react-navigation/native";
import EmojiBoard from "react-native-emoji-board";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import AndroidKeyboardAdjust from "react-native-android-keyboard-adjust";
import CustomHeader from "../../assets/CustomComponents/ChatCustomHeaderWithBackArrow";
import CustomSelectHeader from "../../assets/CustomComponents/ChatSelectHeader";
import ChatText from "../ChatText";
import ChatContact from "../ChatContact";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../../../firebaseConfig.js";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Request from "../../lib/request";
import CustomAlert from "../../lib/alert";
import storage from "@react-native-firebase/storage";
import Clipboard from "@react-native-community/clipboard";
import moment from 'moment-timezone';
import * as Localization from "expo-localization";
import FooterChat from "./FooterChat.js";
import ListMessage from "./ListMessage.js";
import ChatPopup from "./ChatPopup.js";
const alert = new CustomAlert();
const { width } = Dimensions.get("window");
var uuid = require("react-native-uuid");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
if (Platform.OS === "android") {
  AndroidKeyboardAdjust.setAdjustResize();
}
const db = firebase.firestore();
const chatsRef = db.collection("chat");
const request = new Request();
let userId;
let groupID;
let groupName;
let userTotalReadMessageField;
let totalMessageCount = 0;
let previousMessageDateElse;
let smallestSeenCount = 0;
let seenMessageCount = [];
let updateFriend = false;
let chats = [];
let old30Chats = [];
let oldChats = [];
let imageMap = {};
let selects = [];
let day = new Date().getDate();
let tmpMultiSelect = false;
let old30LastDoc = null;
let isUserBlocked = false;
function checkUpdateFriend(user1, user2) {
  if (!updateFriend && user1 && user2 && user1 != user2) {
    db.collection("users")
      .doc(user1)
      .collection("friends")
      .where("id", "==", user2)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
        } else {
          request.addFriend(user1, user2);
        }
      });
    updateFriend = true;
  }
}
function getTime() {
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let day = new Date().getDate();
  let hour = String(new Date().getHours()).padStart(2, "0");
  let minute = ("0" + new Date().getMinutes()).slice(-2);
  let seconds = new Date().getSeconds();
  return (
    year + ":" + month + ":" + day + ":" + hour + ":" + minute + ":" + seconds
  );
}
let favIndex = -1;
export default function ChatScreen(props) {
  const [shouldShow, setShouldShow] = useStateIfMounted(false);
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);
  const [secretMode, setSecretMode] = useStateIfMounted(false);
  const [showPopUp, onShowPopUpChanged] = useStateIfMounted(false);
  const [newChats, setChats] = useStateIfMounted([]);
  const [chatHtml, onChatHtmlChanged] = useStateIfMounted([]);
  const [messages, setMessages] = useStateIfMounted("");
  const [showEmoji, onShowEmojiChanged] = useStateIfMounted(false);
  const [prevEmoji, setPrevEmoji] = useStateIfMounted("");
  const [showCheckBox, onShowCheckBoxChanged] = useStateIfMounted(false);
  const [userUrl, onUserUrlChanged] = useStateIfMounted("group");
  const [images, setImages] = useStateIfMounted([]);
  const [multiSelect, setMultiSelect] = useStateIfMounted(false);
  // const [user, processUser] = useStateIfMounted("");
  const [inputBarPosition, setInputBarPosition] = useStateIfMounted(0);
  const scrollViewReference = useRef();
  const isFocused = useIsFocused();
  groupID = props.route.params.groupID;
  groupName = props.route.params.groupName;
  let groupType = props.route.params.type;
  let favData = props.route.params.favData;
  const [longPressObj, onLongPressObjChanged] = useStateIfMounted({});
  const [name, onNameChanged] = useStateIfMounted("");
  const insets = useSafeAreaInsets();
  const myTimeZone = Localization.timezone;


  function findParams(data, param) {
    let tmps = data.split("?");
    if (tmps.length > 0) {
      let tmp = tmps[1];
      let params = tmp.split("&");
      let searchParams = params.filter((tmpParam) => {
        return tmpParam.indexOf(param) >= 0;
      });
      if (searchParams.length > 0) {
        let foundParam = searchParams[0];
        let foundParams = foundParam.split("=");
        if (foundParams.length > 0) {
          return foundParams[1];
        }
      }
    }
    return "";
  }

  React.useEffect(() => {
    hideEmoji();
    setMultiSelect(false);
    tmpMultiSelect = false;
    selects = []
    setChats([]);
  }, [!isFocused]);

  function redirectToChat(contactID, contactName) {
    AsyncStorage.getItem("user").then((url) => {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      userId = urls[urls.length - 1];

      let groupId;
      // let groupName;
      let deleted = "delete_" + userId;
      db.collection("chat")
        .where("users", "array-contains", userId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.docChanges().forEach((snapShot) => {
            if (
              snapShot.doc.data().type != "groups" &&
              snapShot.doc.data().users.length == 2
            ) {
              let users = snapShot.doc.data().users;
              for (var i = 0; i < users.length; i++) {
                if (users[i] == contactID) {
                  groupId = snapShot.doc.id;
                }
              }
            }
          });
          if (groupId != null) {
            db.collection("chat")
              .doc(groupId)
              .set(
                {
                  [deleted]: false,
                },
                {
                  merge: true,
                }
              );
            AsyncStorage.setItem(
              "chat",
              JSON.stringify({
                groupID: groupId,
                groupName: contactName,
              })
            ).then(() => {
              props.navigation.goBack();
            });
          } else {
            let ownMessageUnseenField = "unseenMessageCount_" + userId;
            let friendMessageUnseenField = "unseenMessageCount_" + contactID;
            let ownTotalMessageReadField = "totalMessageRead_" + userId;
            let friendTotalMessageReadField = "totalMessageRead_" + contactID;
            db.collection("chat")
              .add({
                groupName: contactName,
                users: [userId, contactID],
                totalMessage: 0,
                [ownMessageUnseenField]: 0,
                [friendMessageUnseenField]: 0,
                [ownTotalMessageReadField]: 0,
                [friendTotalMessageReadField]: 0,
              })
              .then(function (docRef) {
                AsyncStorage.setItem(
                  "chat",
                  JSON.stringify({
                    groupID: docRef.id,
                    groupName: contactName,
                  })
                ).then(() => {
                  props.navigation.goBack();
                });
              });
          }
        });
    });
  }

  async function getName(ownId, data) {
    if (data.type && data.type == "group") {
      return data.groupName;
    }
    if (data.users.length > 2) return data.groupName;
    let users = data.users.filter((user) => {
      return user != ownId;
    });
    let snapShot = await db
      .collection("users")
      .doc(ownId)
      .collection("customers")
      .get();

    tmpName = "";
    snapShot.forEach((docRef) => {
      if (docRef.data().displayName && docRef.id == users[0]) {
        tmpName = docRef.data().displayName;

        if (docRef.data().secretMode) {
          setSecretMode(true);
        }
      }
    });
    if (tmpName) return tmpName;
    if (users.length > 0) {
      let user = users[0];
      onUserUrlChanged("profiles/" + user);
      user = await request.get("profiles/" + user);
      user = user.data;

      return user.nickname;
    }
    return "";
  }

  const onClick = (emoji) => {
    {
      {
        messages == ""
          ? setMessages(emoji.code)
          : setMessages(messages + emoji.code);
      }
    }
    setPrevEmoji(emoji.code);
  };
  const onRemove = () => {
    setMessages(messages.slice(0, -2));
  };
  const [textInputHeight, setTextInputHeight] = useStateIfMounted(
    heightPercentageToDP("8%")
  );
  function handleEmojiIconPressed() {
    if (showEmoji == false) {
      onShowEmojiChanged(true);
      setInputBarPosition(heightPercentageToDP("30%"));
      scrollViewReference.current.scrollToEnd();
    } else {
      hideEmoji();
    }
    setShouldShow(false);

    Keyboard.dismiss();
  }
  function hideEmoji() {
    onShowEmojiChanged(false);
    setInputBarPosition(-2);
  }

  function selectedChat(chatId) {
    let tmpSelects = selects.filter((select) => {
      return select.id == chatId;
    });
    return tmpSelects.length > 0;
  }

  function getDate(dateString) {
    let date = dateString.split(":");
    let tmpYear = date[0];
    let tmpMonth = date[1];
    let tmpDay = date[2]; //message created at
    let tmpHours = date[3];
    let tmpMinutes = date[4];
    let tmpSeconds = date[5];

    return new Date(
      tmpYear,
      tmpMonth - 1,
      tmpDay,
      tmpHours,
      tmpMinutes,
      tmpSeconds
    );
  }

  function processOldChat(tmpChats) { }

  function processOld30Chat(tmpChats) { }

  function processChat(tmpChats) { }

  async function updateChats(chats) {
    chats = chats.map((chat) => {
      chat.first = false;

      if (selects.includes(chat.id)) {
        chat.selected = true;
      }
      return chat;
    });

    if (favData) {
      for (let i = 0; i < chats.length; i++) {
        let chat = chats[i];
        if (favData.createdAt == chat.data.createdAt && favData.message == chat.data.message) {
          favIndex = i;
          console.log('favIndex', favIndex);
        }
      }
    }

    //remove duplicates
    // chats = chats.filter((v, i , a)=>a.findIndex(t=>(t.id === v.id))===i)
    let last = "";
    for (let i = 0; i < chats.length; i++) {
      let chat = chats[i];
      let dates = chat.data.createdAt.split(":");
      let date = dates[0] + ":" + dates[1] + ":" + dates[2];
      if (date != last) {
        chats[i].first = true;
        last = date;
      }

    }
    setChats(chats);
  }

  async function firstLoad(data) {
    chats = [];
    const updateHtml = [];
    onChatHtmlChanged(updateHtml);
    let url = await AsyncStorage.getItem("user");
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    userId = urls[urls.length - 1];

    getName(userId, data).then((name) => {
      onNameChanged(name);
    });

    userTotalReadMessageField = "totalMessageRead_" + userId;
    let documentSnapshot = await chatsRef.doc(groupID).get();
    if (documentSnapshot && documentSnapshot.data()) {
      let tmpUsers = documentSnapshot.data().users;
      tmpUsers = tmpUsers.filter((user) => {
        return user != userId;
      });

      // check if me is blocked by other party
      let blockerUser = tmpUsers;
      if (blockerUser) {
        if (blockerUser.length > 0) {
          blockerUser = blockerUser[0];
        }
        let CustSnapShots = await db
          .collection("users")
          .doc(String(blockerUser))
          .collection("customers")
          .get();
        CustSnapShots.forEach((CustSnapShot) => {
          console.log('CustSnapShot.id', CustSnapShot.id);
          if (CustSnapShot.id == String(userId)) {
            isUserBlocked = CustSnapShot.data().blockMode ? true : false;
          }
        });
        console.log('ifBlockUser Block', isUserBlocked);
      }

      let images = await request.post("user/images", {
        users: tmpUsers.length == 1 ? tmpUsers : documentSnapshot.data().users,
      });
      setImages(images.data.images);
      //   setImages(images.data.images);
      // if (tmpUsers.length == 1) {
      //   let images = await request.post("user/images", {
      //     users: tmpUsers,
      //   });
      //   setImages(images.data.images);
      // } else {
      //   let images = await request.post("user/images", {
      //     users: documentSnapshot.data().users,
      //   });
      //   setImages(images.data.images);
      // }
      if (documentSnapshot.data()["popup_addfriend_" + userId]) {
        alert.warning(Translate.t("please_add_friend"));
      }

      let users = documentSnapshot.data().users;
      if (users.length == 2) {
        checkUpdateFriend(userId, users[0]);
        checkUpdateFriend(userId, users[1]);
      }
      totalMessageCount = documentSnapshot.data().totalMessage;

      users.map(user => {
        totalMessageSeenCount = "totalMessageRead_" + user;
        seenMessageCount.push(documentSnapshot.data()[totalMessageSeenCount]);
      })

      smallestSeenCount = seenMessageCount[0];
      seenMessageCount.map(msgCount => {
        if (smallestSeenCount > msgCount) {
          smallestSeenCount = msgCount;
        }
      })

      previousMessageDateToday = null;
      previousMessageDateYesterday = null;
      previousMessageDateElse = null;
      tmpMessageCount = 0;

      // Read all message
      chatsRef.doc(groupID).update({
        [userTotalReadMessageField]: totalMessageCount
      })

      let build = chatsRef
        .doc(groupID)
        .collection("messages")
        .orderBy("timeStamp", "asc");


      this.unsub = build
        .onSnapshot(
          {
            includeMetadataChanges: false,
          },
          (querySnapShot) => {
            querySnapShot.forEach((snapShot) => {
              if (snapShot && snapShot.exists) {
                let tmpChats = chats.filter((chat) => {
                  return chat.id == snapShot.id;
                });
                if (tmpChats.length == 0) {
                  chats.push({
                    id: snapShot.id,
                    data: snapShot.data(),
                  });
                } else {
                  chats = chats.map((chat) => {
                    if (chat.id == snapShot.id) {
                      chat.data = snapShot.data();
                    }
                    return chat;
                  });
                }
              }
            });
            processChat(chats);
            updateChats(oldChats.concat(old30Chats, chats))
          }
        );

      if (old30LastDoc) {
        chatsRef.doc(groupID).collection("messages").orderBy("timeStamp", "asc").endAt(old30LastDoc).get().then((querySnapShot) => {
          querySnapShot.docs.map((snapShot) => {
            let tmpChats = oldChats.filter((chat) => {
              return chat.id == snapShot.id;
            });
            if (tmpChats.length == 0) {
              oldChats.push({
                id: snapShot.id,
                data: snapShot.data(),
              });
            } else {
              oldChats = oldChats.map((chat) => {
                if (chat.id == snapShot.id) {
                  chat.data = snapShot.data();
                }
                return chat;
              });
            }
          })
          processOldChat(oldChats);
          updateChats(oldChats.concat(old30Chats, chats))
        })
      }
    }
  }

  React.useEffect(() => {
    if (!multiSelect) {
      scrollViewReference.current.scrollToEnd({ animated: true });
    }
  }, [chatHtml]);

  React.useEffect(() => {
    if (!isFocused) {
      onNameChanged("");
      setShouldShow(false);
      processChat([]);
      processOld30Chat([]);
      processOldChat([]);
      setImages([""]);
      chats = [];
      old30Chats = [];
      if (this.unsub) {
        this.unsub();
      }
      if (this.unsub1) {
        this.unsub1();
      }
    }
    if (props.route.params.groupName) {
      onNameChanged(props.route.params.groupName);
    }

    InteractionManager.runAfterInteractions(() => {
      chatsRef
        .doc(groupID)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            if (doc.id == groupID) {
              firstLoad(doc.data());
            }
          }
        })
        .then(function () { });
    });

    return function () {
      if (this?.unsub) {
        this.unsub();
      }
      if (this?.unsub1) {
        this.unsub1();
      }
      setShouldShow(false);
      onShowPopUpChanged(false);
      onChatHtmlChanged([]);
      tmpChatHtml = [];
    };
  }, [isFocused]);

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ];

  const onSendImage = (response) => {
    if (response.uri) {
      if (response.type.includes("image")) {
        const reference = storage().ref(uuid.v4() + ".png");

        let imagePath = Platform.select({
          android: response.path,
          ios: response.uri.replace("file://", "")
        })

        reference
          .putFile(imagePath)
          .then((response) => {
            reference.getDownloadURL().then((url) => {
              let createdAt = getTime();

              chatsRef
                .doc(groupID)
                .collection("messages")
                .add({
                  userID: userId,
                  createdAt: createdAt,
                  message: "Photo",
                  timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                  image: url,
                })
                .then(function () { });
            });
          })
          .catch((error) => { });
      } else {
        alert.warning(Translate.t("image_allowed"))
      }
    }
  }

  const onCopy = () => { Clipboard.setString(longPressObj.message); onShowPopUpChanged(false) }

  const onFoward = () =>
    props.navigation.navigate("ChatListForward", {
      message: longPressObj.message,
      contactID: longPressObj.contactID,
      contactName: longPressObj.contactName,
      image: longPressObj.image,
      groupID: groupID,
      groupName: groupName,
      groupType: groupType ? groupType : "",
    })


  const onCancel = (isOnlyme) => {

    let query = "delete"

    if (isOnlyme) {
      query = `delete_${userId}`
    }
    let update = {};
    update[query] = longPressObj.data[query]
      ? false
      : true;
    db.collection("chat")
      .doc(groupID)
      .collection("messages")
      .doc(longPressObj.id)
      .set(update, {
        merge: true,
      });

    chats = chats.map((chat) => {
      if (chat.id == longPressObj.id) {
        chat.data[query] = update[query]
      }
      return chat;
    })
    oldChats = oldChats.map((chat) => {
      if (chat.id == longPressObj.id) {
        chat.data[query] = update[query]
      }
      return chat;
    })
    old30Chats = old30Chats.map((chat) => {
      if (chat.id == longPressObj.id) {
        chat.data[query] = update[query]
      }
      return chat;
    })

    processChat(chats);
    processOldChat(oldChats);
    processOld30Chat(old30Chats);
    onShowPopUpChanged(false);
  }

  const onAddToFav = () => {
    db.collection("users")
      .doc(userId)
      .collection("favouriteMessages")
      .doc(String(longPressObj.id))
      .set({
        createdAt: longPressObj.data.createdAt,
        message: longPressObj.message,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        groupID: groupID,
        groupName: groupName,
        groupType: groupType ? groupType : "",
        senderId: String(longPressObj.data.userID)
      })
      .then(() => {
        onShowPopUpChanged(false);
        alert.warning(Translate.t("msg_favourite_added"));
      });
  }


  const onMutiSelect = () => {
    setMultiSelect(true);
    tmpMultiSelect = true;
    selects.push({
      id: longPressObj.id,
      message: longPressObj.message,
      contactID: longPressObj.contactID,
      contactName: longPressObj.contactName,
      image: longPressObj.image
    });
    onShowPopUpChanged(false);
  }

  const onSendMsg = () => {
    console.log('press', isUserBlocked);
    if (!isUserBlocked) {
      let tmpMessage = messages;
      setMessages("");
      let createdAt = getTime();
      if (tmpMessage) {
        let doc = db
          .collection("chat")
          .doc(groupID)
          .collection("messages")
          .doc();
        doc
          .set({
            userID: userId,
            createdAt: createdAt,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: tmpMessage,
          })
          .then((item) => { });
      }
    } else {
      setMessages("");
    }
  }

  const onShareContact = () =>
    props.navigation.navigate("ContactShare", {
      groupID: groupID,
    })

  const scrollToEnd = () => {
    scrollViewReference.current.scrollToEnd({
      animated: true,
    })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Spinner
        visible={spinner}
        textContent={"Loading..."}
        // textStyle={styles.spinnerTextStyle}
      />
      {!multiSelect ? (
        <CustomHeader
          text={Translate.t("chat")}
          // onBack={() => props.navigation.goBack()}
          onBack={() => props.navigation.navigate("ChatList")}
          images={images}
          name={name} userUrl={userUrl}
          onFavoritePress={() => props.navigation.navigate("Favorite")}
          onPress={() => props.navigation.navigate("Cart")}
        />
      ) : (
        <CustomSelectHeader
          onSend={() => {
            if (selects.length > 0) {
              props.navigation.navigate("ChatListForward", {
                messages: selects,
                groupID: groupID,
                groupName: groupName,
                groupType: groupType ? groupType : "",
              });
            }
          }}
          onCancel={() => {
            setMultiSelect(false);
            tmpMultiSelect = false;
            selects = [];
            processChat(chats);
            processOld30Chat(old30Chats);
            processOldChat(oldChats);
          }}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS == "ios" ? 20 : 0}
        style={{ flex: 1 }}
      >
        <EmojiBoard
          numCols={parseInt(heightPercentageToDP("30%") / 60)}
          showBoard={showEmoji}
          style={{
            height: heightPercentageToDP("50%"),
            marginBottom: heightPercentageToDP("10%"),
          }}
          containerStyle={{
            height: heightPercentageToDP("30%"),
          }}
          onClick={onClick}
          onRemove={onRemove}
        />

        <ListMessage
          ref={scrollViewReference}
          newChats={newChats}
          groupID={groupID}
          userId={userId}
          tmpMultiSelect={tmpMultiSelect}
          parentProps={props}

          day={day}
          onLongPressObjChanged={onLongPressObjChanged}
          onShowPopUpChanged={onShowPopUpChanged}
          redirectToChat={redirectToChat}
          tmpMultiSelect={tmpMultiSelect}
          selectedChat={selectedChat}
          selects={selects}
          processOldChat={processOldChat}
          oldChats={oldChats}
          findParams={findParams}
          request={request}
          showCheckBox={showCheckBox}
          imageMap={imageMap}
          updateChats={updateChats}
          previousMessageDateElse={previousMessageDateElse}
          favIndex={favIndex}
        />

        <ChatPopup
          showPopUp={showPopUp}
          onCopy={onCopy}
          onFoward={onFoward}
          onCancel={onCancel}
          onAddToFav={onAddToFav}
          onMutiSelect={onMutiSelect}
          onShowPopUpChanged={onShowPopUpChanged}
        />


        {/* Bottom Area */}

        <FooterChat
          inputBarPosition={inputBarPosition}
          textInputHeight={textInputHeight}
          shouldShow={shouldShow}
          hideEmoji={hideEmoji}
          onHide={() => {
            hideEmoji();
            setShouldShow(!shouldShow);
          }}

          onContentSizeChange={scrollToEnd}
          messages={messages}
          onChangeText={(value) => setMessages(value)}
          handleEmojiIconPressed={handleEmojiIconPressed}
          shareContact={onShareContact}
          onSendMsg={onSendMsg}
          onSendImage={onSendImage}
        />

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
