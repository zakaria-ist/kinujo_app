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
import { useStateIfMounted } from "use-state-if-mounted";
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

export default function CustomSelectHeader({
  onPress,
  name,
  accountType,
  editProfile,
  userUrl,
  onSend,
  onCancel
}) {
  const isFocused = useIsFocused();
  const [user, onUserChanged] = useStateIfMounted({});
  // const [userAuthorityId, onUserAuthorityIdChanged] = useStateIfMounted("");
  const [userAccountType, onUserAccountTypeChanged] = useStateIfMounted("");
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
          justifyContent: "flex-end",
          backgroundColor: Colors.F0EEE9,
          marginRight: widthPercentageToDP("5%"),
          height: heightPercentageToDP("10%")
        }}
      >
        <TouchableWithoutFeedback onPress={onSend}>
            <View style={{marginRight: widthPercentageToDP("2%")}}><Text>{Translate.t('send')}</Text></View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={onCancel}>
            <View><Text>{Translate.t('cancel')}</Text></View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({});
