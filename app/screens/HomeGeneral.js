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
  StatusBar,
  TextInput,
  Platform,
  Linking
} from "react-native";

import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import SplashScreen from 'react-native-splash-screen'
import { getStatusBarHeight } from "react-native-status-bar-height";
import CustomHeader from "../assets/CustomComponents/CustomHeader";
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
import { Notifications } from 'react-native-notifications'

import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";

import { firebaseConfig } from "../../firebaseConfig.js";
import { NavigationActions } from "react-navigation";
import { hide } from "expo-splash-screen";
import { EventRegister } from 'react-native-event-listeners'
import notificationHelper from "../lib/notificationHelper";
import navigationHelper from "../lib/navigationHelper";
import imageHelper from "../lib/imageHelper";
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
let taxRate = 0;
let handlerCount = 0;

export default function Home(props) {
  const [favoriteText, showFavoriteText] = useStateIfMounted(false);
  const [user, onUserChanged] = useStateIfMounted({});
  const [featuredHtml, onFeaturedHtmlChanged] = useStateIfMounted([]);
  const [userAuthorityId, setUserAuthorityId] = useStateIfMounted(0);
  const [kinujoHtml, onKinujoHtmlChanged] = useStateIfMounted([]);
  const [showCategory, onCategoryShow] = useStateIfMounted(false);
  const [categoryHtml, onCategoryHtmlChanged] = useStateIfMounted([]);
  const [cartCount, onCartCountChanged] = useStateIfMounted(0);
  const isFocused = useIsFocused();
  const right = React.useRef(new Animated.Value(widthPercentageToDP("-80%")))
    .current;

  let userId = "";
  let d_params = {
    snapIds: [],
    seller: ''
  };

  var handleOpenURL = (url) => {
    console.log('handlerCount', handlerCount);
    if (handlerCount == 0) {
      console.log('handleOpenURL', url);
      let type = typeof url;
      if (type == "object") {
        url = url.url;
      }
      url = decodeURI(url);
      if (url.includes('success')) {
        var strList = url.replace('net.c2sg.kinujo://complete/success/', '').split('/');
        d_params.snapIds = strList[0].split(',');
        d_params.seller = strList[1];
        // alert.warning(
        //   "Payment Success"
        // );
        updateShop();
      } else if (url.includes('cancel')) {
        console.log('HomeStore Cart url', url);
        // alert.warning(
        //   "Payment Cancelled"
        // );
      } else {
        console.log('Linking other url', url);
      }
    }
    handlerCount ++;
  }

  Linking.getInitialURL().then((url) => {
    if (url) {
      handleOpenURL(url)
    }
  }).catch(err => {console.log('Linking ERROR', err)})
  Linking.removeEventListener('url', handleOpenURL);
  Linking.addEventListener('url', handleOpenURL);


  async function updateShop() {
    AsyncStorage.getItem("user").then((url) => {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      userId = urls[urls.length - 1];

      db.collection("users")
        .doc(userId)
        .collection("carts")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            d_params.snapIds.forEach(param_id => {
              if (param_id == documentSnapshot.id) {
                db.collection("users")
                  .doc(userId)
                  .collection("carts")
                  .doc(documentSnapshot.id)
                  .delete()
                  .then(() => {
                    console.log('Deleted item from cart');
                  });
              }
            });
          });
        });

      // add seller for pushnotification
      pushSeller(userId)

    });
  }

  async function pushSeller(userId) {
    // update cart
    onCartCountChanged(0);
    db.collection("users")
        .doc(userId.toString())
        .collection("carts")
        .get()
        .then((querySnap) => {
          let totalItemQty = 0;
          querySnap.forEach(documentSnap => {
            totalItemQty += parseInt(documentSnap.data().quantity)
          });
          onCartCountChanged(totalItemQty);
        });
    if (d_params.seller != '') {
      let sellerList = [];
      let oldsellers = await db.collection("sellers").get();
      oldsellers.forEach((docRef) => {
        if (docRef.data().sellers && String(docRef.data().sellers) == String(d_params.seller)) {
          sellerList.push(docRef.id);
        }
      });
      console.log('sellerList', sellerList);
      sellerList.forEach((id) => {
        console.log('Seller', id);
        db.collection("sellers").doc(String(id)).delete()
          .then(() => {
            console.log("Document successfully deleted!");
          })
          .catch((error) => {
            console.error("Error removing document: ", error);
          });
      });

      db.collection("sellers")
        .add({
          sellers: d_params.seller,
        })
        .then(() => {
          console.log("Seller Document successfully added!");
        });

      d_params.seller = '';
    }
    // update the cart again
    db.collection("users")
      .doc(userId.toString())
      .collection("carts")
      .get()
      .then((querySnapShot) => {
        let totalItemQty = 0
        querySnapShot.forEach(documentSnapshot => {
          totalItemQty += parseInt(documentSnapshot.data().quantity)
        });
        onCartCountChanged(querySnapShot.size ? totalItemQty : 0);
      });
  }
  // Must be outside of any component LifeCycle (such as `componentDidMount`).
  PushNotification.configure({

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
      processNoti(notification)
      // process the notification
      // alert.warning(notification.data.b)
      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      // alert.warning(JSON.stringify(notification))
      processNoti(notification)
      // process the action
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });

  const processNoti = (remoteMessage) => {
    if (remoteMessage) {
      console.log('remoteMessage', remoteMessage.data);
      let groupID = remoteMessage.data.groupID;
      let groupName = remoteMessage.data.groupName;
      let groupType = remoteMessage.data.groupType;
      props.navigation.navigate("ChatScreen", {
        type: String(groupType),
        groupID: String(groupID),
        groupName: String(groupName),
      });
    }
  }

  React.useEffect(() => {

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        // alert.warning('on init'+ JSON.stringify(remoteMessage))
        console.log('remoteMessage', 'getInitialNotification', remoteMessage);
        processNoti(remoteMessage)
      });

    messaging()
      .onNotificationOpenedApp((remoteMessage) => {
        console.log('remoteMessage', 'onNotificationOpenedApp', remoteMessage);
        processNoti(remoteMessage)
      });

    messaging()
      .onMessage(({ notification,data }) => {
        notificationHelper.sendLocalNotification({
          title: notification.title,
          body: notification.body,
          data
        })
      });

    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem("product").then((product_id) => {
        AsyncStorage.removeItem("product").then(() => {
          let tmpProductId = product_id;
          if (tmpProductId) {
            let apiUrl = request.getApiUrl() + "products/" + tmpProductId;
            props.navigation.navigate("HomeStoreList", {
              url: apiUrl,
            });
          }
        });
      });

      AsyncStorage.removeItem("product");
    });
  }, []);

  React.useEffect(() => {
    hideCategoryAnimation();
    handlerCount = 0;
    Linking.removeEventListener('url', handleOpenURL);
  }, [!isFocused]);

  async function requestUserPermission(response_user) {
    await messaging().requestPermission()
      .then((authStatus) => {
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          messaging().getToken()
            .then((deviceToken) => {
              let user_id = response_user.id;
              if (user_id == undefined) {
                user_id = userId;
              }
              if (user_id != undefined && user_id != "") {
                console.log('user.message_notification_phone', response_user.message_notification_phone);
                if (response_user && response_user.message_notification_phone == false) {
                  deviceToken = "";
                }
                db.collection("users")
                  .doc(String(user_id))
                  .collection("token")
                  .doc(String(user_id))
                  .set({
                    tokenID: deviceToken,
                  })
                  .then(() => {
                    console.log("tokenID successfully written!");
                  })
                  .catch((error) => {
                    console.error("Error writing tokenID: ", error);
                  });
              }
            });
        }
      })
  }

  async function createNotificationChannel() {
    Notifications.setNotificationChannel({
      channelId: 'chat',
      name: 'Chat channel',
      description: 'Chat channel',
      importance: 5
    })

    // notificationOpenedListener = messaging().onNotificationOpened((notificationOpen) => {
    //   const { title, body } = notificationOpen.notification;
    //   console.log('onNotificationOpened:');
    //   Alert.alert(title, body);
    // });
    // // If your app is closed
    // const notificationOpen = await messaging().getInitialNotification();
    // if (notificationOpen) {
    //   console.log('getInitialNotification:');
    // }

  }
  // function featuredProductNavigation(seller, userShopName) {
  //   console.log(seller);
  //   if (seller) {
  //     props.navigation.navigate("HomeShop", {
  //       shopName: userShopName,
  //     });
  //   } else {
  //   }
  // }
  function processFeaturedProductHtml(featuredProducts) {
    let tmpFeaturedHtml = [];
    let idx = 0;
    featuredProducts.map((product) => {
      // console.log(product.name);
      let images = product.productImages.filter((image) => {
        return image.is_hidden == 0 && image.image.is_hidden == 0;
      });
      images = images.map(img=>{
        return imageHelper.getOriginalImage(img?.image?.image)
      })
      // console.log(
      //   product.productVarieties[0].productVarietySelections[0]
      //     .jancode_horizontal[0].jan_code
      // );
      tmpFeaturedHtml.push(
        <HomeProducts
          key={product.id}
          product_id={product.id}
          onSellerNamePress={() => {
            // console.log("zz");
            props.navigation.navigate("SellerProductList", {
              sellerName: product.user.shop_name ? product.user.shop_name : product.user.nickname,
            });
          }}
          //pass janCode
          onProductNamePress={() => {
            // let janCodes = [];
            // product.productVarieties.map((productVariety) => {
            //   productVariety.productVarietySelections.map(
            //     (productVarietySelection) => {
            //       productVarietySelection.jancode_horizontal.map(
            //         (horizontal) => {
            //           console.log(horizontal);
            //           if (horizontal.jan_code) {
            //             janCodes.push(horizontal.jan_code);
            //           }
            //         }
            //       );
            //       productVarietySelection.jancode_vertical.map((vertical) => {
            //         if (vertical.jan_code) {
            //           janCodes.push(vertical.jan_code);
            //         }
            //       });
            //     }
            //   );
            // });
            console.log(product)
            props.navigation.navigate("ProductList", {
              "id": product.id,
              "productName" : product.name
            });
          }}
          onPress={() => {
            navigationHelper.gotoHomeStoreList({
              props,
              url: product.url,
              images
            })
            // props.navigation.navigate("HomeStoreList", {
            //   url: product.url,
            // });
          }}
          idx={idx++}
          image={
            images.length > 0
              ? images[0]
              : "https://lovemychinchilla.com/wp-content/themes/shakey/assets/images/default-shakey-large-thumbnail.jpg"
          }
          office={product.brand_name}
          name={product.name}
          seller={product.user.shop_name ? product.user.shop_name: product.user.nickname}
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
              " : " +
              format.separator(product.shipping_fee) +
              "円"
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

  function processKinujoProductHtml(kinujoProducts) {
    let tmpKinujoHtml = [];
    let idx = 0;
    kinujoProducts.map((product) => {
      let images = product.productImages.filter((image) => {
        return image.is_hidden == 0 && image.image.is_hidden == 0;
      });

      images = images.map(img=>{
        return imageHelper.getOriginalImage(img?.image?.image)
      })

      tmpKinujoHtml.push(
        <HomeProducts
          key={product.id}
          product_id={product.id}
          onPress={() => {
            navigationHelper.gotoHomeStoreList({ props, url: product.url, images })
          }}
          onSellerNamePress={() => {
            // console.log("zz");
            props.navigation.navigate("SellerProductList", {
              sellerName: product.user.shop_name,
            });
          }}
          onProductNamePress={() => {
            let janCodes = [];
            // product.productVarieties.map((productVariety) => {
            //   productVariety.productVarietySelections.map(
            //     (productVarietySelection) => {
            //       productVarietySelection.jancode_horizontal.map(
            //         (horizontal) => {
            //           console.log(horizontal);
            //           if (horizontal.jan_code) {
            //             janCodes.push(horizontal.jan_code);
            //           }
            //         }
            //       );
            //       productVarietySelection.jancode_vertical.map((vertical) => {
            //         console.log(vertical);
            //         if (vertical.jan_code) {
            //           janCodes.push(vertical.jan_code);
            //         }
            //       });
            //     }
            //   );
            // });
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
          seller={product.user.shop_name}
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
              " : " +
              format.separator(product.shipping_fee) +
              " 円"
          }
          addFavourite={(favorite) => {
            showFavoriteText(favorite);
          }}
          productAuthorityID={product.user.authority.id}
        />
      );
    });
    return tmpKinujoHtml;
  }
  // function filterProductsByCateogry(categories, categoryID) {
  //   let tmpKinujoProducts = kinujoProducts;
  //   let tmpFeaturedProducts = featuredProducts;
  //   tmpKinujoProducts = kinujoProducts.filter((kinujo) => {
  //     return kinujo.category.id == categoryID;
  //   });
  //   tmpFeaturedProducts = featuredProducts.filter((featured) => {
  //     return featured.category.id == categoryID;
  //   });
  //   onFeaturedHtmlChanged(processFeaturedProductHtml(tmpFeaturedProducts));
  //   onKinujoHtmlChanged(processKinujoProductHtml(tmpKinujoProducts));
  //   hideCategoryAnimation();
  // }
  function processCategoryHtml(categories) {
    let tmpCategoryHtml = [];
    categories.map((category) => {
      // tmpCategoryHtml.push(
      //   <TouchableWithoutFeedback
      //     onPress={() => filterProductsByCateogry(categories, category.id)}
      //   >
      //     <View style={styles.categoryContainer} key={category.id}>
      //       <Text>{category.name}</Text>
      //     </View>
      //   </TouchableWithoutFeedback>
      // );
      tmpCategoryHtml.push(
        <TouchableWithoutFeedback
          onPress={() => navigateToCategorisePage(category.id, category.name)}
        >
          <View style={styles.categoryContainer} key={category.id}>
            <Text>{category.name}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    });
    return tmpCategoryHtml;
  }

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      SplashScreen.hide();

      // onFeaturedHtmlChanged([]);
      // onKinujoHtmlChanged([]);
      createNotificationChannel();
      AsyncStorage.getItem("user").then((url) => {
        let urls = url.split("/");
        urls = urls.filter((url) => {
          return url;
        });
        userId = urls[urls.length - 1];
      })
      AsyncStorage.getItem("user").then(function (url) {
        request
          .get(url)
          .then(function (response) {
            onUserChanged(response.data);
            setUserAuthorityId(response.data.authority.id);
            requestUserPermission(response.data);
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
      request.get("product_categories/").then(function (response) {
        onCategoryHtmlChanged(processCategoryHtml(response.data));
      });
      request
        .get("simple_products/")
        .then(function (response) {
          let products = response.data;
          // console.log(products)
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
            return product.user.authority.id == 1;
          });
          featuredProducts = products.filter((product) => {
            return product.user.authority.id != 1;
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
    });
    // chat users
    request
      .post("user/alluser/data")
      .then((response) => {
        console.log(response.data.users);
        AsyncStorage.setItem("chatuserlist", JSON.stringify(response.data.users)).then(
          () => {
          });
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
  function navigateToCategorisePage(categoryId, categoryName) {
    hideCategoryAnimation();
    props.navigation.navigate("HomeByCategory", {
      categoryID: categoryId,
      categoryName: categoryName,
    });
  }
  return (
    <TouchableWithoutFeedback onPress={() => hideCategoryAnimation()}>
      <SafeAreaView>
        <CustomHeader
          text={Translate.t("home")}
          onCartCount={(count) => {
            onCartCountChanged(count);
          }}
          overrideCartCount={cartCount}
          onFavoritePress={() => props.navigation.navigate("Favorite")}
          onPress={() => {
            props.navigation.navigate("Cart");
          }}
        />

        <CustomSecondaryHeader outUser={user} props={props}
          name={user.nickname}
          accountType={
            user.is_seller && user.is_master ? Translate.t("storeAccount") : ""
          }
        />
        <View style={styles.discription_header}>
          <TouchableWithoutFeedback onPress={() => showCategoryAnimation()}>
            <View
              style={{
                position: "absolute",
                right: 0,
                marginRight: widthPercentageToDP("3%"),
                // marginTop: heightPercentageToDP("3%"),
                borderRadius: 5,
                paddingVertical: heightPercentageToDP(".8%"),
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
            height: heightPercentageToDP("100%"),
            alignSelf: "center",
            width: widthPercentageToDP("80%"),
            position: "absolute",
            right: right,
            backgroundColor: "white",
          }}
        >
          <StatusBar />
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
                bottom: win.height / 6,
                right: widthPercentageToDP("4%"),
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
        </Animated.View>
        {/* ///////////////////////////////////////////////////////////////////////////////////////////////// */}
        <ScrollView style={styles.home_product_view}>
          {kinujoHtml.length > 0 ? (
            <TouchableWithoutFeedback>
              <View style={styles.section_header}>
                <Text style={styles.section_header_text}>
                  {"KINUJO official product"}
                </Text>
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
            // <TouchableWithoutFeedback
            //   onPress={() =>
            //     featuredProductNavigation(user.is_seller, user.shop_name)
            //   }
            // >
            <TouchableWithoutFeedback>
              <View style={styles.section_header}>
                <Text style={styles.section_header_text}>
                  {Translate.t("featuredProduct")}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ) : (
            // </TouchableWithoutFeedback>
            <View></View>
          )}
          {featuredHtml.length > 0 ? (
            <TouchableWithoutFeedback><View style={styles.section_product_2}>{featuredHtml}</View></TouchableWithoutFeedback>
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
    minHeight: heightPercentageToDP("7%"),
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
    marginBottom: heightPercentageToDP("5%"),
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  section_product_2: {
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

