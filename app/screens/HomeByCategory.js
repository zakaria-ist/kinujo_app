import React from "react";
import { InteractionManager } from 'react-native';

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
import { useStateIfMounted } from "use-state-if-mounted";
// import CachedImage from 'react-native-expo-cached-image';
import { getStatusBarHeight } from "react-native-status-bar-height";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import CustomFloatingButton from "../assets/CustomComponents/CustomFloatingButton";
import HomeProducts from "./HomeProducts";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { useIsFocused } from "@react-navigation/native";
// import messaging from "@react-native-firebase/messaging";
import {
  widthPercentageToDP,
  heightPercentageToDP
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "../assets/Colors";
import Format from "../lib/format";
import firebase from "firebase/app";
import { firebaseConfig } from "../../firebaseConfig.js";
// import { NavigationActions } from "react-navigation";
// import { keys } from "lodash";
// import { cos } from "react-native-reanimated";
import navigationHelper from "../lib/navigationHelper";
import imageHelper from "../lib/imageHelper";
// import { black } from "react-native-paper/lib/typescript/styles/colors";
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
let filteredKinujoProducts;
let filteredFeaturedProducts;
let categoryDetails;
let sellers = [];
let productsView = {};
let taxRate = 0;
let allCategories = [];
export default function HomeByCategory(props) {
  let category_name = props.route.params.categoryName ? props.route.params.categoryName : "";
  const [favoriteText, showFavoriteText] = useStateIfMounted(false);
  const [user, onUserChanged] = useStateIfMounted({});
  const [userAuthorityId, setUserAuthorityId] = useStateIfMounted(0);
  const [featuredHtml, onFeaturedHtmlChanged] = useStateIfMounted([]);
  const [kinujoHtml, onKinujoHtmlChanged] = useStateIfMounted([]);
  const [showCategory, onCategoryShow] = useStateIfMounted(false);
  const [categoryHtml, onCategoryHtmlChanged] = useStateIfMounted([]);
  const [categoryName, onCategoryName] = useStateIfMounted(category_name);
  const [selected, onSelected] = useStateIfMounted("");
  const rightCategory = React.useRef(
    new Animated.Value(widthPercentageToDP("-80%"))
  ).current;
  const [productID, onProductIDChanged] = useStateIfMounted([]);
  const [productView, onProductView] = useStateIfMounted(0);
  const [officialProductCount, onOfficialProductCount] = useStateIfMounted(0);
  const [featuredProductCount, onFeaturedProductCount] = useStateIfMounted(0);
  const [sellCount, setSellerCount] = useStateIfMounted(0);
  const isFocused = useIsFocused();
  const right = React.useRef(new Animated.Value(widthPercentageToDP("-80%")))
    .current;
  const categoryID = props.route.params.categoryID;
  let categorySelected = category_name;

  React.useEffect(() => {
    hideAll();
    onSelected("");
  }, [!isFocused]);
  function processFeaturedProductHtml(featuredProducts) {
    let tmpFeaturedHtml = [];
    let featuredProductCount = 0;
    let idx = 0;
    featuredProducts.map((product) => {
      let images = product.productImages.filter((image) => {
        return image.is_hidden == 0 && image.image.is_hidden == 0;
      });

      images = images.map(img=>{
        return imageHelper.getOriginalImage(img.image.image)
      })
      if (!sellers.includes(product.user.id)) {
        sellers.push(product.user.id);
      }
      tmpFeaturedHtml.push(
        <HomeProducts
          key={product.id}
          product_id={product.category}
          onPress={() => {
            navigationHelper.gotoHomeStoreList({
              props,
              url: product.url,
              images
            })
          }}
          onSellerNamePress={() => {
            props.navigation.navigate("SellerProductList", {
              sellerName: product.user.shop_name ? product.user.shop_name : product.user.nickname,
            });
          }}
          onProductNamePress={() => {
            props.navigation.navigate("ProductList", {
              "id": product.id,
              "productName" : product.name
            });
          }}
          idx={idx++}
          image={
            images.length > 0
              ? images[0]
              : "https://lovemychinchilla.com/wp-content/themes/shakey/assets/images/default-shakey-large-thumbnail.jpg"
          }
          office={product.brand_name}
          name={product.name}
          seller={product.user.shop_name ? product.user.shop_name : product.user.nickname}
          price={
            (user.is_seller && user.is_approved
              ? format.separator(parseFloat(product.store_price) + (parseFloat(product.store_price) * taxRate))
              : format.separator(parseFloat(product.price) + (parseFloat(product.price) * taxRate))) + " 円"
          }
          category={product.category.name}
          shipping={
            product.shipping_fee == 0
              ? Translate.t("freeShipping")
              : Translate.t("shipping") +
                " : "
                +format.separator(product.shipping_fee) +
                "円"
          }
          addFavourite={(favorite) => {
            showFavoriteText(favorite);
          }}
          productAuthorityID={product.user.authority.id}
        />
      );
    });
    setSellerCount(sellers.length);
    return tmpFeaturedHtml;
  }

  function processKinujoProductHtml(kinujoProducts) {
    let tmpKinujoHtml = [];
    let officialProductCount = 0;
    let idx = 0;
    kinujoProducts.map((product) => {
      if (!sellers.includes(product.user.id)) {
        sellers.push(product.user.id);
      }
      let images = product.productImages.filter((image) => {
        return image.is_hidden == 0 && image.image.is_hidden == 0;
      });
      images = images.map(img=>{
        return imageHelper.getOriginalImage(img.image.image)
      })
      tmpKinujoHtml.push(
        <HomeProducts
          key={product.id}
          product_id={product.id}
          onPress={() => {
            navigationHelper.gotoHomeStoreList({
              props,
              url: product.url,
              images
            })
          }}
          onSellerNamePress={() => {
            props.navigation.navigate("SellerProductList", {
              sellerName: product.user.shop_name ? product.user.shop_name : product.user.nickname,
            });
          }}
          onProductNamePress={() => {
            props.navigation.navigate("ProductList", {
              "id": product.id,
              "productName" : product.name
            });
          }}
          idx={idx++}
          image={
            images.length > 0
              ? images[0]
              : "https://lovemychinchilla.com/wp-content/themes/shakey/assets/images/default-shakey-large-thumbnail.jpg"
          }
          office={product.brand_name}
          name={product.name}
          // name={product.id}
          seller={product.user.shop_name ? product.user.shop_name : product.user.nickname}
          price={
            (user.is_seller && user.is_approved
              ? format.separator(parseFloat(product.store_price) + (parseFloat(product.store_price) * taxRate))
              : format.separator(parseFloat(product.price) + (parseFloat(product.price) * taxRate))) + " 円"
          }
          category={product.category.name}
          shipping={
            product.shipping_fee == 0
              ? Translate.t("freeShipping")
              : Translate.t("shipping") +
                " : "
                +format.separator(product.shipping_fee) +
                "円"
          }
          addFavourite={(favorite) => {
            showFavoriteText(favorite);
          }}
          productAuthorityID={product.user.authority.id}
        />
      );
    });
    setSellerCount(sellers.length);
    return tmpKinujoHtml;
  }
  async function getDetails(productID, products) {
    let snapShot = await db.collection("products").doc(String(productID)).get();
    if (snapShot.data() && snapShot.data().view && snapShot.id == productID) {
      products.view = snapShot.data().view;
    } else {
      products.view = 0;
    }
    // console.log(products);
    return products;
  }
  function filterProductsBySorting(type) {
    let tmpKinujoProducts = filteredKinujoProducts;
    let tmpFeaturedProducts = filteredFeaturedProducts;
    if (type == "latestFirst") {
      onSelected("latestFirst");
      tmpFeaturedProducts = tmpFeaturedProducts.sort((a, b) => {
        let date1 = new Date(a.opened_date);
        let date2 = new Date(b.opened_date);

        if (date1 < date2) {
          return 1;
        }
        if (date1 > date2) {
          return -1;
        }
        return 0;
      });
      tmpKinujoProducts = tmpKinujoProducts.sort((a, b) => {
        let date1 = new Date(a.opened_date);
        let date2 = new Date(b.opened_date);
        if (date1 < date2) {
          return 1;
        }
        if (date1 > date2) {
          return -1;
        }
        return 0;
      });
      sellers = [];
      onFeaturedHtmlChanged(processFeaturedProductHtml(tmpFeaturedProducts));
      onKinujoHtmlChanged(processKinujoProductHtml(tmpKinujoProducts));
    }
    if (type == "LowToHigh") {
      onSelected("LowToHigh");
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
      onSelected("HighToLow");
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
    if (type == "Popular") {
      onSelected("Popular");

      tmpFeaturedProducts = tmpFeaturedProducts.sort((productA, productB) => {
        let productA_count = productsView[productA.id] ? productsView[productA.id] : 0
        let productB_count = productsView[productB.id] ? productsView[productB.id] : 0
        return (productB_count - productA_count);
      });
      tmpKinujoProducts = tmpKinujoProducts.sort((productA, productB) => {
        let productA_count = productsView[productA.id] ? productsView[productA.id] : 0
        let productB_count = productsView[productB.id] ? productsView[productB.id] : 0
        // return (productA_count === productB_count)? 0 : productA_count? -1 : 1;
        return (productB_count - productA_count);
      });
      onKinujoHtmlChanged(processKinujoProductHtml(tmpKinujoProducts));
      onFeaturedHtmlChanged(processFeaturedProductHtml(tmpFeaturedProducts));
    }
    if (type == "reset") {
      onSelected("");
      onKinujoHtmlChanged(processKinujoProductHtml(tmpKinujoProducts));
      onFeaturedHtmlChanged(processFeaturedProductHtml(tmpFeaturedProducts));
    }
    hideSortingAimation();
  }
  function filterProductsByCateogry(categories, categoryID, name) {
    categorySelected = name;
    filteredFeaturedProducts = featuredProducts;
    filteredKinujoProducts = kinujoProducts;
    if (categoryID != "reset") {
      onCategoryName(name);
      filteredFeaturedProducts = featuredProducts.filter((featured) => {
        return featured.category.id == categoryID;
      });
      filteredKinujoProducts = kinujoProducts.filter((kinujo) => {
        return kinujo.category.id == categoryID;
      });
    } else {
      onCategoryName("すべて");
    }
    onFeaturedHtmlChanged(processFeaturedProductHtml(filteredFeaturedProducts));
    onKinujoHtmlChanged(processKinujoProductHtml(filteredKinujoProducts));
    hideCategoryAnimation();
    filterProductsBySorting(selected);
    onCategoryHtmlChanged(processCategoryHtml(categories));
  }

  function processCategoryHtml(categories) {
    let tmpCategoryHtml = [];
    categories.map((category) => {
      tmpCategoryHtml.push(
        <TouchableWithoutFeedback
          onPress={() => {
            filterProductsByCateogry(categories, category.id, category.name)
          }}
        >
          <View style={{
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: Colors.D7CCA6,
              paddingVertical: heightPercentageToDP("1.5%"),
              backgroundColor: categorySelected == category.name ? "orange" : "white",
          }} >
            <Text>{category.name}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    });
    // tmpCategoryHtml.push(
    //   <TouchableWithoutFeedback
    //     onPress={() => {
    //       filterProductsByCateogry(categories, "reset", "");
    //     }}
    //   >
    //     <View style={styles.categoryContainer} >
    //       <Text>{Translate.t("reset")}</Text>
    //     </View>
    //   </TouchableWithoutFeedback>
    // );
    return tmpCategoryHtml;
  }
  React.useEffect(() => {
    // for gst
    request
      .get("tax_rates/")
      .then((response) => {
        let taxes = response.data.filter((item) => {
          let nowDate = new Date();
          if (item.start_date && item.end_date) {
            if (
              nowDate >= new Date(item.start_date) &&
              nowDate <= new Date(item.end_date)
            ) {
              return true;
            }
          } else if (item.start_date) {
            if (nowDate >= new Date(item.start_date)) {
              return true;
            }
          }
          return false;
        });

        if (taxes.length > 0) {
          taxRate = taxes[0].tax_rate;
        }
      })
      .catch((error) => {
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
    InteractionManager.runAfterInteractions(() => {
      onFeaturedHtmlChanged([]);
      onKinujoHtmlChanged([]);
      onCategoryName(props.route.params.categoryName);
      categorySelected = props.route.params.categoryName;

      db.collection("products").get().then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          productsView[documentSnapshot.id] = documentSnapshot.data()['view']
        });
      });

      AsyncStorage.getItem("user").then(function (url) {
        request
          .get(url)
          .then(function (response) {
            onUserChanged(response.data);
            setUserAuthorityId(response.data.authority.id);
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
        allCategories = response.data;
        onCategoryHtmlChanged(processCategoryHtml(response.data));
      });
      request
        .get("simple_products/")
        .then(function (response) {
          let products = response.data;
          products.push({
            view: 0,
          });
          products = products.sort((p1, p2) => {
            if (p1.created > p2.created) {
              return -1;
            }
            return 1;
          });

          products = products.filter((product) => {
            let date = new Date(product.is_opened);
            if (user.is_seller) {
              return (
                product.is_opened == 1 &&
                new Date() > date &&
                product.is_hidden == 0 &&
                product.is_draft == 0 &&
                (product.target == 0 || product.target == 2)
              );
            } else {
              return (
                product.is_opened == 1 &&
                new Date() > date &&
                product.is_hidden == 0 &&
                product.is_draft == 0 &&
                (product.target == 0 || product.target == 1)
              );
            }
          });

          kinujoProducts = products.filter((product) => {
            // if (product.category.id == categoryID) {
            return product.user.authority.id == 1;
            // }
          });
          featuredProducts = products.filter((product) => {
            return product.user.authority.id != 1;
          });
          filteredFeaturedProducts = featuredProducts.filter((item) => {
            return item.category.id == categoryID;
          });
          filteredKinujoProducts = kinujoProducts.filter((item) => {
            return item.category.id == categoryID;
          });
          onKinujoHtmlChanged(processKinujoProductHtml(filteredKinujoProducts));
          onFeaturedHtmlChanged(
            processFeaturedProductHtml(filteredFeaturedProducts)
          );
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
  }, [isFocused]);
  function showSortingAnimation() {
    onCategoryShow(true);
    Animated.timing(right, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }
  function hideSortingAimation() {
    onCategoryShow(false),
      Animated.timing(right, {
        toValue: widthPercentageToDP("-80%"),
        duration: 500,
        useNativeDriver: false,
      }).start();
  }

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
  function hideAll() {
    hideCategoryAnimation();
    hideSortingAimation();
  }

  return (
    <TouchableWithoutFeedback onPress={() => hideAll()}>
      <SafeAreaView>
        <CustomHeader
          text={Translate.t("productList")}
          onFavoritePress={() => props.navigation.navigate("Favorite")}
          onPress={() => {
            props.navigation.navigate("Cart");
          }}
          onBack={() => props.navigation.goBack()}
        />

        <CustomSecondaryHeader outUser={user} props={props}
          name={user.nickname}
          accountType={
            user.is_seller && user.is_master ? Translate.t("storeAccount") : ""
          }
        />
        <View style={styles.discription_header}>
          <View
            style={{
              position: "absolute",
              left: 0,
              justifyContent: "center",
              paddingTop: heightPercentageToDP("3%"),
              // backgroundColor: "orange",
              height: heightPercentageToDP("20%"),
              width: widthPercentageToDP("35%"),
            }}
          >
            <Text style={styles.disc_title_text}>
              {Translate.t("category")} : {categoryName}
            </Text>
          </View>
          <View
            style={{
              position: "absolute",
              right: 0,
              justifyContent: "center",
              paddingTop: heightPercentageToDP("3%"),
              // backgroundColor: "orange",
              height: heightPercentageToDP("20%"),
              width: widthPercentageToDP("35%"),
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
              right: 0,
              marginRight:
                userAuthorityId <= 3 ? RFValue(5) : widthPercentageToDP("15%"),
              borderStyle: "solid",
              paddingVertical: widthPercentageToDP("1%"),
              paddingHorizontal: widthPercentageToDP("7%"),
              marginTop:
                Platform.OS == "ios"
                  ? getStatusBarHeight() + heightPercentageToDP("6.7%")
                  : heightPercentageToDP("6.7%"),
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
            paddingTop:
              Platform.OS == "ios"
                ? getStatusBarHeight() + heightPercentageToDP("3%")
                : 0,
            zIndex: 1,
            height: heightPercentageToDP("150%"),
            alignSelf: "center",
            width: widthPercentageToDP("80%"),
            position: "absolute",
            right: right,
            backgroundColor: "white",
            flex: 1,
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
            <View
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: Colors.D7CCA6,
                paddingVertical: heightPercentageToDP("1.5%"),
                backgroundColor: selected == "latestFirst" ? "orange" : "white",
              }}
            >
              <Text>{Translate.t("latestFirst")}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => filterProductsBySorting("LowToHigh")}
          >
            <View
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: Colors.D7CCA6,
                paddingVertical: heightPercentageToDP("1.5%"),
                backgroundColor: selected == "LowToHigh" ? "orange" : "white",
              }}
            >
              <Text>{Translate.t("priceLowToHigh")}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => filterProductsBySorting("HighToLow")}
          >
            <View
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: Colors.D7CCA6,
                paddingVertical: heightPercentageToDP("1.5%"),
                backgroundColor: selected == "HighToLow" ? "orange" : "white",
              }}
            >
              <Text>{Translate.t("priceHighToLow")}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => filterProductsBySorting("Popular")}
          >
            <View
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: Colors.D7CCA6,
                paddingVertical: heightPercentageToDP("1.5%"),
                backgroundColor: selected == "Popular" ? "orange" : "white",
              }}
            >
              <Text>{Translate.t("popular")}</Text>
            </View>
          </TouchableWithoutFeedback>
          <View
            style={{
              flexDirection: "row",
              // position: "absolute",
              justifyContent: "space-evenly",
              // bottom: heightPercentageToDP("8%"),
              // marginTop: heightPercentageToDP("10%"),
              bottom: heightPercentageToDP("3%"),
              right: 0,
              marginTop: heightPercentageToDP("50%"),
              // right: widthPercentageToDP("3%"),
              // backgroundColor: "orange",
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => filterProductsBySorting("reset")}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: "white",
                  alignItems: "center",
                  paddingVertical: heightPercentageToDP(".7%"),
                  paddingHorizontal: widthPercentageToDP("2%"),
                }}
              >
                <Text style={{ fontSize: RFValue(12) }}>{Translate.t("reset")}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => hideSortingAimation()}>
              <View
                style={{
                  // position: "absolute",
                  // bottom: heightPercentageToDP("8%"),
                  // right: widthPercentageToDP("3%"),
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: "white",
                  alignItems: "center",
                  paddingVertical: heightPercentageToDP(".7%"),
                  paddingHorizontal: widthPercentageToDP("2%"),
                }}
              >
                <Text style={{ fontSize: RFValue(12) }}>{Translate.t("finish")}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>
        {/* ///////////////////////////////////////////////////////////////////////////////////////////////// */}
        <Animated.View
          style={{
            paddingTop:
              Platform.OS == "ios"
                ? getStatusBarHeight() + heightPercentageToDP("3%")
                : 0,
            zIndex: 1,
            height: heightPercentageToDP("150%"),
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              bottom: heightPercentageToDP("15%"),
              right: 0,
              marginTop: heightPercentageToDP("60%"),
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                filterProductsByCateogry(allCategories, "reset", "");
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: "white",
                  alignItems: "center",
                  paddingVertical: heightPercentageToDP(".7%"),
                  paddingHorizontal: widthPercentageToDP("2%"),
                }}
              >
                <Text style={{ fontSize: RFValue(12) }}>{Translate.t("reset")}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => hideCategoryAnimation()}>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: "white",
                  alignItems: "center",
                  paddingVertical: heightPercentageToDP(".7%"),
                  paddingHorizontal: widthPercentageToDP("2%"),
                }}
              >
                <Text style={{ fontSize: RFValue(12) }}>{Translate.t("finish")}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>
        {/* ///////////////////////////////////////////////////////////////////////////////////////////////// */}
        <ScrollView style={styles.home_product_view}>
          {kinujoHtml.length > 0 ? (
            <TouchableWithoutFeedback>
            <View style={styles.section_header}>
              {/* <Text style={styles.section_header_text}>
                {"Number of sellers:" +
                  (officialProductCount + featuredProductCount)}
              </Text> */}
            </View>
            </TouchableWithoutFeedback>
          ) : (
            <View></View>
          )}
          {kinujoHtml.length > 0 ? (
            <TouchableWithoutFeedback><View style={styles.section_product}>{kinujoHtml}</View></TouchableWithoutFeedback>
          ) : (
            <View></View>
          )}

          {featuredHtml.length > 0 ? (
            <TouchableWithoutFeedback>
            <View style={styles.section_header}>
              <Text style={styles.section_header_text}>
                {Translate.t("featuredProduct")}
              </Text>
            </View>
            </TouchableWithoutFeedback>
          ) : (
            <View></View>
          )}
          {featuredHtml.length > 0 ? (
            <TouchableWithoutFeedback><View style={styles.section_product2}>{featuredHtml}</View></TouchableWithoutFeedback>
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
    paddingBottom: heightPercentageToDP("15%"),
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    // flexWrap: "wrap",
    backgroundColor: "transparent",
    // backgroundColor: "orange",
    // height: heightPercentageToDP("12%"),
    // marginTop: heightPercentageToDP("1%"),
  },
  disc_title_text: {
    paddingTop: heightPercentageToDP("7%"),
    paddingLeft: widthPercentageToDP("4%"),
    fontSize: RFValue(14),
  },
  disc_button_group: {
    width: 100,
    flexDirection: "row-reverse",
  },
  home_product_view: {
    // flex: 1,
    // paddingBottom: heightPercentageToDP("15%"),
    height: heightPercentageToDP("82%"),
    padding: 15,
    paddingTop: heightPercentageToDP("1%"),
    backgroundColor: "transparent",
    overflow: "scroll",
    // backgroundColor: "orange",
  },
  categoryContainer: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    paddingVertical: heightPercentageToDP("1.5%"),
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
    marginBottom: heightPercentageToDP("5%"),
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  section_product2: {
    marginBottom: heightPercentageToDP("25%"),
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  categoryTitle: {
    alignSelf: "center",
    fontSize: RFValue(14),
    paddingTop: heightPercentageToDP("2%"),
    paddingBottom: heightPercentageToDP("2%"),
  },
});
