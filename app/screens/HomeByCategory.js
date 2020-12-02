import React from "react";
import {
  StyleSheet,
  Text,
  Button,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  BackHandler,
  Animated,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import CustomFloatingButton from "../assets/CustomComponents/CustomFloatingButton";
import HomeProducts from "./HomeProducts";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { useIsFocused } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "../assets/Colors";
import Format from "../lib/format";
import firebase from "firebase/app";
import { firebaseConfig } from "../../firebaseConfig.js";
import { NavigationActions } from "react-navigation";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const format = new Format();
const db = firebase.firestore();
const request = new Request();
const alert = new CustomAlert();
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const win = Dimensions.get("window");

let kinujoProducts;
let featuredProducts;
let categoryDetails;

export default function HomeByCategory(props) {
  const [favoriteText, showFavoriteText] = React.useState(false);
  const [user, onUserChanged] = React.useState({});
  const [featuredHtml, onFeaturedHtmlChanged] = React.useState([]);
  const [kinujoHtml, onKinujoHtmlChanged] = React.useState([]);
  const [showCategory, onCategoryShow] = React.useState(false);
  const [categoryHtml, onCategoryHtmlChanged] = React.useState([]);
  const [officialProductCount, onOfficialProductCount] = React.useState(0);
  const [featuredProductCount, onFeaturedProductCount] = React.useState(0);
  const isFocused = useIsFocused();
  const right = React.useRef(new Animated.Value(widthPercentageToDP("-80%")))
    .current;
  const categoryID = props.route.params.categoryID;
  const categoryName = props.route.params.categoryName;
  React.useEffect(() => {
    hideCategoryAnimation();
  }, [!isFocused]);
  function processFeaturedProductHtml(featuredProducts) {
    let tmpFeaturedHtml = [];
    let featuredProductCount = 0;
    featuredProducts.map((product) => {
      let images = product.productImages.filter((image) => {
        return image.is_hidden == 0 && image.image.is_hidden == 0;
      });
      ++featuredProductCount;
      tmpFeaturedHtml.push(
        <HomeProducts
          key={product.id}
          product_id={product.category}
          onPress={() => {
            props.navigation.navigate("HomeStoreList", {
              url: product.url,
            });
          }}
          idx={product.id}
          image={
            images.length > 0
              ? images[0].image.image
              : "https://lovemychinchilla.com/wp-content/themes/shakey/assets/images/default-shakey-large-thumbnail.jpg"
          }
          office={product.brand_name}
          name={product.name}
          seller={product.user.shop_name}
          price={
            (user.is_seller
              ? format.separator(product.store_price)
              : format.separator(product.price)) + " 円"
          }
          category={product.category.name}
          shipping={
            product.shipping_fee == 0
              ? Translate.t("freeShipping")
              : "Shipping: " + format.separator(product.shipping_fee) + "円"
          }
          addFavourite={(favorite) => {
            showFavoriteText(favorite);
          }}
        />
      );
    });
    onFeaturedProductCount(featuredProductCount);
    return tmpFeaturedHtml;
  }

  function processKinujoProductHtml(kinujoProducts) {
    let tmpKinujoHtml = [];
    let officialProductCount = 0;
    kinujoProducts.map((product) => {
      let images = product.productImages.filter((image) => {
        return image.is_hidden == 0 && image.image.is_hidden == 0;
      });
      ++officialProductCount;
      tmpKinujoHtml.push(
        <HomeProducts
          key={product.id}
          product_id={product.id}
          onPress={() => {
            props.navigation.navigate("HomeStoreList", {
              url: product.url,
            });
          }}
          idx={product.id}
          image={
            images.length > 0
              ? images[0].image.image
              : "https://lovemychinchilla.com/wp-content/themes/shakey/assets/images/default-shakey-large-thumbnail.jpg"
          }
          office={product.brand_name}
          name={product.name}
          seller={product.user.shop_name}
          price={
            (user.is_seller
              ? format.separator(product.store_price)
              : format.separator(product.price)) + " 円"
          }
          category={product.category.name}
          shipping={
            product.shipping_fee == 0
              ? Translate.t("freeShipping")
              : "Shipping: " + format.separator(product.shipping_fee) + "円"
          }
          addFavourite={(favorite) => {
            showFavoriteText(favorite);
          }}
        />
      );
    });
    onOfficialProductCount(officialProductCount);
    return tmpKinujoHtml;
  }
  function filterProductsByCateogry(type) {
    let tmpKinujoProducts = kinujoProducts;
    let tmpFeaturedProducts = featuredProducts;
    if (type == "latestFirst") {
      tmpFeaturedProducts = tmpFeaturedProducts.sort((a, b) => {
        let date1 = new Date(a.created);
        let date2 = new Date(b.created);

        if (date1 < date2) {
          return -1;
        }
        if (date1 > date2) {
          return 1;
        }
        return 0;
      });
      tmpKinujoProducts = tmpKinujoProducts.sort((a, b) => {
        let date1 = new Date(a.created);
        let date2 = new Date(b.created);
        if (date1 < date2) {
          return -1;
        }
        if (date1 > date2) {
          return 1;
        }
        return 0;
      });
      onFeaturedHtmlChanged(processFeaturedProductHtml(tmpFeaturedProducts));
      onKinujoHtmlChanged(processKinujoProductHtml(tmpKinujoProducts));
    }
    if (type == "LowToHigh") {
      tmpFeaturedProducts = tmpFeaturedProducts.sort((a, b) => {
        if (user.is_seller) {
          return a.store_price - b.store_price;
        } else {
          return a.price - b.price;
        }
      });
      tmpKinujoProducts = tmpKinujoProducts.sort((a, b) => {
        if (user.is_seller) {
          return a.store_price - b.store_price;
        } else {
          return a.price - b.price;
        }
      });
      onFeaturedHtmlChanged(processFeaturedProductHtml(tmpFeaturedProducts));
      onKinujoHtmlChanged(processKinujoProductHtml(tmpKinujoProducts));
    }
    if (type == "HighToLow") {
      tmpFeaturedProducts = tmpFeaturedProducts.sort((a, b) => {
        if (user.is_seller) {
          return b.store_price - a.store_price;
        } else {
          return b.price - a.price;
        }
      });
      tmpKinujoProducts = tmpKinujoProducts.sort((a, b) => {
        if (user.is_seller) {
          return b.store_price - a.store_price;
        } else {
          return b.price - a.price;
        }
      });
      onFeaturedHtmlChanged(processFeaturedProductHtml(tmpFeaturedProducts));
      onKinujoHtmlChanged(processKinujoProductHtml(tmpKinujoProducts));
    }
    hideCategoryAnimation();
  }

  React.useEffect(() => {
    onFeaturedHtmlChanged([]);
    onKinujoHtmlChanged([]);
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
    request.get("product_categories/").then(function (response) {
      categoryDetails = response.data;
      //   onCategoryHtmlChanged(processCategoryHtml(response.data));
    });
    request
      .get("products/")
      .then(function (response) {
        let products = response.data;
        products = products.sort((p1, p2) => {
          if (p1.created > p2.created) {
            return -1;
          }
          return 1;
        });

        products = products.filter((product) => {
          let date = new Date(product.is_opened);
          return (
            product.is_opened == 1 &&
            new Date() > date &&
            product.is_hidden == 0 &&
            product.is_draft == 0
          );
        });

        kinujoProducts = products.filter((product) => {
          if (product.category.id == categoryID) {
            return product.user.authority.id == 1;
          }
        });
        featuredProducts = products.filter((product) => {
          if (product.category.id == categoryID) {
            return product.user.authority.id != 1;
          }
        });
        onKinujoHtmlChanged(processKinujoProductHtml(kinujoProducts));
        onFeaturedHtmlChanged(processFeaturedProductHtml(featuredProducts));
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
  }, [isFocused]);
  function showCategoryAnimation() {
    onCategoryShow(true);
    Animated.timing(right, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }
  function hideCategoryAnimation() {
    onCategoryShow(false),
      Animated.timing(right, {
        toValue: widthPercentageToDP("-80%"),
        duration: 500,
        useNativeDriver: false,
      }).start();
  }
  return (
    <TouchableWithoutFeedback onPress={() => hideCategoryAnimation()}>
      <SafeAreaView>
        <CustomHeader
          text="Product List"
          onFavoritePress={() => props.navigation.navigate("Favorite")}
          onPress={() => {
            props.navigation.navigate("Cart");
          }}
          onBack={() => props.navigation.pop()}
        />

        <CustomSecondaryHeader
          name={user.nickname}
          accountType={
            user.is_seller && user.is_master ? Translate.t("storeAccount") : ""
          }
        />
        <View style={styles.discription_header}>
          <View>
            <Text style={styles.disc_title_text}>
              {Translate.t("category") + ":" + categoryName}
            </Text>
          </View>
          <TouchableWithoutFeedback onPress={() => showCategoryAnimation()}>
            <View
              style={{
                position: "absolute",
                right: 0,
                marginRight: widthPercentageToDP("3%"),
                // marginTop: heightPercentageToDP("3%"),
                borderRadius: 5,
                paddingVertical: heightPercentageToDP("1%"),
                paddingHorizontal: heightPercentageToDP("1%"),
                backgroundColor: Colors.E6DADE,
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(12),
                  color: "white",
                  textAlign: "center",
                }}
              >
                {Translate.t("sorting")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {favoriteText == "true" ? (
          <View
            style={{
              borderRadius: win.width / 2,
              borderWidth: 1,
              backgroundColor: Colors.E6DADE,
              borderColor: "transparent",
              zIndex: 1,
              elevation: 1,
              position: "absolute",
              right: widthPercentageToDP("13%"),
              borderStyle: "solid",
              paddingVertical: widthPercentageToDP("1%"),
              paddingHorizontal: widthPercentageToDP("7%"),
              marginTop: heightPercentageToDP("6.2%"),
            }}
          >
            <View
              style={{
                width: 0,
                height: 0,
                borderBottomWidth: RFValue(20),
                borderRightWidth: RFValue(12),
                borderLeftWidth: RFValue(12),
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: Colors.E6DADE,
                top: RFValue(-15),
                position: "absolute",
                right: RFValue(9),
              }}
            ></View>
            <Text
              style={{
                fontSize: RFValue(10),
                color: "black",
                alignSelf: "flex-start",
              }}
            >
              {Translate.t("addedToFavorite")}
            </Text>
          </View>
        ) : (
          <View></View>
        )}
        {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
        <Animated.View
          style={{
            zIndex: 1,
            height: heightPercentageToDP("100%"),
            alignSelf: "center",
            width: widthPercentageToDP("80%"),
            position: "absolute",
            right: right,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderBottomWidth: 1,
              borderBottomColor: Colors.D7CCA6,
            }}
          >
            <Text style={styles.categoryTitle}>{Translate.t("sorting")}</Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => filterProductsByCateogry("latestFirst")}
          >
            <View style={styles.categoryContainer}>
              <Text>Latest First</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => filterProductsByCateogry("LowToHigh")}
          >
            <View style={styles.categoryContainer}>
              <Text>Price Low to High</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => filterProductsByCateogry("HighToLow")}
          >
            <View style={styles.categoryContainer}>
              <Text>Price High to Low</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => hideCategoryAnimation()}>
            <View
              style={{
                position: "absolute",
                bottom: heightPercentageToDP("8%"),
                right: widthPercentageToDP("3%"),
                borderWidth: 1,
                borderRadius: 5,
                backgroundColor: "white",
                alignItems: "center",
                paddingVertical: heightPercentageToDP(".7%"),
                paddingHorizontal: widthPercentageToDP("2%"),
              }}
            >
              <Text style={{ fontSize: RFValue(12) }}>{"Finish"}</Text>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
        {/* ///////////////////////////////////////////////////////////////////////////////////////////////// */}
        <ScrollView style={styles.home_product_view}>
          {kinujoHtml.length > 0 ? (
            <View style={styles.section_header}>
              <Text style={styles.section_header_text}>
                {"Number of sellers:" +
                  (officialProductCount + featuredProductCount)}
              </Text>
            </View>
          ) : (
            <View></View>
          )}
          {kinujoHtml.length > 0 ? (
            <View style={styles.section_product}>{kinujoHtml}</View>
          ) : (
            <View></View>
          )}

          {featuredHtml.length > 0 ? (
            <View style={styles.section_header}>
              <Text style={styles.section_header_text}>
                {Translate.t("featuredProduct")}
              </Text>
            </View>
          ) : (
            <View></View>
          )}
          {featuredHtml.length > 0 ? (
            <View style={styles.section_product}>{featuredHtml}</View>
          ) : (
            <View></View>
          )}
        </ScrollView>
        {showCategory == true ? (
          <View></View>
        ) : (
          <CustomFloatingButton
            onPress={() => {
              props.navigation.navigate("SearchProducts");
            }}
          />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  discription_header: {
    minHeight: heightPercentageToDP("9%"),
    // paddingBottom: heightPercentageToDP("15%"),
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    // flexWrap: "wrap",
    backgroundColor: "transparent",
    // backgroundColor: "orange",
    // marginTop: heightPercentageToDP("1%"),
  },
  disc_title_text: {
    paddingLeft: 15,
    fontSize: RFValue(14),
  },
  disc_button_group: {
    width: 100,
    flexDirection: "row-reverse",
  },
  home_product_view: {
    // paddingBottom: heightPercentageToDP("15%"),
    height: heightPercentageToDP("82%"),
    padding: 15,
    paddingTop: heightPercentageToDP("1%"),
    backgroundColor: "transparent",
    overflow: "scroll",
    // backgroundColor: "orange",
  },
  section_header: {
    width: "100%",
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  section_header_text: {
    borderBottomColor: "black",
    fontSize: RFValue(14),
    paddingBottom: 5,
  },
  section_product: {
    marginBottom: heightPercentageToDP("15%"),
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  categoryContainer: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    paddingVertical: heightPercentageToDP("1.5%"),
  },
  categoryTitle: {
    alignSelf: "center",
    fontSize: RFValue(14),
    paddingTop: heightPercentageToDP("2%"),
    paddingBottom: heightPercentageToDP("2%"),
  },
});
