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
  userUrl,
}) {
  const isFocused = useIsFocused();
  const [user, onUserChanged] = React.useState({});
  // const [userAuthorityId, onUserAuthorityIdChanged] = React.useState("");
  const [userAccountType, onUserAccountTypeChanged] = React.useState("");
  const win = Dimensions.get("window");
  const ratioNext = win.width / 38 / 8;
  React.useEffect(() => {
    if (userUrl) {
      if (userUrl != "group") {
        request.get(userUrl).then((response) => {
          onUserChanged(response.data);
        });
      }
    } else {
      AsyncStorage.getItem("user").then(function (url) {
        request.get(url).then((response) => {
          console.log(response.data.authority.id);
          onUserChanged(response.data);
          if (response.data.authority.id == 1) {
            onUserAccountTypeChanged(Translate.t("masterAccount"));
          } else if (response.data.authority.id == 2) {
            onUserAccountTypeChanged(Translate.t("specialAccount"));
          } else if (response.data.authority.id == 3) {
            onUserAccountTypeChanged(Translate.t("ambassadorAccount"));
          } else if (response.data.authority.id == 4) {
            onUserAccountTypeChanged(Translate.t("storeAccount"));
          } else if (response.data.authority.id == 5) {
            onUserAccountTypeChanged(Translate.t("generalAccount"));
          }
        });
      });
    }
  }, [isFocused, userUrl]);
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
          {user.nickname ? (
            <Text
              style={{
                fontSize: RFValue(12),
              }}
            >
              {name ? name : user.nickname}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: RFValue(12),
              }}
            >
              {name}
            </Text>
          )}
          <Text
            style={{
              fontSize: RFValue(12),
            }}
          >
            {userAccountType}
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
