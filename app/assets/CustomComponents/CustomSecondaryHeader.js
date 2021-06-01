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
import GroupImages from "./GroupImages";

const request = new Request();

export default function CustomSecondaryHeader({
  onPress,
  name,
  accountType,
  editProfile,
  userUrl,
  images,
  props,
  outUser
}) {
  const isFocused = useIsFocused();
  const [user, onUserChanged] = useStateIfMounted({});
  const [localImages, setImages] = useStateIfMounted([]);
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
    if (images) {
      setImages(images);
    } else {
      setImages([]);
    }

    if (!isFocused) {
      setImages([]);
    }
  }, [isFocused, userUrl, images]);
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
        {localImages.length > 0 ? (
          <GroupImages
            style={{
              marginLeft: widthPercentageToDP("5%"),
              alignItems: "center",
              justifyContent: "center",
              width: RFValue(50),
              height: RFValue(50),
              flexWrap: "wrap",
              flexDirection: "row",
              paddingVertical: heightPercentageToDP("0.2%"),
              borderRadius: localImages.length > 0 ? 5 : 0,
              backgroundColor:
                localImages && localImages.length > 1
                  ? "#B3B3B3"
                  : "transparent",
            }}
            width={RFValue(50)}
            height={RFValue(50)}
            images={localImages}
          ></GroupImages>
        ) : user && user.image ? (
          <TouchableWithoutFeedback onPress={()=>{
            if((user.is_store && user.is_approved) || user.is_master){
              props.navigation.navigate("ProfileEditingStore"); 
            } else {
              props.navigation.navigate("ProfileEditingGeneral"); 
            }
          }}>
            <Image
              style={{
                borderRadius: win.width / 2,
                marginLeft: widthPercentageToDP("5%"),
              }}
              source={{ uri: user.image.image }}
              width={RFValue(40)}
              height={RFValue(40)}
            />
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback onPress={()=>{
            if((user.is_store && user.is_approved) || user.is_master){
              props.navigation.navigate("ProfileEditingStore"); 
            } else {
              props.navigation.navigate("ProfileEditingGeneral"); 
            }
          }}>
              <PersonIcon
              style={{
                borderRadius: win.width / 2,
                marginLeft: widthPercentageToDP("8%"),
              }}
              width={RFValue(40)}
              height={RFValue(40)}
            />
          </TouchableWithoutFeedback>
        )}

        {/* {user && user.image ? (
          <Image
            style={{
              borderRadius: win.width / 2,
            }}
            source={{ uri: user.image.image }}
            width={}
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
        )} */}

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
            {user && user.authority && user.authority.id == 1 ? Translate.t("masterAccount") 
            : user && user.authority && user.authority.id == 2 ? Translate.t("specialAccount")
            : user && user.authority && user.authority.id == 3 ? Translate.t("ambassadorAccount")
            : user && user.authority && user.authority.id == 4 ? Translate.t("storeAccount")
            : user && user.authority && user.authority.id == 5 ? Translate.t("generalAccount")
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
