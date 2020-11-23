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
} from "react-native";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const { leftMessageBackground } = "#fff";
const { rightMessageBackground } = "#a0e75a";
const ratioSeenTick = width / 35 / 13;
export default function ChatContact({
  isSelf,
  contactID,
  contactName,
  seen,
  date,
}) {
  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView style={{ marginTop: heightPercentageToDP("1%") }}>
      {/*Left Side*/}
      <View style={isSelf ? styles.right : styles.left} collapsable={false}>
        <View>
          <Image
            style={[isSelf ? styles.none : styles.avatar]}
            source={require("../assets/Images/profileEditingIcon.png")}
          />
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
            <Image
              style={styles.contact_avatar}
              source={require("../assets/Images/profileEditingIcon.png")}
            />
            <Text style={styles.contact_name}>{contactName}</Text>
          </View>
        </TouchableHighlight>
        <View style={[isSelf ? styles.right_status : styles.left_status]}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    maxWidth: width - 160,
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
    borderRadius: width / 2,
    width: RFValue(30),
    height: RFValue(30),
    marginLeft: 15,
    marginRight: 5,
    backgroundColor: "#fff",
  },
  contact_avatar: {
    borderRadius: width / 2,
    borderColor: "#464A00",
    borderWidth: 1,
    width: RFValue(50),
    height: RFValue(50),
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: "#fff",
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
    width: 60,
    paddingLeft: 10,
    fontSize: RFValue(8),
    bottom: 12,
    left: 0,
    marginBottom: heightPercentageToDP("2%"),
  },
  right_status_text: {
    position: "absolute",
    textAlign: "right",
    width: 60,
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
});