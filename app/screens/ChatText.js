import React from "react";
import { InteractionManager } from 'react-native';

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
  Linking,
  SafeAreaView,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import AutoHeightImage from 'react-native-auto-height-image';
import { Colors } from "../assets/Colors.js";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Hyperlink from "react-native-hyperlink";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import CheckBox from "@react-native-community/checkbox";
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const { leftMessageBackground } = "#fff";
const { rightMessageBackground } = "#a0e75a";
const ratioSeenTick = width / 35 / 13;
const ratioImage = width / 250 / 3;
const request = new Request();
export default function ChatText({
  isSelf,
  text,
  date,
  seen,
  imageURL,
  showCheckBox,
  image,
  props,
  longPress,
  hyperLinkClicked
}) {

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

  return (
    <SafeAreaView>
      {/*Right Side*/}
      <View style={isSelf ? styles.right : styles.left} collapsable={false}>
        <View style={isSelf ? styles.selfPadding : styles.notSelfPadding}>
          {image && !isSelf ? (
            <Image
              style={[isSelf ? styles.nonae : styles.avatar]}
              source={{ uri: image }}
            />
          ) : (
            <Image
              style={[isSelf ? styles.nonae : styles.avatar]}
              source={require("../assets/Images/profileEditingIcon.png")}
            />
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
          {text ? (
            <View
              style={[
                styles.container,
                isSelf ? styles.right_chatbox : styles.left_chatbox,
              ]}
            >
              <Hyperlink
                linkStyle={{ color: "#2980b9" }}
                onLongPress={()=>{
                  if(longPress){
                    longPress();
                  }
                }}
                onPress={(url, text) => {
                }}
              >
                <Text>{text}</Text>
              </Hyperlink>
            </View>
          ) : (
            <View
              style={[
                styles.nonae,
                isSelf ? styles.right_chatbox : styles.left_chatbox,
              ]}
            >
              <Hyperlink
                linkStyle={{ color: "#2980b9" }}
                onPress={(url, text) => {
                  if(hyperLinkClicked){
                    hyperLinkClicked(url, text);
                  }
                }}
              >
                <Text>{text}</Text>
              </Hyperlink>
            </View>
          )}
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
          {/* {imageURL ? (
            <Text
              style={[
                isSelf
                  ? styles.right_status_text_image
                  : styles.left_status_text_image,
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
          ) : ( */}
          <Text
            style={[
              isSelf ? styles.right_status_text : styles.left_status_text,
            ]}
          >
            {seen && !isSelf ? (
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
          {/* )} */}
          {/* /////if Image exists////////////////////////////////////// */}
          {imageURL ? (
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text
                  style={[
                    isSelf
                      ? styles.right_status_time_image
                      : styles.left_status_time_image,
                  ]}
                >
                  {date}
                </Text>
                {seen && !isSelf ? (
                  <Image
                    source={require("../assets/Images/seenTick.png")}
                    style={
                      isSelf
                        ? styles.seenTickImageRight
                        : styles.seenTickImageLeft
                    }
                  />
                ) : (
                  <View></View>
                )}
              </View>
              <View style={{
                justifyContent: "flex-start"
              }}>
                <AutoHeightImage
                    width={RFValue(150)}
                source={{ uri: imageURL }}
              />
              </View>
            </View>
          ) : (
            <View></View>
          )}
          {/* ////////////////////////////////////////////////////////////// */}
          {imageURL ? (
            <View>
              {showCheckBox ? (
                <CheckBox
                  style={
                    isSelf
                      ? styles.checkBoxRightImage
                      : styles.checkBoxLeftImage
                  }
                  color={Colors.E6DADE}
                  uncheckedColor={Colors.E6DADE}
                  disabled={false}
                />
              ) : (
                <View></View>
              )}
            </View>
          ) : (
            <Text
              style={[
                isSelf ? styles.right_status_time : styles.left_status_time,
              ]}
            >
              {date}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // right_status_text_image: {
  //   position: "absolute",
  //   textAlign: "right",
  //   width: 60,
  //   paddingRight: 10,
  //   fontSize: RFValue(8),
  //   bottom: 12,
  //   right: 0,
  //   marginBottom: heightPercentageToDP("2%"),
  //   marginRight: widthPercentageToDP("30%"),
  // },
  seenTickImageRight: {
    position: "absolute",
    bottom: 25,
    right: 0,
    width: 60,
    marginRight: widthPercentageToDP("1%"),
    width: width / 35,
    height: ratioSeenTick * 10,
    resizeMode: "stretch",
  },
  seenTickImageLeft: {
    position: "absolute",
    bottom: 25,
    left: 0,
    width: 60,
    marginLeft: widthPercentageToDP("1%"),
    width: width / 35,
    height: ratioSeenTick * 10,
    resizeMode: "stretch",
  },
  checkBoxRight: {
    position: "absolute",
    right: 0,
  },
  checkBoxLeft: {
    position: "absolute",
    left: 0,
  },
  checkBoxRightImage: {
    position: "absolute",
    right: 0,
    marginRight: widthPercentageToDP("30%"),
    bottom: widthPercentageToDP("12%"),
  },
  checkBoxLeftImage: {
    position: "absolute",
    left: 0,
    marginBottom: heightPercentageToDP("2%"),
    marginLeft: widthPercentageToDP("30%"),
    bottom: widthPercentageToDP("12%"),
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    borderRadius: 3,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: width - 160,
    minHeight: 20,
  },
  avatar: {
    width: RFValue(30),
    height: RFValue(30),
    borderRadius: width / 2,
    marginLeft: 15,
    marginRight: 5,
    backgroundColor: "#fff",
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
  },
  right_chatbox: {
    backgroundColor: "#E6DADE",
    borderColor: "#E6DADE",
    fontSize: RFValue(10),
    borderRadius: 10,
    padding: 0,
    marginBottom: 10,
  },
  left_status: {
    position: "relative",
  },
  right_status: {
    position: "relative",
  },
  left_status_text: {
    position: "absolute",
    paddingLeft: 10,
    fontSize: RFValue(8),
    bottom: 12,
    left: 10,
    marginBottom: heightPercentageToDP("2%"),
  },
  right_status_text: {
    position: "absolute",
    paddingRight: 10,
    fontSize: RFValue(8),
    bottom: 12,
    right: 0,
    marginBottom: heightPercentageToDP("2%"),
  },
  left_status_text_image: {
    position: "absolute",
    paddingLeft: 10,
    fontSize: RFValue(8),
    bottom: 12,
    left: 10,
    marginBottom: heightPercentageToDP("2%"),
    marginLeft: widthPercentageToDP("33%"),
  },
  right_status_text_image: {
    position: "absolute",
    paddingRight: 10,
    fontSize: RFValue(8),
    bottom: 12,
    right: 0,
    marginBottom: heightPercentageToDP("2%"),
    marginRight: widthPercentageToDP("33%"),
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
  left_status_time_image: {
    position: "absolute",
    textAlign: "left",
    width: 60,
    marginLeft: widthPercentageToDP("45%"),
    fontSize: RFValue(8),
    bottom: 0,
    // left: 0,
    // marginLeft: widthPercentageToDP("30%"),
  },
  right_status_time_image: {
    position: "absolute",
    textAlign: "right",
    width: 60,
    marginRight: widthPercentageToDP("1%"),
    fontSize: RFValue(8),
    bottom: 0,
    right: 0,
    // marginRight: widthPercentageToDP("30%"),
  },
  right: {
    flexDirection: "row-reverse",
  },
  left: {
    flexDirection: "row",
  },
  selfPadding: {
    paddingRight: Math.min(20, widthPercentageToDP("3%")),
  },
  notSelfPadding: {
    paddingLeft: Math.min(20, widthPercentageToDP("1%")),
  },
});
