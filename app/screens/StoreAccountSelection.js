import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import SplashScreen from 'react-native-splash-screen'
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioKinujo = win.width / 1.6 / 151;
import Translate from "../assets/Translates/Translate";
export default function StoreAccountSelection(props) {
  setTimeout(function(){
    SplashScreen.hide();
  }, 1000)
  async function updateProfile() {
    AsyncStorage.getItem("user").then(function(url) {
      request
        .get(url)
        .then(function(response) {
          response = response.data;
          let payload = response.payload;
          if (payload) {
            payload = JSON.parse(payload);
            payload["account_selected"] = true;
            payload = JSON.stringify(payload);
          } else {
            payload = JSON.stringify({
              account_selected: true,
            });
          }
          response.payload = payload;
          request
            .patch(url, {
              payload: payload,
            })
            .then(function (response) {
              props.navigation.navigate("BankAccountRegistrationOption", {
                "authority" : props.route.params.authority
              });
            })
            .catch(function(error) {
              if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
                alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
              }
            });
        })
        .catch(function(error) {
          if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
            alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
          }
        });
    });
  }
  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <Image
            style={{
              width: win.width / 1.6,
              height: 44 * ratioKinujo,
              alignSelf: "center",
              marginTop: heightPercentageToDP("6%"),
            }}
            source={require("../assets/Images/kinujo.png")}
          />
          <Text style={styles.storeAccountSelectionText}>
            {Translate.t("storeAccountSelection")}
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: RFValue(12),
              marginHorizontal: widthPercentageToDP("3%"),
              alignSelf: "center",
              marginTop: heightPercentageToDP("5%"),
              textAlign: "center",
            }}
          >
            {Translate.t("selectYourDesiredStoreAccount")}
          </Text>
          <TouchableOpacity
            onPress={() => {
              updateProfile();
            }}
          >
            <View style={styles.registerSalonShopButton}>
              <Text style={styles.registerSalonShopButtonText}>
                {Translate.t("registerAsSalonShop")}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              updateProfile();
            }}
          >
            <View style={styles.registerHairDresserButton}>
              <Text style={styles.registerHairDresserButtonText}>
                {Translate.t("registerAsHairDresser")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  storeAccountSelectionText: {
    color: "white",
    fontSize: RFValue(16),
    alignSelf: "center",
    textAlign: "center",
    marginTop: heightPercentageToDP("15%"),
  },
  registerSalonShopButton: {
    borderRadius: 5,
    paddingVertical: heightPercentageToDP("1.5%"),
    marginTop: heightPercentageToDP("18%"),
    marginHorizontal: widthPercentageToDP("15%"),
    backgroundColor: Colors.deepGrey,
  },
  registerSalonShopButtonText: {
    color: "white",
    fontSize: RFValue(12),
    textAlign: "center",
  },
  registerHairDresserButton: {
    borderRadius: 5,
    paddingVertical: heightPercentageToDP("1.5%"),
    marginTop: heightPercentageToDP("5%"),
    marginHorizontal: widthPercentageToDP("15%"),
    backgroundColor: Colors.deepGrey,
  },
  registerHairDresserButtonText: {
    color: "white",
    fontSize: RFValue(12),
    textAlign: "center",
  },
});
