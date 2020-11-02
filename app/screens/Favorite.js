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
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
const win = Dimensions.get("window");
export default function Favorite(props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        text="お気に入り"
        onPress={() => props.navigation.navigate("Cart")}
        onBack={() => props.navigation.pop()}
      />
      <View style={{ marginHorizontal: widthPercentageToDP("3%") }}>
        <View style={styles.firstTabContainer}>
          <Image
            style={{
              width: RFValue(40),
              height: RFValue(40),
              borderRadius: win.width / 2,
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          />
          <View style={styles.descriptionContainer}>
            <Text style={styles.tabContainerText}>グループ名</Text>
            <Text style={styles.tabContainerText}>髪長：こんにちは！</Text>
          </View>
          <Text style={styles.dateText}>00：00</Text>
        </View>
        <View style={styles.tabContainer}>
          <Image
            style={{
              width: RFValue(40),
              height: RFValue(40),
              borderRadius: win.width / 2,
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          />
          <View style={styles.descriptionContainer}>
            <Text style={styles.tabContainerText}>髪長友子</Text>
            <Text style={styles.tabContainerText}>こんにちは</Text>
          </View>
          <Text style={styles.dateText}>00：00</Text>
        </View>

        <View style={styles.tabContainer}>
          <Image
            style={{
              width: RFValue(40),
              height: RFValue(40),
              borderRadius: win.width / 2,
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          />
          <View style={styles.descriptionContainer}>
            <Text style={styles.tabContainerText}>●●●●●</Text>
            <Text style={styles.tabContainerText}>
              よろしくお願いいたします！
            </Text>
          </View>
          <Text style={styles.dateText}>昨日</Text>
        </View>

        <View style={styles.tabContainer}>
          <Image
            style={{
              width: RFValue(40),
              height: RFValue(40),
              borderRadius: win.width / 2,
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          />
          <View style={styles.descriptionContainer}>
            <Text style={styles.tabContainerText}>★★★★★</Text>
            <Text style={styles.tabContainerText}>よろしく～</Text>
          </View>
          <Text style={styles.dateText}>〇曜日</Text>
        </View>

        <View style={styles.tabContainer}>
          <Image
            style={{
              width: RFValue(40),
              height: RFValue(40),
              borderRadius: win.width / 2,
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          />
          <View style={styles.descriptionContainer}>
            <Text style={styles.tabContainerText}>◇◇◇</Text>
            <Text style={styles.tabContainerText}>●●：よろしく～</Text>
          </View>
          <Text style={styles.dateText}>〇曜日</Text>
        </View>

        <View style={styles.tabContainer}>
          <Image
            style={{
              width: RFValue(40),
              height: RFValue(40),
              borderRadius: win.width / 2,
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          />
          <View style={styles.descriptionContainer}>
            <Text style={styles.tabContainerText}>●●●●●</Text>
            <Text style={styles.tabContainerText}>
              よろしくお願いいたします！
            </Text>
          </View>
          <Text style={styles.dateText}>9/14</Text>
        </View>

        <View style={styles.tabContainer}>
          <Image
            style={{
              width: RFValue(40),
              height: RFValue(40),
              borderRadius: win.width / 2,
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          />
          <View style={styles.descriptionContainer}>
            <Text style={styles.tabContainerText}>■■■■</Text>
            <Text style={styles.tabContainerText}>よろしく～</Text>
          </View>
          <Text style={styles.dateText}>9/14</Text>
        </View>

        <View style={styles.tabContainer}>
          <Image
            style={{
              width: RFValue(40),
              height: RFValue(40),
              borderRadius: win.width / 2,
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          />
          <View style={styles.descriptionContainer}>
            <Text style={styles.tabContainerText}>〇〇〇〇〇〇</Text>
            <Text style={styles.tabContainerText}>よろしく～</Text>
          </View>
          <Text style={styles.dateText}>9/14</Text>
        </View>
      </View>
      <Image
        style={{
          width: RFValue(45),
          height: RFValue(45),
          borderRadius: win.width / 2,
          backgroundColor: "white",
          zIndex: 1,
          position: "absolute",
          bottom: 0,
          right: 0,
          marginBottom: heightPercentageToDP("10%"),
          marginRight: widthPercentageToDP("5%"),
        }}
        source={require("../assets/Images/searchIcon.png")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  descriptionContainer: {
    marginLeft: widthPercentageToDP("5%"),
    justifyContent: "center",
  },
  firstTabContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.F0EEE9,
    paddingVertical: heightPercentageToDP("1%"),
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: Colors.F0EEE9,
    paddingVertical: heightPercentageToDP("1%"),
  },
  tabContainerText: {
    fontSize: RFValue(12),
  },
  dateText: {
    position: "absolute",
    right: 0,
    fontSize: RFValue(12),
    alignSelf: "center",
  },
});
