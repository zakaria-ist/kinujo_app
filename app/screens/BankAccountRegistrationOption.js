import React from "react";
import { InteractionManager } from 'react-native';

import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import SplashScreen from 'react-native-splash-screen'
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWordWithArrow";
import Translate from "../assets/Translates/Translate";
import WhiteBackArrow from "../assets/CustomComponents/CustomWhiteBackArrow";
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratio = win.width / 25 / 17;
const ratioKinujo = win.width / 1.6 / 151;
export default function BankAccountRegistration(props) {
  const [user, setUser] = useStateIfMounted({});
  setTimeout(function(){
    SplashScreen.hide();
  }, 1000)

  async function updateProfile(nextPage) {
    AsyncStorage.getItem("user").then(function(url) {
      request
        .get(url)
        .then(function(response) {
          response = response.data;
          let payload = response.payload;
          if (payload) {
            payload = JSON.parse(payload);
            payload["bank_skipped"] = true;
            payload = JSON.stringify(payload);
          } else {
            payload = JSON.stringify({
              bank_skipped: true,
            });
          }
          response.payload = payload;
          request
            .patch(url, {
              payload: payload,
            })
            .then(function(response) {
              if(user.is_approved){
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: "HomeStore" }],
                });
              } else {
                props.navigation.navigate(nextPage);
              }
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

  React.useEffect(()=>{

    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem("user").then(function(url) {
        request.get(url).then((response)=>{
          console.log(response.data)
          setUser(response.data)
        })
      })
    });
  }, [])

  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <WhiteBackArrow onPress={() => props.navigation.goBack()} />
          <Image
            style={{
              width: win.width / 1.6,
              height: 44 * ratioKinujo,
              alignSelf: "center",
              marginTop: heightPercentageToDP("6%"),
            }}
            source={require("../assets/Images/kinujo.png")}
          />

          <Text style={styles.bankAccountRegistrationText}>
            {Translate.t("bankAccountRegistration")}
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: RFValue(12),
              alignSelf: "center",
              marginTop: heightPercentageToDP("5%"),
              textAlign: "center",
            }}
          >
            {Translate.t("bankAccountRegistrationIsRequiredText")}
          </Text>
        </View>

        <TouchableOpacity onPress={
          ()=>{
            props.navigation.navigate("BankAccountRegistration", {
              is_store: true,
              authority: props.route.params.authority,
              register: true
            })
          }
        }>
          <View style={styles.registerBankAccountButton}>
            <Text style={styles.registerBankAccountButtonText}>
              {Translate.t("registerBankAccountNow")}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          onPress={() => props.navigation.navigate("AccountExamination", {
            "authority" : props.route.params.authority
          })}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: heightPercentageToDP("3%"),
          }}
        >
            <TouchableWithoutFeedback
              onPress={() => updateProfile("AccountExamination")}
            >
              <View style={{flexDirection:"row"}}>
                <Text
                  style={{
                    alignSelf: "center",
                    color: Colors.white,
                    textAlign: "center",
                    fontSize: RFValue(12),
                  }}
                >
                  {Translate.t("registerLater")}
                </Text>
                <Image
                  onPress={() => updateProfile("AccountExamination")}
                  style={{
                    marginLeft: 5,
                    width: win.width / 25,
                    height: 17 * ratio,
                    alignSelf: "center",
                  }}
                  source={require("../assets/Images/whiteNextArrow.png")}
                />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  bankAccountRegistrationText: {
    color: "white",
    textAlign: "center",
    fontSize: RFValue(16),
    alignSelf: "center",
    marginTop: heightPercentageToDP("10%"),
  },
  registerBankAccountButton: {
    borderRadius: 5,
    backgroundColor: "#f01d71",
    paddingVertical: widthPercentageToDP("3%"),
    marginTop: heightPercentageToDP("14%"),
    marginHorizontal: widthPercentageToDP("14%"),
    backgroundColor: Colors.deepGrey,
  },
  registerBankAccountButtonText: {
    color: "white",
    fontSize: RFValue(12),
    textAlign: "center",
  },
});
