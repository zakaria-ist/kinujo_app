import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TextInput,
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
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";

const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioSearchIcon = win.width / 19 / 19;
const ratioNext = win.width / 38 / 8;

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
          props.navigation.navigate("CustomerInformation", {
            url: customer.url,
          });
        }}
      >
        <View style={styles.customerListTableftContainer}>
          <Image
            style={styles.customerListProfileImage}
            source={require("../assets/Images/profileEditingIcon.png")}
          />
          <Text style={styles.customerListName}>
            {customer.real_name ? customer.real_name : customer.nickname}
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

export default function CustomerList(props) {
  const [customers, onCustomersChanged] = React.useState({});
  const [loaded, onLoaded] = React.useState(false);
  const [search, onSearchChanged] = React.useState("");
  const [customerHtml, onCustomerHtmlChanged] = React.useState(<View></View>);
  const [user, onUserChanged] = React.useState({});

  if (!user.url) {
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
  }

  if (!loaded) {
    AsyncStorage.getItem("user").then(function (url) {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      let userId = urls[urls.length - 1];
      request
        .get("customers/" + userId + "/")
        .then(function (response) {
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
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        onBack={() => {
          props.navigation.pop();
        }}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        text={Translate.t("customerList")}
      />
      <CustomSecondaryHeader
        name={user.nickname}
        accountType={Translate.t("storeAccount")}
      />

      <Text style={styles.totalNumberOfCustomer}>
        {Translate.t("customerTotal")} : {customers.length}{" "}
        {Translate.t("person")}
      </Text>

      <View style={styles.searchInputContainer}>
        <TextInput
          placeholder="髪長"
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
        <Image
          style={styles.searchIcon}
          source={require("../assets/Images/searchIcon.png")}
        />
      </View>
      <View>
        <ScrollView>{customerHtml}</ScrollView>
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
  },
  customerListName: {
    fontSize: RFValue(13),
    marginLeft: widthPercentageToDP("5%"),
  },
});
