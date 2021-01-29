import React from "react";
import { InteractionManager } from 'react-native';

import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

function processProductHtml(props, products, status) {
  let tmpProductHtml = [];
  let tmpProducts = products.filter((product) => {
    if (product.is_hidden == 1) {
      return false;
    }
    if (status == "published" && product.is_draft == 0) {
      return true;
    }
    if (status == "unpublished" && product.is_draft == 1) {
      return true;
    }
    return false;
  });
  tmpProducts = tmpProducts.sort((p1, p2) => {
    if (p1.created > p2.created) {
      return -1;
    }
    return 1;
  });

  for (var i = 0; i < tmpProducts.length; i++) {
    let product = tmpProducts[i];

    tmpProductHtml.push(
      <View key={i} style={styles.productTabContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.navigate("ProductInformationAddNew", {
              type: "existingProduct",
              url: product.url,
            });
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
            }}
          >
            <View
              style={{
                // backgroundColor: "blue",
                flexDirection: "row",
                alignItems: "center",
                width: widthPercentageToDP("33%"),
                left: 0,
              }}
            >
              {product.productImages.length > 0 &&
              product.productImages[0].image.image &&
              !product.productImages[0].is_hidden ? (
                <Image
                  style={{
                    width: RFValue(30),
                    height: RFValue(30),
                  }}
                  source={{ uri: product.productImages[0].image.image }}
                />
              ) : (
                <Image
                  style={{
                    width: RFValue(30),
                    height: RFValue(30),
                  }}
                  source={require("../assets/Images/productListingIcon.png")}
                />
              )}
              <Text style={styles.productNameText}>{product.name}</Text>
            </View>
            <View
              style={{
                // backgroundColor: "orange",
                flexDirection: "row",
                alignItems: "center",
                width: widthPercentageToDP("48%"),
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.productTabContainerRightText}>
                {product.created.split("T")[0]}
              </Text>
              <View>
                <Text style={styles.productTabContainerRightText}>
                  {format.separator(product.price)}円
                </Text>
                <Text style={styles.productTabContainerRightText}>
                  {format.separator(product.store_price)}円
                </Text>
              </View>
              <Text style={styles.productTabContainerText}>
                {product.store}
              </Text>
            </View>
            <Image
              style={styles.nextIcon}
              source={require("../assets/Images/next.png")}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
  return tmpProductHtml;
}

export default function ExhibitedProductList(props) {
  const [products, onProductsChanged] = useStateIfMounted({});
  const [status, onStatusChanged] = useStateIfMounted("published");
  const [loaded, onLoaded] = useStateIfMounted(false);
  const [productHtml, onProductHtmlChanged] = useStateIfMounted(<View></View>);
  const [user, onUserChanged] = useStateIfMounted({});
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem("user").then(function (url) {
        let urls = url.split("/");
        urls = urls.filter((url) => {
          return url;
        });
        let userId = urls[urls.length - 1];
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
        request
          .get("sellerProducts/" + userId + "/")
          .then(function (response) {
            onProductsChanged(response.data.products);
            onProductHtmlChanged(
              processProductHtml(props, response.data.products, status)
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
  return (
    <SafeAreaView>
      <CustomHeader
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onBack={() => {
          props.navigation.goBack();
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
      <ScrollView
        style={
          {
            // height: heightPercentageToDP("85%") - insets.bottom,
          }
        }
      >
        <View
          style={{
            marginTop: heightPercentageToDP("3%"),
            marginHorizontal: widthPercentageToDP("3%"),
            paddingBottom: widthPercentageToDP("5%"),
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text
              onPress={() => {
                onStatusChanged("published");
                onProductHtmlChanged(
                  processProductHtml(props, products, "published")
                );
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
                onProductHtmlChanged(
                  processProductHtml(props, products, "unpublished")
                );
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
            props.navigation.navigate("ProductInformationAddNew", {
              type: "newProduct",
              is_store: props.route.params.is_store,
            });
          }}
        >
          <View
            style={{
              marginBottom: heightPercentageToDP("30%"),
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
      </ScrollView>
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
  productTabContainerRightText: {
    fontSize: RFValue(9),
    textAlign: "right",
  },
  productNameText: {
    // backgroundColor: "orange",
    fontSize: RFValue(9),
    width: widthPercentageToDP("20%"),
    marginLeft: widthPercentageToDP("2%"),
  },
});
