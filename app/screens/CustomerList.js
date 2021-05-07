import React from "react";
import { InteractionManager } from 'react-native';

import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import { Colors } from "../assets/Colors.js";
import { useIsFocused } from "@react-navigation/native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import Person from "../assets/icons/default_avatar.svg";
import Search from "../assets/icons/search.svg";
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioSearchIcon = win.width / 19 / 19;
const ratioNext = win.width / 38 / 8;
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig.js";
import navigationHelper from "../lib/navigationHelper.js";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default function CustomerList(props) {
  const [customers, onCustomersChanged] = useStateIfMounted({});
  const [loaded, onLoaded] = useStateIfMounted(false);
  const [search, onSearchChanged] = useStateIfMounted("");
  const [customerHtml, onCustomerHtmlChanged] = useStateIfMounted(<View></View>);
  const [user, onUserChanged] = useStateIfMounted({});
  const [displayName, onDisplayNameChanged] = useStateIfMounted({});
  const isFocused = useIsFocused();

  function processCustomerHtml(props, customers, search = "") {
    let tmpCustomerHtml = [];
    let tmpCustomers = customers;
    if (search) {
      tmpCustomers = customers.filter((customer) => {
        return JSON.stringify(customer).indexOf(search) >= 0;
      });
    }
    for (var i = 0; i < tmpCustomers.length; i++) {
      let customer = tmpCustomers[i];
      tmpCustomerHtml.push(
        <TouchableWithoutFeedback
          key={i}
          onPress={() => {
            navigationHelper.navigate("CustomerInformation", {
              url: customer.url,
              notViewHeader: false
            });
          }}
        >
          <View style={styles.customerListTableftContainer}>
            {customer && customer.image != null ? (
              <Image
                style={{
                  width: RFValue(40),
                  height: RFValue(40),
                  borderRadius: win.width / 2,
                  backgroundColor: Colors.DCDCDC,
                }}
                source={{ uri: customer.image.image }}
              />
            ) : (
              <Person
                style={{
                  width: RFValue(40),
                  height: RFValue(40),
                  borderRadius: win.width / 2,
                }}
              />
            )}

            <Text style={styles.customerListName}>
              {displayName[String(customer.id)] ? displayName[String(customer.id)] : customer.nickname ? customer.nickname : customer.real_name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                right: 0,
              }}
            >
              <Text
                style={{
                  marginRight: widthPercentageToDP("8%"),
                  fontSize: RFValue(13),
                  alignSelf: "center",
                }}
              >
                {customer.created.split("T")[0]}
              </Text>
              <Image
                style={styles.nextIcon}
                source={require("../assets/Images/next.png")}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return tmpCustomerHtml;
  }
  // if (!user.url) {
  AsyncStorage.getItem("user").then(function (url) {
    request
      .get(url)
      .then(function (response) {
        onUserChanged(response.data);
      })
      .catch(function (error) {
        if (
          error &&
          error.response &&
          error.response.data &&
          Object.keys(error.response.data).length > 0
        ) {
          alert.warning(
            error.response.data[Object.keys(error.response.data)[0]][0] +
            "(" +
            Object.keys(error.response.data)[0] +
            ")"
          );
        }
      });
  });
  // }

  // if (!loaded) {
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem("user").then(function (url) {
        let urls = url.split("/");
        urls = urls.filter((url) => {
          return url;
        });
        let userId = urls[urls.length - 1];
        request
          .get("customers/" + userId + "/")
          .then(function (response) {
            let displayName = {};

            for (var i = 0; i < response.data.customers.length; i++) {
              let customer = response.data.customers[i];
              db
                .collection("users")
                .doc(String(userId))
                .collection("customers")
                .doc(String(customer.id))
                .onSnapshot((documentSnapshot) => {
                  if (documentSnapshot.data()) {
                    displayName[String(customer.id)] = documentSnapshot.data().displayName;
                  } else {
                    displayName[String(customer.id)] = "";
                  }
                  onDisplayNameChanged(displayName);
                })
            }
            onCustomersChanged(response.data.customers);
            onCustomerHtmlChanged(
              processCustomerHtml(props, response.data.customers, "")
            );
            onLoaded(true);
          })
          .catch(function (error) {
            if (
              error &&
              error.response &&
              error.response.data &&
              Object.keys(error.response.data).length > 0
            ) {
              alert.warning(
                error.response.data[Object.keys(error.response.data)[0]][0] +
                "(" +
                Object.keys(error.response.data)[0] +
                ")"
              );
            }
            onLoaded(true);
          });
      });
    });
  }, [isFocused]);
  // }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        onBack={() => {
          props.navigation.goBack();
        }}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        text={Translate.t("customerList")}
      />
      <CustomSecondaryHeader outUser={user} props={props}
        name={user.nickname}
        accountType={Translate.t("storeAccount")}
      />

      <Text style={styles.totalNumberOfCustomer}>
        {Translate.t("customerTotal")} : {customers.length}{" "}
        {Translate.t("person")}
      </Text>

      <View style={styles.searchInputContainer}>
        <TextInput
          placeholder=""
          placeholderTextColor={Colors.grey}
          style={{
            height: heightPercentageToDP("5.8%"),
            flex: 1,
            paddingLeft: widthPercentageToDP("5%"),
            fontSize: RFValue(9),
          }}
          value={search}
          onChangeText={(value) => {
            onSearchChanged(value);
            onCustomerHtmlChanged(processCustomerHtml(props, customers, value));
          }}
        ></TextInput>

        <Search style={styles.searchIcon} />
      </View>
      <View>
        <ScrollView>
          <View style={{ marginBottom: heightPercentageToDP("50%") }}>
            {customerHtml}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  totalNumberOfCustomer: {
    alignSelf: "center",
    fontSize: RFValue(14),
    marginTop: heightPercentageToDP("3%"),
  },
  searchInputContainer: {
    marginHorizontal: widthPercentageToDP("6%"),
    marginTop: heightPercentageToDP("3%"),
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: Colors.F6F6F6,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: win.width / 2,
    height: heightPercentageToDP("5.8%"),
  },
  searchIcon: {
    width: win.width / 19,
    height: 19 * ratioSearchIcon,
    position: "absolute",
    right: 0,
    marginRight: widthPercentageToDP("5%"),
  },
  nextIcon: {
    alignSelf: "center",
    width: win.width / 38,
    height: 15 * ratioNext,
    position: "absolute",
    right: 0,
  },
  customerListTableftContainer: {
    marginTop: heightPercentageToDP("5%"),
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: widthPercentageToDP("5%"),
  },
  customerListTableRightContainer: {
    flexDirection: "row-reverse",
    position: "absolute",
    right: 0,
  },
  customerListProfileImage: {
    width: RFValue(40),
    height: RFValue(40),
    alignSelf: "center",
    borderRadius: win.width / 2,
    backgroundColor: "white",
  },
  customerListName: {
    fontSize: RFValue(13),
    marginLeft: widthPercentageToDP("5%"),
  },
});
