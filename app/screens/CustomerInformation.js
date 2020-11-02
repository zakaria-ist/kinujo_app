import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";

const request = new Request();
const alert = new CustomAlert();

const win = Dimensions.get("window");
const ratioChatIcon = win.width / 12 / 21;
const ratioQRIcon = win.width / 13 / 21;
const ratioNext = win.width / 38 / 8;
const ratioProfileEditingIcon = win.width / 18 / 22;
export default function CustomerInformation(props) {
  const [user, onUserChanged] = React.useState({});

  if (!user.url) {
    request
      .get(props.route.params.url)
      .then(function (response) {
        onUserChanged(response.data);
      })
      .catch(function (error) {
        console.log(error);
        alert.warning(Translate.t("unkownError"));
      });
  }
  return (
    <SafeAreaView>
      <CustomHeader
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onBack={() => {
          props.navigation.pop();
        }}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        text={Translate.t("customerInformation")}
      />
      <View>
        <ImageBackground
          style={{
            width: widthPercentageToDP("100%"),
            height: heightPercentageToDP("30%"),
          }}
          source={require("../assets/Images/profileEditingIcon.png")}
        ></ImageBackground>
      </View>
      <View
        style={{
          marginTop: heightPercentageToDP("-7%"),
          width: widthPercentageToDP("100%"),
          left: 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginLeft: widthPercentageToDP("5%"),
          }}
        >
          <ImageBackground
            style={{
              width: widthPercentageToDP("22%"),
              height: widthPercentageToDP("22%"),
              borderWidth: 1,
              borderColor: Colors.E6DADE,
              backgroundColor: "white",
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          >
            <Image
              style={styles.cameraIconInsideProfilePicture}
              source={require("../assets/Images/cameraIcon.png")}
            />
          </ImageBackground>
          <View
            style={{
              width: "100%",
              marginLeft: widthPercentageToDP("5%"),
              marginTop: heightPercentageToDP("1%"),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(12),
                color: Colors.white,
              }}
            >
              {user.word}
            </Text>
            <View
              style={{
                alignItems: "center",
                position: "absolute",
                bottom: 0,
                flexDirection: "row",
                marginBottom: heightPercentageToDP(".5%"),
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(14),
                }}
              >
                {user.real_name ? user.real_name : user.nickname}
              </Text>
              <Image
                style={{
                  width: win.width / 18,
                  height: 25 * ratioProfileEditingIcon,
                  marginLeft: widthPercentageToDP("3%"),
                }}
                source={require("../assets/Images/profileEditingIcon.png")}
              />
            </View>
          </View>
        </View>
        <Text
          style={{
            fontSize: RFValue(10),
            marginLeft: widthPercentageToDP("5%"),
            marginTop: heightPercentageToDP("1.5%"),
          }}
        >
          KINUJO ID : {user.user_code}
        </Text>
        <Text style={styles.notes}>
          {Translate.t("note")}
          ：テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト。
        </Text>
        <TouchableWithoutFeedback
          onPress={() => props.navigation.navigate("CreateFolder")}
        >
          <View style={styles.firstTabContainer}>
            <Text style={styles.textInContainer}>
              {Translate.t("folderSetting")}
            </Text>
            <Image
              style={styles.nextIcon}
              source={require("../assets/Images/next.png")}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => props.navigation.navigate("Contact")}
        >
          <View style={styles.tabContainer}>
            <Text style={styles.textInContainer}>
              {Translate.t("sharingGroup")}
            </Text>
            <View
              style={{
                flexDirection: "row-reverse",
                position: "absolute",
                right: 0,
                alignItems: "center",
              }}
            >
              <Image
                style={styles.nextIcon}
                source={require("../assets/Images/next.png")}
              />
              <Text
                style={{
                  marginRight: widthPercentageToDP("10%"),
                  fontSize: RFValue(12),
                }}
              >
                QQ
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => props.navigation.navigate("AdvanceSetting", {
            "url" : props.route.params.url
          })}
        >
          <View style={styles.tabContainer}>
            <Text style={styles.textInContainer}>
              {Translate.t("advancedSetting")}
            </Text>
            <Image
              style={styles.nextIcon}
              source={require("../assets/Images/next.png")}
            />
          </View>
        </TouchableWithoutFeedback>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: heightPercentageToDP("2.5%"),
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                width: win.width / 12,
                height: 18 * ratioChatIcon,
              }}
              source={require("../assets/Images/chatIcon.png")}
            />
            <Text style={styles.textForQRandMessage}>
              {Translate.t("sendAMessage")}
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                width: win.width / 13,
                height: 21 * ratioQRIcon,
              }}
              source={require("../assets/Images/QRIcon.png")}
            />
            <Text style={styles.textForQRandMessage}>
              {Translate.t("QRCode")}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  notes: {
    marginHorizontal: widthPercentageToDP("5%"),
    marginTop: heightPercentageToDP("2%"),
    fontSize: RFValue(12),
  },
  tabContainer: {
    flexDirection: "row",
    height: heightPercentageToDP("5.2%"),
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: widthPercentageToDP("4%"),
    borderBottomWidth: 1,
    borderColor: Colors.F0EEE9,
  },
  firstTabContainer: {
    flexDirection: "row",
    height: heightPercentageToDP("5.2%"),
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: heightPercentageToDP("2%"),
    marginHorizontal: widthPercentageToDP("4%"),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.F0EEE9,
  },
  nextIcon: {
    width: win.width / 38,
    height: 15 * ratioNext,
    position: "absolute",
    right: 0,
  },
  textInContainer: {
    fontSize: RFValue(12),
  },
  textForQRandMessage: {
    fontSize: RFValue(12),
    marginTop: heightPercentageToDP("2%"),
  },
});
