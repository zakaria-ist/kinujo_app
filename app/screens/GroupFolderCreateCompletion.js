import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
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
import CustomHeader from "../assets/CustomComponents/CustomHeader";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";

const request = new Request();
const alert = new CustomAlert();

const win = Dimensions.get("window");
const ratioCancel = win.width / 20 / 15;
const ratioChat = win.width / 7 / 21;

export default function GroupFolderCreateCompletion(props) {
  return (
    <SafeAreaView>
      <CustomHeader onPress={() => props.navigation.navigate("Cart")} />
      <View
        style={{
          marginHorizontal: widthPercentageToDP("3%"),
          borderWidth: 2,
          height: heightPercentageToDP("70%"),
          borderColor: Colors.D7CCA6,
          backgroundColor: Colors.F6F6F6,
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => props.navigation.navigate("HomeGeneral")}
        >
          <Image
            style={{
              width: win.width / 20,
              height: 15 * ratioCancel,
              marginLeft: widthPercentageToDP("3%"),
              marginTop: heightPercentageToDP("1.5%"),
            }}
            source={require("../assets/Images/blackCancelIcon.png")}
          />
        </TouchableWithoutFeedback>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            style={{
              width: RFValue(80),
              height: RFValue(80),
              borderRadius: win.width / 2,
              marginTop: heightPercentageToDP("8%"),
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          />
          <View
            style={{
              marginTop: heightPercentageToDP("1.5%"),
              alignItems: "center",
            }}
          >
            <Text style={styles.text}>フォルダ名またはグループ名</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.text}>メンバー</Text>
              <Text style={styles.text}>（ 2 ）</Text>
            </View>
          </View>
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: heightPercentageToDP("8%"),
            }}
          >
            <View
              style={{
                alignItems: "center",
                marginRight: widthPercentageToDP("10%"),
              }}
            >
              <Image
                style={{
                  width: RFValue(50),
                  height: RFValue(50),
                  borderRadius: win.width / 2,
                  backgroundColor: Colors.E6DADE,
                }}
                source={require("../assets/Images/addMemberIcon.png")}
              />
              <Text style={styles.textForIcon}>メンバー追加</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Image
                style={{
                  width: RFValue(50),
                  height: RFValue(50),
                  borderRadius: win.width / 2,
                }}
                source={require("../assets/Images/profileEditingIcon.png")}
              />
              <Text style={styles.textForIcon}>髪長絹代</Text>
            </View>
            <View
              style={{
                alignItems: "center",
                marginLeft: widthPercentageToDP("10%"),
              }}
            >
              <Image
                style={{
                  width: RFValue(50),
                  height: RFValue(50),
                  borderRadius: win.width / 2,
                }}
                source={require("../assets/Images/profileEditingIcon.png")}
              />
              <Text style={styles.textForIcon}>髪長友子</Text>
            </View>
          </View>
          <Image
            style={{
              width: win.width / 7,
              height: 18 * ratioChat,

              alignSelf: "center",
              marginTop: heightPercentageToDP("5%"),
            }}
            source={require("../assets/Images/chatIcon.png")}
          />
          <Text style={styles.textForIcon}>トーク</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: RFValue(12),
  },
  textForIcon: {
    fontSize: RFValue(12),
    marginTop: heightPercentageToDP("1.5%"),
    alignSelf: "center",
  },
});
