import React from "react";
import {
  Image,
  View,
  Dimensions,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { useIsFocused } from "@react-navigation/native";
import { Colors } from "../Colors";
import Translate from "../Translates/Translate";
import PersonIcon from "../icons/person.svg";
import Request from "../../lib/request";
import AsyncStorage from "@react-native-community/async-storage";

const request = new Request();

export default function CustomKinujoWord({
  onPress,
  name,
  accountType,
  editProfile,
}) {
  const isFocused = useIsFocused();
  const [user, onUserChanged] = React.useState({});
  const win = Dimensions.get("window");
  const ratioNext = win.width / 38 / 8;
  React.useEffect(() => {
    AsyncStorage.getItem("user").then(function (url) {
      request.get(url).then((response) => {
        onUserChanged(response.data);
      });
    });
  }, [isFocused]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <SafeAreaView
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.F0EEE9,
          height: heightPercentageToDP("10%"),
        }}
      >
        {user && user.image ? (
          <Image
            style={{
              borderRadius: win.width / 2,
              marginLeft: widthPercentageToDP("8%"),
            }}
            source={{ uri: user.image.image }}
            width={RFValue(40)}
            height={RFValue(40)}
          />
        ) : (
          <PersonIcon
            style={{
              borderRadius: win.width / 2,
              marginLeft: widthPercentageToDP("8%"),
            }}
            width={RFValue(40)}
            height={RFValue(40)}
          />
        )}

        <View style={{ marginLeft: widthPercentageToDP("3%") }}>
          {name ? (
            <Text
              style={{
                fontSize: RFValue(12),
              }}
            >
              {name}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: RFValue(12),
              }}
            >
              {user.nickname}
            </Text>
          )}
          <Text
            style={{
              fontSize: RFValue(12),
            }}
          >
            {user.is_seller && !user.is_master
              ? Translate.t("storeAccount")
              : ""}
          </Text>

          {editProfile == "editProfile" ? (
            <Text
              style={{
                fontSize: RFValue(12),
              }}
            >
              {Translate.t("profileEdit")}
            </Text>
          ) : null}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({});
