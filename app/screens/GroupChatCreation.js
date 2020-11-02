import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
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

export default function CreateFolder(props) {
  return (
    <SafeAreaView>
      <CustomHeader
        text="フォルダ作成"
        onPress={() => props.navigation.navigate("Cart")}
      />
      <TouchableWithoutFeedback
        onPress={() => props.navigation.navigate("GroupFolderCreateCompletion")}
      >
        <Text
          style={{
            fontSize: RFValue(14),
            right: 0,
            position: "absolute",
            marginTop: heightPercentageToDP("10%"),
            marginRight: widthPercentageToDP("8%"),
          }}
        >
          作成
        </Text>
      </TouchableWithoutFeedback>
      <View
        style={{
          marginTop: heightPercentageToDP("10%"),
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
          <Text style={styles.folderText}>グループ名</Text>
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              marginTop: heightPercentageToDP("3%"),
            }}
          >
            <Text style={{ fontSize: RFValue(12) }}>メンバー</Text>
            <Text style={{ fontSize: RFValue(12) }}>（ 2 ）</Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate("GroupChatMember")}
          >
            <View style={styles.memberListContainer}>
              <Image
                style={{
                  width: RFValue(40),
                  height: RFValue(40),
                  borderRadius: win.width / 2,
                  backgroundColor: Colors.E6DADE,
                }}
                source={require("../assets/Images/addMemberIcon.png")}
              />
              <Text style={styles.folderText}>メンバー追加</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.memberTabsContainer}>
            <Image
              style={{
                width: RFValue(40),
                height: RFValue(40),
                borderRadius: win.width / 2,
                backgroundColor: Colors.DCDCDC,
              }}
            />
            <Text style={styles.folderText}>髪長絹代</Text>
          </View>
          <View style={styles.memberTabsContainer}>
            <Image
              style={{
                width: RFValue(40),
                height: RFValue(40),
                borderRadius: win.width / 2,
                backgroundColor: Colors.DCDCDC,
              }}
            />
            <Text style={styles.folderText}>髪長友子</Text>
          </View>
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
    marginLeft: widthPercentageToDP("3%"),
  },
});
