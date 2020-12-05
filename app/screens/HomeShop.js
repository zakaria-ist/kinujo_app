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
  Platform,
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
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
let featuredProducts;
export default function Home(props) {
  const [favoriteText, showFavoriteText] = React.useState(false);
  const [user, onUserChanged] = React.useState({});
  const [featuredHtml, onFeaturedHtmlChanged] = React.useState([]);
  const [showCategory, onCategoryShow] = React.useState(false);
  const [categoryHtml, onCategoryHtmlChanged] = React.useState([]);
  const [showSorting, onSortingShow] = React.useState(false);
  const isFocused = useIsFocused();
  const rightCategory = React.useRef(
    new Animated.Value(widthPercentageToDP("-80%"))
  ).current;
  const rightSorting = React.useRef(
    new Animated.Value(widthPercentageToDP("-80%"))
  ).current;
  const shopName = props.route.params.shopName;
  function filterProductsBySorting(type) {
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

      onFeaturedHtmlChanged(processFeaturedProductHtml(tmpFeaturedProducts));
    }
    if (type == "HighToLow") {
      tmpFeaturedProducts = tmpFeaturedProducts.sort((a, b) => {
        return a.store_price - b.store_price;
      });

      onFeaturedHtmlChanged(processFeaturedProductHtml(tmpFeaturedProducts));
    }
    if (type == "LowToHigh") {
      tmpFeaturedProducts = tmpFeaturedProducts.sort((a, b) => {
        return b.store_price - a.store_price;
      });

      onFeaturedHtmlChanged(processFeaturedProductHtml(tmpFeaturedProducts));
    }
    hideSortingAnimation();
  }

  function processFeaturedProductHtml(featuredProducts) {
    let tmpFeaturedHtml = [];
    let idx = 0;
    featuredProducts.map((product) => {
      // console.log(product.name);
      let images = product.productImages.filter((image) => {
        return image.is_hidden == 0 && image.image.is_hidden == 0;
      });

      tmpFeaturedHtml.push(
        <HomeProducts
          key={product.id}
          product_id={product.id}
          onPress={() => {
            props.navigation.navigate("HomeStoreList", {
              url: product.url,
            });
          }}
          idx={idx++}
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
          productAuthorityID={product.user.authority.id}
        />
      );
    });
    return tmpFeaturedHtml;
  }

  function filterProductsByCateogry(categories, categoryID) {
    let tmpFeaturedProducts = featuredProducts;
    tmpFeaturedProducts = featuredProducts.filter((featured) => {
      return featured.category.id == categoryID;
    });
    onFeaturedHtmlChanged(processFeaturedProductHtml(tmpFeaturedProducts));
    hideCategoryAnimation();
  }
  function processCategoryHtml(categories) {
    let tmpCategoryHtml = [];
    categories.map((category) => {
      tmpCategoryHtml.push(
        <TouchableWithoutFeedback
          onPress={() => filterProductsByCateogry(categories, category.id)}
        >
          <View style={styles.categoryContainer} key={category.id}>
            <Text>{category.name}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
      //   tmpCategoryHtml.push(
      //     <TouchableWithoutFeedback
      //       onPress={() => navigateToCategorisePage(category.id, category.name)}
      //     >
      //       <View style={styles.categoryContainer} key={category.id}>
      //         <Text>{category.name}</Text>
      //       </View>
      //     </TouchableWithoutFeedback>
      //   );
    });
    return tmpCategoryHtml;
  }
  React.useEffect(() => {
    hideCategoryAnimation();
    hideSortingAnimation();
  }, [!isFocused]);
  React.useEffect(() => {
    onFeaturedHtmlChanged([]);
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
      onCategoryHtmlChanged(processCategoryHtml(response.data));
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

        featuredProducts = products.filter((product) => {
          if (product.user.shop_name == shopName) {
            return product.user.authority.id != 1;
          }
        });
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
    Animated.timing(rightCategory, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }
  function hideCategoryAnimation() {
    onCategoryShow(false),
      Animated.timing(rightCategory, {
        toValue: widthPercentageToDP("-80%"),
        duration: 500,
        useNativeDriver: false,
      }).start();
  }

  function showSortingAnimation() {
    onCategoryShow(true);
    Animated.timing(rightSorting, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }
  function hideSortingAnimation() {
    onCategoryShow(false),
      Animated.timing(rightSorting, {
        toValue: widthPercentageToDP("-80%"),
        duration: 500,
        useNativeDriver: false,
      }).start();
  }
  //   function navigateToCategorisePage(categoryId, categoryName) {
  //     hideCategoryAnimation();
  //     props.navigation.navigate("HomeByCategory", {
  //       categoryID: categoryId,
  //       categoryName: categoryName,
  //     });
  //   }
  return (
    <TouchableWithoutFeedback
      onPress={(() => hideCategoryAnimation(), hideSortingAnimation())}
    >
      <SafeAreaView>
        <CustomHeader
          text="Product List"
          onFavoritePress={() => props.navigation.navigate("Favorite")}
          onPress={() => {
            props.navigation.navigate("Cart");
          }}
          onBack={() => {
            props.navigation.pop();
          }}
        />

        <CustomSecondaryHeader
          name={user.nickname}
          accountType={
            user.is_seller && user.is_master ? Translate.t("storeAccount") : ""
          }
        />
        <View style={styles.discription_header}>
          <View>
            <Text style={styles.disc_title_text}>{"Seller:" + shopName}</Text>
          </View>
          <View
            style={{
              position: "absolute",
              right: 0,
              justifyContent: "center",
              paddingTop: heightPercentageToDP("3%"),
            }}
          >
            <TouchableWithoutFeedback onPress={() => showCategoryAnimation()}>
              <View
                style={{
                  // position: "absolute",
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
                  {Translate.t("category")}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => showSortingAnimation()}>
              <View
                style={{
                  // position: "absolute",
                  right: 0,
                  marginRight: widthPercentageToDP("3%"),
                  // marginTop: heightPercentageToDP("3%"),
                  borderRadius: 5,
                  paddingVertical: heightPercentageToDP("1%"),
                  paddingHorizontal: heightPercentageToDP("1%"),
                  marginTop: heightPercentageToDP("2%"),
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
            paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0,
            zIndex: 1,
            height: heightPercentageToDP("100%"),
            alignSelf: "center",
            width: widthPercentageToDP("80%"),
            position: "absolute",
            right: rightCategory,
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
            <Text style={styles.categoryTitle}>{Translate.t("category")}</Text>
          </View>
          {categoryHtml}
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
        <Animated.View
          style={{
            paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0,
            zIndex: 1,
            height: heightPercentageToDP("100%"),
            alignSelf: "center",
            width: widthPercentageToDP("80%"),
            position: "absolute",
            right: rightSorting,
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
            onPress={() => filterProductsBySorting("latestFirst")}
          >
            <View style={styles.categoryContainer}>
              <Text>Latest First</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => filterProductsBySorting("LowToHigh")}
          >
            <View style={styles.categoryContainer}>
              <Text>Price Low to High</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => filterProductsBySorting("HighToLow")}
          >
            <View style={styles.categoryContainer}>
              <Text>Price High to Low</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => hideSortingAnimation()}>
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
        <ScrollView style={styles.home_product_view}>
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
        {/* {console.log(showCategory)} */}
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
    minHeight: heightPercentageToDP("15%"),
    // paddingBottom: heightPercentageToDP("15%"),
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: heightPercentageToDP("3%"),
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
