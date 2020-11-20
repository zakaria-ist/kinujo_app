import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";
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
import Format from "../lib/format";
const format = new Format();

const request = new Request();
const alert = new CustomAlert();

const win = Dimensions.get("window");
const ratioNext = win.width / 40 / 8;

function processProductHtml(products, status) {
  let tmpProductHtml = [];
  let tmpProducts = products.filter((product) => {
    if (status == "published" && !product.is_draft) {
      return true;
    }
    if (status == "unpublished" && product.is_draft) {
      return true;
    }
    return false;
  });
  for (var i = 0; i < tmpProducts.length; i++) {
    let product = tmpProducts[i];
    tmpProductHtml.push(
      <View key={i} style={styles.productTabContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            left: 0,
          }}
        >
          <Image
            style={{
              width: RFValue(30),
              height: RFValue(30),
            }}
            source={require("../assets/Images/productListingIcon.png")}
          />
          <Text style={styles.productNameText}>{product.name}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            right: 0,
            alignItems: "center",
            width: widthPercentageToDP("50%"),
            justifyContent: "space-evenly",
          }}
        >
          <Text style={styles.productTabContainerText}>
            {product.created.split("T")[0]}
          </Text>
          <View>
            <Text style={styles.productTabContainerText}>
              {format.separator(product.price)}円
            </Text>
            <Text style={styles.productTabContainerText}>
              {format.separator(product.store_price)}円
            </Text>
          </View>
          <Text style={styles.productTabContainerText}>{product.store}</Text>
        </View>
        <Image
          style={styles.nextIcon}
          source={require("../assets/Images/next.png")}
        />
      </View>
    );
  }
  return tmpProductHtml;
}

export default function ExhibitedProductList(props) {
  const [products, onProductsChanged] = React.useState({});
  const [status, onStatusChanged] = React.useState("published");
  const [loaded, onLoaded] = React.useState(false);
  const [productHtml, onProductHtmlChanged] = React.useState(<View></View>);
  const [user, onUserChanged] = React.useState({});

  AsyncStorage.getItem("user").then(function(url) {
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    let userId = urls[urls.length - 1];
    if (!user.url) {
      request
        .get(url)
        .then(function(response) {
          onUserChanged(response.data);
        })
        .catch(function(error) {
          if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
            alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
          }
        });
    }
    if (!loaded) {
      request
        .get("sellerProducts/" + userId + "/")
        .then(function(response) {
          onProductsChanged(response.data.products);
          onProductHtmlChanged(
            processProductHtml(response.data.products, status)
          );
          onLoaded(true);
        })
        .catch(function(error) {
          if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
            alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
          }
          onLoaded(true);
        });
    }
  });
  return (
    <SafeAreaView>
      <CustomHeader
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onBack={() => {
          props.navigation.pop();
        }}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        text={Translate.t("productManagement")}
      />
      <CustomSecondaryHeader
        name={user.nickname}
        accountType={
          props.route.params.is_store ? Translate.t("storeAccount") : ""
        }
      />
      <View
        style={{
          marginTop: heightPercentageToDP("3%"),
          marginHorizontal: widthPercentageToDP("3%"),
          paddingBottom: widthPercentageToDP("5%"),
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text
            onPress={() => {
              onStatusChanged("published");
              onProductHtmlChanged(processProductHtml(products, "published"));
            }}
            style={
              status == "published"
                ? styles.nonPublishedProductText
                : styles.publishedProductText
            }
          >
            {Translate.t("published")}
          </Text>
          <Text
            onPress={() => {
              onStatusChanged("unpublished");
              onProductHtmlChanged(processProductHtml(products, "unpublished"));
            }}
            style={
              status == "unpublished"
                ? styles.nonPublishedProductText
                : styles.publishedProductText
            }
          >
            {Translate.t("nonPublished")}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: Colors.F6F6F6,
            borderWidth: 2,
            paddingBottom: widthPercentageToDP("5%"),
            borderColor: Colors.D7CCA6,
          }}
        >
          <View style={styles.productInformationContainer}>
            <View style={styles.product}>
              <Text style={styles.productInformationText}>
                {Translate.t("product")}
              </Text>
            </View>
            <View style={styles.productDetailsContainer}>
              <Text style={styles.productInformationText}>
                {Translate.t("createdDate")}
              </Text>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.productInformationText}>
                  {Translate.t("sellingPrice")}
                </Text>
                <Text style={styles.productInformationText}>
                  {Translate.t("corporatePrice")}
                </Text>
              </View>
              <Text style={styles.productInformationText}>
                {Translate.t("inStock")}
              </Text>
            </View>
          </View>
          {productHtml}
        </View>
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          props.navigation.navigate("ProductInformationAdd", {
            is_store: props.route.params.is_store,
          });
        }}
      >
        <View
          style={{
            backgroundColor: Colors.D7CCA6,
            marginHorizontal: widthPercentageToDP("3%"),
            justifyContent: "center",
            alignItems: "center",
            marginTop: heightPercentageToDP("2%"),
            height: heightPercentageToDP("5%"),
          }}
        >
          <Text style={{ fontSize: RFValue(12), color: "white" }}>
            + {Translate.t("productCreate")}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  nextIcon: {
    width: win.width / 40,
    height: 15 * ratioNext,
    position: "absolute",
    right: 0,
  },
  publishedProductText: {
    borderWidth: 1,
    borderColor: Colors.F0EEE9,
    backgroundColor: Colors.F0EEE9,
    paddingHorizontal: widthPercentageToDP("8%"),
    paddingVertical: heightPercentageToDP("1%"),
    color: Colors.D7CCA6,
    fontSize: RFValue(12),
  },
  nonPublishedProductText: {
    borderWidth: 1,
    borderColor: Colors.D7CCA6,
    backgroundColor: Colors.D7CCA6,
    paddingHorizontal: widthPercentageToDP("8%"),
    paddingVertical: heightPercentageToDP("1%"),
    color: Colors.white,
    fontSize: RFValue(12),
  },
  productInformationText: {
    fontSize: RFValue(8),
  },
  productInformationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderBottomWidth: 3,
    borderBottomColor: Colors.D7CCA6,
    paddingBottom: heightPercentageToDP("5%"),
    marginHorizontal: widthPercentageToDP("3%"),
  },
  product: {
    flexDirection: "row",
    position: "absolute",
    left: 0,
    marginLeft: widthPercentageToDP("10%"),
    alignItems: "center",
  },
  productDetailsContainer: {
    flexDirection: "row",
    position: "absolute",
    right: 0,
    alignItems: "center",
    width: widthPercentageToDP("57%"),
    justifyContent: "space-evenly",
  },
  productTabContainer: {
    flexDirection: "row",
    marginTop: heightPercentageToDP("1%"),
    alignItems: "center",
    paddingTop: heightPercentageToDP("2%"),
    paddingBottom: heightPercentageToDP("3%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.CECECE,
    marginHorizontal: widthPercentageToDP("3%"),
  },
  productTabContainerText: {
    fontSize: RFValue(9),
  },
  productNameText: {
    fontSize: RFValue(9),
    width: widthPercentageToDP("25%"),
    marginLeft: widthPercentageToDP("2%"),
  },
});