import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Switch,
  TouchableHighlight,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  SafeAreaView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import CheckBox from "@react-native-community/checkbox";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig.js";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { withNavigation } from "react-navigation";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import DefaultAvatar from "../assets/icons/default_avatar.svg";
const db = firebase.firestore();
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const { leftMessageBackground } = "#fff";
const { rightMessageBackground } = "#a0e75a";
const ratioSeenTick = width / 35 / 13;
const request = new Request();
let userId;
export default function ChatContact({
  isSelf,
  contactID,
  contactName,
  seen,
  date,
  props,
  showCheckBox,
  image,
  longPress,
  press
}) {
  const [contactImage, setContactImage] = React.useState("");

  React.useEffect(() => {
    if (contactID) {
      request.get("profiles/" + contactID).then((response) => {
        if (response.data.image) {
          setContactImage(response.data.image.image);
        }
      });
    }
  }, [contactID]);
  return (
    <TouchableWithoutFeedback
      onLongPress={
        ()=>{
          console.log("OONG")
          if(longPress){
            longPress();
          }
        }
      }
      onPress={() => {
        if(press){
          press();
        }
      }}
    >
      <SafeAreaView style={{ marginTop: heightPercentageToDP("1%") }}>
        {/*Left Side*/}
        <View style={isSelf ? styles.right : styles.left} collapsable={false}>
          <View style={isSelf ? styles.selfPadding : styles.notSelfPadding}>
            {image && !isSelf ? (
              <Image
                style={[isSelf ? styles.none : styles.avatar]}
                source={image ? { uri: image } : require("../assets/Images/profileEditingIcon.png")}
              />
            ) : (
              <View></View>
            )}
          </View>
          <View
            style={[
              styles.triangle,
              isSelf ? styles.right_triangle : styles.left_triangle,
            ]}
          />
          <TouchableHighlight
            activeOpacity={1}
            disabled={true}
            onLongPress={() => {
              // this.props.onMessageLongPress(this[`item_${this.props.rowId}`], 'text', parseInt(this.props.rowId), changeEmojiText(this.props.message.content, 'en').join(''), message)
            }}
            onPress={() => {
              // this.props.onMessagePress('text', parseInt(this.props.rowId), changeEmojiText(this.props.message.content, 'en').join(''), message)
            }}
          >
            <View
              style={[
                styles.container,
                isSelf ? styles.right_chatbox : styles.left_chatbox,
              ]}
            >
              {contactImage ? (
                <Image
                  style={styles.contact_avatar}
                  source={{ uri: contactImage }}
                />
              ) : (
                <DefaultAvatar
                  style={styles.contact_avatar}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.contact_name}>{contactName}</Text>
            </View>
          </TouchableHighlight>
          <View style={[isSelf ? styles.right_status : styles.left_status]}>
            {showCheckBox ? (
              <CheckBox
                style={isSelf ? styles.checkBoxRight : styles.checkBoxLeft}
                color={Colors.E6DADE}
                uncheckedColor={Colors.E6DADE}
                disabled={false}
              />
            ) : (
              <View></View>
            )}
            <Text
              style={[
                isSelf ? styles.right_status_text : styles.left_status_text,
              ]}
            >
              {seen ? (
                <Image
                  source={require("../assets/Images/seenTick.png")}
                  style={{
                    width: width / 35,
                    height: ratioSeenTick * 10,
                    resizeMode: "stretch",
                  }}
                />
              ) : (
                ""
              )}
            </Text>
            <Text
              style={[
                isSelf ? styles.right_status_time : styles.left_status_time,
              ]}
            >
              {date}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  checkBoxRight: {
    position: "absolute",
    right: 0,
  },
  checkBoxLeft: {
    position: "absolute",
    left: 0,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    // maxWidth: width - 160,
    minHeight: 20,
  },
  left_status_time: {
    position: "absolute",
    textAlign: "left",
    width: 60,
    paddingLeft: 10,
    fontSize: RFValue(8),
    bottom: 12,
    left: 0,
  },
  right_status_time: {
    position: "absolute",
    textAlign: "right",
    width: 60,
    paddingRight: 10,
    fontSize: RFValue(8),
    bottom: 12,
    right: 0,
  },
  avatar: {
    width: RFValue(30),
    height: RFValue(30),
    borderRadius: width / 2,
    marginLeft: 15,
    marginRight: 5,
    backgroundColor: "#fff",
  },
  contact_avatar: {
    borderRadius: RFValue(35) / 2,
    borderColor: "#464A00",
    borderWidth: 1,
    width: RFValue(35),
    height: RFValue(35),
    marginLeft: 5,
    marginRight: 5,
  },
  contact_name: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  nonae: {
    display: "none",
  },
  chat_image: {
    width: 100,
    height: 100,
  },
  subEmojiStyle: {
    width: 25,
    height: 25,
  },
  triangle: {
    width: 0,
    height: 0,
    zIndex: 999,
    borderWidth: 6,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderColor: "#fff",
    marginTop: 16,
  },
  left_triangle: {
    borderLeftWidth: 0,
    borderRightWidth: Platform.OS === "android" ? 6 : 10,
    marginLeft: 5,
  },
  right_triangle: {
    borderRightWidth: 0,
    borderLeftWidth: Platform.OS === "android" ? 6 : 10,
    borderColor: "#a0e75a",
    marginRight: 5,
    borderColor: "transparent",
  },
  left_chatbox: {
    backgroundColor: "#fff",
    borderColor: "#fff",
    fontSize: RFValue(10),
    borderRadius: 10,
    padding: 0,
    marginBottom: 10,
    overflow: "hidden",
  },
  right_chatbox: {
    backgroundColor: "#E6DADE",
    borderColor: "#E6DADE",
    fontSize: RFValue(10),
    borderRadius: 10,
    padding: 0,
    marginBottom: 10,
    overflow: "hidden",
  },
  left_status: {
    position: "relative",
  },
  right_status: {
    position: "relative",
  },
  left_status_text: {
    position: "absolute",
    textAlign: "left",
    paddingLeft: 10,
    fontSize: RFValue(8),
    bottom: 12,
    left: 10,
    marginBottom: heightPercentageToDP("2%"),
  },
  right_status_text: {
    position: "absolute",
    textAlign: "right",
    paddingRight: 10,
    fontSize: RFValue(8),
    bottom: 12,
    right: 0,
    marginBottom: heightPercentageToDP("2%"),
  },
  right: {
    flexDirection: "row-reverse",
  },
  left: {
    flexDirection: "row",
  },
  selfPadding: {
    paddingRight: widthPercentageToDP("3%"),
  },
  notSelfPadding: {
    paddingLeft: widthPercentageToDP("1%"),
  },
});
