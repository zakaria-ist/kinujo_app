import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Button,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import ImagePicker from "react-native-image-picker";
import { RadioButton } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";
import DropDownPicker from "react-native-dropdown-picker";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { useIsFocused } from "@react-navigation/native";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import ProductNoneVariations from "./ProductNoneVariations";
import ProductOneVariations from "./ProductOneVariations";
import ProductTwoVariations from "./ProductTwoVariations";
import {
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
// import DatePicker from "react-native-datepicker";
import { DatePicker } from "react-native-propel-kit";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import storage from "@react-native-firebase/storage";
import RNFetchBlob from "rn-fetch-blob";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig.js";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
var uuid = require("react-native-uuid");
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioProductAddIcon = win.width / 10 / 28;

let janCode = [];
let productStock = [];
let choices = [];
export default function ProductInformationAddNew(props) {
  const isFocused = useIsFocused();
  const [user, onUserChanged] = React.useState({});
  const [productName, onProductNameChanged] = React.useState("");
  const [noneVariationItems, onNoneVariationItemsChanged] = React.useState([]);
  const [oneVariationItems, onOneVariationItemsChanged] = React.useState([]);
  const [twoVariationItems, onTwoVariationItemsChanged] = React.useState([]);
  const [brandName, onBrandNameChanged] = React.useState("");
  const [pr, onPrChanged] = React.useState("");
  const [productId, onProductIdChanged] = React.useState("");
  const [productCategory, onProductCategoryChanged] = React.useState("");
  const [productVariation, onProductVariationChanged] = React.useState("none");
  const [publishState, onPublishStateChanged] = React.useState("");
  const [publishDate, onPublishDateChanged] = React.useState("");
  const [productStatus, onProductStatusChanged] = React.useState("");
  const [targetUser, onTargetUserChanged] = React.useState("");
  const [price, onPriceChanged] = React.useState("");
  const [storePrice, onStorePriceChanged] = React.useState("");
  const [shipping, onShippingChanged] = React.useState("");
  const [
    productPageDisplayMethod,
    onProductPageDisplayMethodChanged,
  ] = React.useState("");
  const [productImages, onProductImagesChanged] = React.useState([]);
  const [productImageHtml, onProductImageHtmlChanged] = React.useState([]);
  const [productDescription, onProductDescriptionChanged] = React.useState("");
  const [spinner, onSpinnerChanged] = React.useState(false);
  const [product, onProductChanged] = React.useState(false);
  const [productCategories, onProductCategoriesChanged] = React.useState([]);
  let type = props.route.params.type;
  function getId(url) {
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    let userId = urls[urls.length - 1];
    return userId;
  }
  React.useEffect(() => {
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
    request
      .get("product_categories/")
      .then((response) => {
        let categories = response.data.map((category) => {
          return {
            label: category.name,
            value: category.url,
          };
        });
        onProductCategoriesChanged(categories);

        if (props.route.params.url) {
          request.get(props.route.params.url).then((response) => {
            let tmpProduct = response.data;

            onProductCategoryChanged(tmpProduct.category.url);
            onProductChanged(response.data);
            onProductNameChanged(response.data.name);
            onBrandNameChanged(response.data.brand_name);
            onPrChanged(response.data.pr);
            onProductIdChanged(response.data.url_str);
            onPublishDateChanged(response.data.opened_date);
            onPublishStateChanged(
              response.data.is_opened ? "published" : "unpublished"
            );
            onProductVariationChanged(
              response.data.variety == 0
                ? "none"
                : response.data.variety == 1
                ? "one"
                : "two"
            );
            onProductStatusChanged(
              response.data.is_used == 0 ? "new" : "secondHand"
            );
            onTargetUserChanged(
              response.data.target == 0
                ? "allUser"
                : response.data.target == 1
                ? "generalUser"
                : "storeUser"
            );
            onPriceChanged(response.data.price.toString());
            onStorePriceChanged(response.data.store_price);
            onShippingChanged(response.data.shipping_fee + "");
            onProductDescriptionChanged(response.data.description);
            let oldImages = response.data.productImages.map((image) => {
              let tmpImage = image.image;
              tmpImage["is_old"] = true;
              return tmpImage;
            });
            onProductImagesChanged(oldImages);
            onProductPageDisplayMethodChanged("slidingType");
            let tmpImages = response.data.productImages;
            let html = [];
            tmpImages.map((image) => {
              image = image.image;
              html.push(
                <View
                  key={image.id}
                  style={{
                    marginTop: heightPercentageToDP("1%"),
                    height: 1,
                    width: "100%",
                    height: heightPercentageToDP("30%"),
                    borderRadius: 1,
                    borderWidth: 1,
                    borderColor: Colors.deepGrey,
                    borderStyle: "dashed",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{
                      width: "100%",
                      height: heightPercentageToDP("30%"),
                      position: "absolute",
                    }}
                    source={{ uri: image.image }}
                  />
                </View>
              );
            });
            onProductImageHtmlChanged(html);

            if (response.data.variety == 0) {
              let productVariety = response.data.productVarieties[0];
              let productVarietySelection =
                productVariety.productVarietySelections[0];
              let horizontal = productVarietySelection.jancode_horizontal[0];
              onNoneVariationItemsChanged({
                id: horizontal.id,
                janCode: horizontal.jan_code,
                stock: horizontal.stock,
              });
            }
            if (response.data.variety == 1) {
              let tmpItems = {};
              let productVariety = response.data.productVarieties[0];
              tmpItems["name"] = productVariety["name"];
              tmpItems["id"] = productVariety["id"];
              tmpItems["items"] = [];
              for (
                var i = 0;
                i < productVariety.productVarietySelections.length;
                i++
              ) {
                let productVarietySelection =
                  productVariety.productVarietySelections[i];
                let vertical = productVarietySelection.jancode_horizontal[0];
                tmpItems["items"].push({
                  id: vertical.id,
                  index: i,
                  choice: productVarietySelection.selection,
                  stock: vertical.stock + "",
                  janCode: vertical.jan_code,
                  hidden: vertical.is_hidden ? true : false,
                });
              }
              onOneVariationItemsChanged(tmpItems);
            }
            if (response.data.variety == 2) {
              let firstProductVariety = response.data.productVarieties[0];
              let secondProductVariety = response.data.productVarieties[1];

              let tmpItems = {
                items: [
                  {
                    id: firstProductVariety["id"],
                    index: 0,
                    horizontalItem: firstProductVariety["name"],
                    choices: [],
                  },
                  {
                    id: secondProductVariety["id"],
                    index: 1,
                    horizontalItem: secondProductVariety["name"],
                    choices: [],
                  },
                ],
                mappingValue: {},
              };

              rawMapping = {};

              firstProductVariety.productVarietySelections.map(
                (productVarietySelection) => {
                  rawMapping[productVarietySelection.id] =
                    productVarietySelection.selection;
                  tmpItems["items"][0]["choices"].push({
                    choiceIndex: tmpItems["items"][0]["choices"].length,
                    choiceItem: productVarietySelection.selection,
                    id: productVarietySelection.id,
                  });
                }
              );
              secondProductVariety.productVarietySelections.map(
                (productVarietySelection) => {
                  rawMapping[productVarietySelection.id] =
                    productVarietySelection.selection;
                  tmpItems["items"][1]["choices"].push({
                    choiceIndex: tmpItems["items"][1]["choices"].length,
                    choiceItem: productVarietySelection.selection,
                    id: productVarietySelection.id,
                  });
                }
              );

              firstProductVariety.productVarietySelections.map(
                (productVarietySelection) => {
                  productVarietySelection.jancode_horizontal.map(
                    (horizontal) => {
                      if (horizontal.horizontal && horizontal.vertical) {
                        let horizontalId = getId(horizontal.horizontal);
                        let verticalId = getId(horizontal.vertical);
                        if (
                          !tmpItems["mappingValue"][rawMapping[horizontalId]]
                        ) {
                          tmpItems["mappingValue"][
                            rawMapping[horizontalId]
                          ] = {};
                        }
                        tmpItems["mappingValue"][rawMapping[horizontalId]][
                          rawMapping[verticalId]
                        ] = {
                          id: horizontal.id,
                          stock: horizontal.stock + "",
                          janCode: horizontal.jan_code,
                          delete: horizontal.is_hidden ? true : false,
                        };
                      }
                    }
                  );
                  productVarietySelection.jancode_vertical.map((vertical) => {
                    if (vertical.horizontal && vertical.vertical) {
                      let horizontalId = getId(vertical.horizontal);
                      let verticalId = getId(vertical.vertical);
                      if (!tmpItems["mappingValue"][rawMapping[horizontalId]]) {
                        tmpItems["mappingValue"][rawMapping[horizontalId]] = {};
                      }
                      tmpItems["mappingValue"][rawMapping[horizontalId]][
                        rawMapping[verticalId]
                      ] = {
                        id: vertical.id,
                        stock: vertical.stock + "",
                        janCode: vertical.jan_code,
                        delete: vertical.is_hidden ? true : false,
                      };
                    }
                  });
                }
              );
              secondProductVariety.productVarietySelections.map(
                (productVarietySelection) => {
                  productVarietySelection.jancode_horizontal.map(
                    (horizontal) => {
                      if (horizontal.horizontal && horizontal.vertical) {
                        let horizontalId = getId(horizontal.horizontal);
                        let verticalId = getId(horizontal.vertical);
                        if (
                          !tmpItems["mappingValue"][rawMapping[horizontalId]]
                        ) {
                          tmpItems["mappingValue"][
                            rawMapping[horizontalId]
                          ] = {};
                        }
                        tmpItems["mappingValue"][rawMapping[horizontalId]][
                          rawMapping[verticalId]
                        ] = {
                          id: horizontal.id,
                          stock: horizontal.stock + "",
                          janCode: horizontal.jan_code,
                          delete: horizontal.is_hidden ? true : false,
                        };
                      }
                    }
                  );
                  productVarietySelection.jancode_vertical.map((vertical) => {
                    if (vertical.horizontal && vertical.vertical) {
                      let horizontalId = getId(vertical.horizontal);
                      let verticalId = getId(vertical.vertical);
                      if (!tmpItems["mappingValue"][rawMapping[horizontalId]]) {
                        tmpItems["mappingValue"][rawMapping[horizontalId]] = {};
                      }
                      tmpItems["mappingValue"][rawMapping[horizontalId]][
                        rawMapping[verticalId]
                      ] = {
                        id: vertical.id,
                        stock: vertical.stock + "",
                        janCode: vertical.jan_code,
                        delete: vertical.is_hidden ? true : false,
                      };
                    }
                  });
                }
              );
              onTwoVariationItemsChanged(tmpItems);
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  function onValueChanged(variant) {
    onProductVariationChanged(variant);
    if (variant == "none") {
    } else if (variant == "one") {
    } else if (variant == "two") {
    }
  }

  function createProduct(draft) {
    AsyncStorage.getItem("user").then(function (url) {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      let userId = urls[urls.length - 1];
      onSpinnerChanged(true);
      request
        .post("createProduct/" + userId + "/", {
          productName: productName,
          brandName: brandName,
          pr: pr,
          productId: productId,
          productCategory: productCategory,
          productVariation: productVariation,
          oneVariationItems: oneVariationItems,
          twoVariationItems: twoVariationItems,
          noneVariationItems: noneVariationItems,
          productStock: productStock,
          publishState: publishState,
          publishDate: publishDate,
          price: price,
          storePrice: storePrice,
          shipping: shipping,
          productPageDisplayMethod: productPageDisplayMethod,
          productImages: productImages,
          productDescription: productDescription,
          targetUser: targetUser,
          productStatus: productStatus,
          draft: draft,
        })
        .then((response) => {
          onSpinnerChanged(false);
          response = response.data;
          if (response.success) {
            props.navigation.goBack();
          } else {
            if (response.errors && Object.keys(response.errors).length > 0) {
              alert.warning(
                response.errors[Object.keys(response.errors)[0]][0] +
                  "(" +
                  Object.keys(response.errors)[0] +
                  ")"
              );
            } else if (response.error) {
              alert.warning(response.error);
            }
          }
        })
        .catch((error) => {
          onSpinnerChanged(false);
          if (
            error &&
            error.response &&
            error.response.data &&
            Object.keys(error.response.data).length > 0
          ) {
            alert.warning(
              error.response.data[Object.keys(error.response.data)[0]][0]
            );
          }
        });
    });
  }

  function saveProduct(draft) {
    AsyncStorage.getItem("user").then(function (url) {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      let userId = urls[urls.length - 1];
      onSpinnerChanged(true);
      console.log(twoVariationItems);
      request
        .post("editProduct/" + userId + "/", {
          id: product.id,
          productName: productName,
          brandName: brandName,
          pr: pr,
          productId: productId,
          productCategory: productCategory,
          productVariation: productVariation,
          oneVariationItems: oneVariationItems,
          twoVariationItems: twoVariationItems,
          noneVariationItems: noneVariationItems,
          productStock: productStock,
          publishState: publishState,
          publishDate: publishDate,
          price: price,
          storePrice: storePrice,
          shipping: shipping,
          productPageDisplayMethod: productPageDisplayMethod,
          productImages: productImages,
          productDescription: productDescription,
          targetUser: targetUser,
          productStatus: productStatus,
          draft: draft,
        })
        .then((response) => {
          onSpinnerChanged(false);
          response = response.data;
          console.log(response);
          if (response.success) {
            // props.navigation.goBack();
          } else {
            if (response.errors && Object.keys(response.errors).length > 0) {
              alert.warning(
                response.errors[Object.keys(response.errors)[0]][0] +
                  "(" +
                  Object.keys(response.errors)[0] +
                  ")"
              );
            } else if (response.error) {
              alert.warning(response.error);
            }
          }
        })
        .catch((error) => {
          onSpinnerChanged(false);
          if (
            error &&
            error.response &&
            error.response.data &&
            Object.keys(error.response.data).length > 0
          ) {
            alert.warning(
              error.response.data[Object.keys(error.response.data)[0]][0]
            );
          }
        });
    });
  }

  function handleGeneralPrice(value) {
    onPriceChanged(value.replace(/[^0-9]/g, ""));
    console.log(user);
    if (user.is_master) {
      onStorePriceChanged(value * 0.7 + "");
    } else if (user.is_seller) {
      onStorePriceChanged(value * 0.8 + "");
    }
  }
  function handleShippingPrice(value) {
    onShippingChanged(value.replace(/[^0-9]/g, ""));
  }
  return (
    <SafeAreaView>
      <Spinner
        visible={spinner}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <CustomHeader
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        text={Translate.t("productInformation")}
        onBack={() => props.navigation.goBack()}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
      />
      <CustomSecondaryHeader name={user.nickname} accountType={""} />
      <View style={{ height: height - heightPercentageToDP("20%") }}>
        <KeyboardAvoidingView>
          <ScrollView>
            <View style={styles.formContainer}>
              <Text style={styles.text}>{Translate.t("productName")}</Text>
              <TextInput
                style={styles.textInput}
                value={productName}
                onChangeText={(value) => {
                  onProductNameChanged(value);
                }}
              ></TextInput>

              <Text style={styles.text}>{Translate.t("brandName")}</Text>
              <TextInput
                style={styles.textInput}
                value={brandName}
                onChangeText={(value) => onBrandNameChanged(value)}
              ></TextInput>

              <Text style={styles.text}>{Translate.t("prStatement")}</Text>
              <TextInput
                multiline={true}
                numberOfLines={4}
                style={styles.prStatementInput}
                value={pr}
                onChangeText={(value) => onPrChanged(value)}
              ></TextInput>

              <Text style={styles.text}>{Translate.t("productIDURL")}</Text>
              <TextInput
                style={styles.textInput}
                value={productId}
                onChangeText={(value) => onProductIdChanged(value)}
              ></TextInput>

              <Text style={styles.text}>{Translate.t("productCategory")}</Text>
              <DropDownPicker
                style={styles.text}
                items={productCategories}
                defaultValue={productCategory ? productCategory : null}
                containerStyle={{
                  paddingVertical: 0,
                  width: widthPercentageToDP("86%"),
                }}
                labelStyle={{
                  fontSize: RFValue(12),
                  color: "gray",
                }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                selectedtLabelStyle={{
                  color: Colors.F0EEE9,
                }}
                dropDownStyle={{
                  backgroundColor: "#FFFFFF",
                  color: "black",
                  zIndex: 1000,
                }}
                placeholder={""}
                onChangeItem={(ci) => {
                  onProductCategoryChanged(ci.value);
                }}
              />

              <Text style={styles.text}>{Translate.t("variation")}</Text>
              <View style={styles.radioGroupContainer}>
                <RadioButton.Group
                  style={{ alignItems: "flex-start" }}
                  onValueChange={(variant) => {
                    if (!props.route.params.url) {
                      onValueChanged(variant);
                    }
                  }}
                  value={productVariation}
                >
                  <View style={styles.radionButtonLabel}>
                    <RadioButton.Android
                      value="one"
                      uncheckedColor="#FFF"
                      color="#BD9848"
                    />
                    <Text style={styles.radioButtonText}>
                      {"1 "}
                      {Translate.t("item")}
                    </Text>
                  </View>
                  <View style={styles.radionButtonLabel}>
                    <RadioButton.Android
                      value="two"
                      uncheckedColor="#FFF"
                      color="#BD9848"
                    />
                    <Text style={styles.radioButtonText}>
                      {"2 "}
                      {Translate.t("item")}
                    </Text>
                  </View>
                  <View style={styles.radionButtonLabel}>
                    <RadioButton.Android
                      value="none"
                      uncheckedColor="#FFF"
                      color="#BD9848"
                    />
                    <Text style={styles.radioButtonText}>
                      {Translate.t("none")}
                    </Text>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.line} />

              {/*1 項目*/}
              <View style={productVariation !== "one" ? styles.none : null}>
                <ProductOneVariations
                  pItems={oneVariationItems}
                  // type={type}
                  onItemsChanged={(items) => {
                    onOneVariationItemsChanged(items);
                  }}
                />
              </View>
              <View style={productVariation !== "two" ? styles.none : null}>
                <ProductTwoVariations
                  pItems={twoVariationItems}
                  // type={type}
                  onItemsChanged={(items) => {
                    onTwoVariationItemsChanged(items);
                  }}
                />
              </View>
              <View style={productVariation !== "none" ? styles.none : null}>
                {
                  <ProductNoneVariations
                    pItems={noneVariationItems}
                    type={type}
                    onItemsChanged={(items) => {
                      onNoneVariationItemsChanged(items);
                    }}
                  />
                }
              </View>

              <Text style={styles.text}>{Translate.t("publishState")}</Text>
              <View style={styles.radioGroupContainer}>
                <RadioButton.Group
                  onValueChange={(newValue) => onPublishStateChanged(newValue)}
                  value={publishState}
                >
                  <RadioButton.Android
                    uncheckedColor="#FFF"
                    color="#BD9848"
                    value="published"
                  />
                  <Text style={styles.radioButtonText}>
                    {Translate.t("published")}
                  </Text>
                  <RadioButton.Android
                    uncheckedColor="#FFF"
                    color="#BD9848"
                    value="unpublished"
                  />
                  <Text style={styles.radioButtonText}>
                    {Translate.t("nonPublished")}
                  </Text>
                </RadioButton.Group>
              </View>
              <View style={styles.releaseDateContainer}>
                <Text style={styles.radioButtonText}>
                  {Translate.t("publishedDate")} :
                </Text>
                {/* {publishDate ? (
                <Text style={fontSize}>{publishDate}</Text>
              ) : ( */}
                <DatePicker
                  // title="Select Published Date"
                  placeholder="Select Published Date"
                  initialValue={new Date()}
                  textStyle={((alignSelf = "center"), (color = "blue"))}
                  style={{
                    color: "white",
                    fontSize: RFValue(12),
                    borderWidth: 1,
                    width: widthPercentageToDP("60%"),
                    height: heightPercentageToDP("5%"),
                    alignItems: "center",
                    color: "black",
                    borderRadius: 5,
                    marginLeft: widthPercentageToDP("3%"),
                    paddingLeft: widthPercentageToDP("7%"),
                    paddingVertical: heightPercentageToDP("1%"),
                    // borderColor: Colors.CECECE,
                  }}
                  onDateChange={(date) => {
                    onPublishDateChanged(date);
                  }}
                />
                {/* )} */}
                {/* <DatePicker
                style={{
                  marginLeft: widthPercentageToDP("1%"),
                  width: widthPercentageToDP("40%"),
                }}
                // value={publishDate}
                onDateChange={(date) => {
                  onPublishDateChanged(date);
                }}
              /> */}
                {/* <TextInput
                style={styles.releaseDateTextInput}
                value={publishDate}
                onChangeText={(value) => onPublishDateChanged(value)}
              ></TextInput> */}
              </View>
              <Text style={styles.releaseDateWarningText}>
                {Translate.t("publishWarning")}
              </Text>
              <Text style={styles.text}>{Translate.t("productStatus")}</Text>
              <View style={styles.radioGroupContainer}>
                <RadioButton.Group
                  onValueChange={(newValue) => onProductStatusChanged(newValue)}
                  value={productStatus}
                >
                  <RadioButton.Android
                    uncheckedColor="#FFF"
                    color="#BD9848"
                    value="new"
                  />
                  <Text style={styles.radioButtonText}>
                    {Translate.t("new")}
                  </Text>
                  <RadioButton.Android
                    uncheckedColor="#FFF"
                    color="#BD9848"
                    value="secondHand"
                  />
                  <Text style={styles.radioButtonText}>
                    {Translate.t("secondHand")}
                  </Text>
                </RadioButton.Group>
              </View>
              <Text style={styles.text}>{Translate.t("targetUser")}</Text>
              <View style={styles.radioGroupContainer}>
                <RadioButton.Group
                  onValueChange={(newValue) => onTargetUserChanged(newValue)}
                  value={targetUser}
                >
                  <RadioButton.Android
                    uncheckedColor="#FFF"
                    color="#BD9848"
                    value="allUser"
                  />
                  <Text style={styles.radioButtonText}>
                    {Translate.t("allUser")}
                  </Text>
                  <RadioButton.Android
                    uncheckedColor="#FFF"
                    color="#BD9848"
                    value="generalUser"
                  />
                  <Text style={styles.radioButtonText}>
                    {Translate.t("generalUser")}
                  </Text>
                  <RadioButton.Android
                    uncheckedColor="#FFF"
                    color="#BD9848"
                    value="storeUser"
                  />
                  <Text style={styles.radioButtonText}>
                    {Translate.t("storeUser")}
                  </Text>
                </RadioButton.Group>
              </View>
              <Text style={styles.releaseDateWarningText}>
                {Translate.t("notVisibleToUser")}
              </Text>
              <Text style={styles.text}>
                {Translate.t("pricingExcludingTax")}
              </Text>
              <View
                style={{
                  width: "100%",
                  paddingTop: RFValue(10),
                }}
              >
                <View style={styles.productPricingContainer}>
                  <Text style={styles.productCurrency}>円</Text>
                  <TextInput
                    keyboardType={"numeric"}
                    style={styles.productPricingTextInput}
                    value={price}
                    onChangeText={(value) => {
                      handleGeneralPrice(value);
                    }}
                  ></TextInput>
                  <Text style={styles.productPricingText}>
                    {Translate.t("generalPrice")} :
                  </Text>
                </View>
                <View style={styles.productPricingContainer}>
                  <Text style={styles.productCurrency}>円</Text>
                  <TextInput
                    editable={false}
                    keyboardType={"numeric"}
                    style={styles.storePriceInput}
                    value={storePrice}
                    onChangeText={(value) => onStorePriceChanged(value)}
                  ></TextInput>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.productPricingText}>
                      {Translate.t("storePrice")} :
                    </Text>
                    <Text style={{ color: "red", fontSize: RFValue(7) }}>
                      {Translate.t("automaticCalculation")}
                    </Text>
                  </View>
                </View>
                <View style={styles.productPricingContainer}>
                  <Text style={styles.productCurrency}>円</Text>
                  <TextInput
                    keyboardType={"numeric"}
                    style={styles.productPricingTextInput}
                    value={shipping}
                    onChangeText={(value) => handleShippingPrice(value)}
                  ></TextInput>
                  <Text style={styles.productPricingText}>
                    {Translate.t("shipping")} :
                  </Text>
                </View>
              </View>
              {/* <Text style={[styles.text, { marginTop: 15 }]}>
              {Translate.t("productPageDisplayMethod")}
            </Text>
            <View style={styles.radioGroupContainer}>
              <RadioButton.Group
                onValueChange={(newValue) =>
                  onProductPageDisplayMethodChanged(newValue)
                }
                value={productPageDisplayMethod}
              >
                <RadioButton.Android
                  uncheckedColor="#FFF"
                  color="#BD9848"
                  value="slidingType"
                />
                <Text style={styles.radioButtonText}>
                  {Translate.t("slidingType")}
                </Text>

                <RadioButton.Android
                  uncheckedColor="#FFF"
                  color="#BD9848"
                  value="lrType"
                />
                <Text style={styles.radioButtonText}>
                  {Translate.t("lrType")}
                </Text>
              </RadioButton.Group>
            </View> */}
              <Text style={styles.text}>{Translate.t("productImage")}</Text>
              {productImageHtml}
              <View
                style={{
                  marginTop: heightPercentageToDP("1%"),
                  marginBottom: heightPercentageToDP("1%"),
                  height: 1,
                  width: "100%",
                  height: heightPercentageToDP("30%"),
                  borderRadius: 1,
                  borderWidth: 1,
                  borderColor: Colors.deepGrey,
                  borderStyle: "dashed",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {productImages.length < 5 ? (
                  <TouchableWithoutFeedback
                    style={{
                      width: "100%",
                      height: heightPercentageToDP("30%"),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      const options = {
                        noData: true,
                      };
                      ImagePicker.launchImageLibrary(options, (response) => {
                        if (response.uri) {
                          const formData = new FormData();
                          formData.append("image", {
                            ...response,
                            uri:
                              Platform.OS === "android"
                                ? response.uri
                                : response.uri.replace("file://", ""),
                            name: "mobile-" + uuid.v4() + ".jpg",
                            type: "image/jpeg", // it may be necessary in Android.
                          });
                          request
                            .post("images/", formData, {
                              "Content-Type": "multipart/form-data",
                            })
                            .then((response) => {
                              let tmpImages = productImages;
                              tmpImages.push(response.data);
                              onProductImagesChanged(tmpImages);
                              let html = [];
                              tmpImages.map((image) => {
                                html.push(
                                  <View
                                    key={image.id}
                                    style={{
                                      marginTop: heightPercentageToDP("1%"),
                                      height: 1,
                                      width: "100%",
                                      height: heightPercentageToDP("30%"),
                                      borderRadius: 1,
                                      borderWidth: 1,
                                      borderColor: Colors.deepGrey,
                                      borderStyle: "dashed",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Image
                                      style={{
                                        width: "100%",
                                        height: heightPercentageToDP("30%"),
                                        position: "absolute",
                                      }}
                                      source={{ uri: image.image }}
                                    />
                                  </View>
                                );
                              });
                              onProductImageHtmlChanged(html);
                            })
                            .catch((error) => {
                              alert.warning(JSON.stringify(error));
                              if (
                                error &&
                                error.response &&
                                error.response.data &&
                                Object.keys(error.response.data).length > 0
                              ) {
                                alert.warning(
                                  error.response.data[
                                    Object.keys(error.response.data)[0]
                                  ][0]
                                );
                              }
                            });
                        }
                      });
                    }}
                  >
                    <Image
                      style={{
                        width: win.width / 10,
                        height: 28 * ratioProductAddIcon,
                        position: "absolute",
                      }}
                      source={require("../assets/Images/productAddIcon.png")}
                    />
                    <Text
                      style={{
                        marginTop: heightPercentageToDP("15%"),
                        fontSize: RFValue(12),
                      }}
                    >
                      {Translate.t("uploadAPhoto")}
                    </Text>
                  </TouchableWithoutFeedback>
                ) : null}
              </View>
              <Text style={styles.text}>
                {Translate.t("productDescription")}
              </Text>
              <TextInput
                style={styles.productDescriptionInput}
                multiline={true}
                value={productDescription}
                onChangeText={(value) => onProductDescriptionChanged(value)}
              ></TextInput>
            </View>
            <View style={styles.allButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (props.route.params.url) {
                    saveProduct(1);
                  } else {
                    createProduct(1);
                  }
                }}
              >
                <View style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>
                    {Translate.t("saveDraft")}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (productImages.length == 0) {
                    Alert.alert(
                      Translate.t("warning"),
                      Translate.t("uploadPicture"),
                      [
                        {
                          text: "OK",
                          onPress: () => {},
                        },
                      ],
                      { cancelable: false }
                    );
                  } else {
                    if (props.route.params.url) {
                      saveProduct(0);
                    } else {
                      createProduct(0);
                    }
                  }
                }}
              >
                <View style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>
                    {Translate.t("listing")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                request
                  .patch(props.route.params.url, {
                    is_hidden: 1,
                  })
                  .then((response) => {
                    props.navigation.goBack();
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.E6DADE,
                  width: widthPercentageToDP("35%"),
                  borderRadius: 5,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  height: heightPercentageToDP("6%"),
                  padding: widthPercentageToDP("1.4%"),
                  marginBottom: heightPercentageToDP("3%"),
                }}
              >
                <Text style={styles.buttonText}>{Translate.t("delete")}</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  none: {
    display: "none",
  },
  line: {
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#BD9848",
    width: widthPercentageToDP("94%"),
    marginHorizontal: widthPercentageToDP("-4%"),
  },
  subframe: {
    borderWidth: 1,
    borderColor: "#BD9848",
    marginTop: heightPercentageToDP("2%"),
    padding: 6,
    marginLeft: -3,
  },

  textInput: {
    borderWidth: 0,
    backgroundColor: "white",
    fontSize: RFValue(12),
    width: "100%",
    height: heightPercentageToDP("6%"),
    marginTop: heightPercentageToDP("1%"),
    marginBottom: heightPercentageToDP("2%"),
    padding: 10,
    paddingLeft: widthPercentageToDP("2%"),
  },
  text: {
    fontSize: RFValue(12),
    marginBottom: heightPercentageToDP("2%"),
    width: "100%",
  },
  radioButtonText: {
    fontSize: RFValue(10),
  },
  radioGroupContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radionButtonLabel: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingRight: 10,
    flexBasis: "auto",
  },
  releaseDateTextInput: {
    borderWidth: 0,
    backgroundColor: "white",
    fontSize: RFValue(11),
    height: heightPercentageToDP("5%"),
    marginLeft: widthPercentageToDP("2%"),
    marginTop: heightPercentageToDP("1%"),
    flex: 1,
    paddingLeft: widthPercentageToDP("2%"),
  },
  releaseDateContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  releaseDateWarningText: {
    fontSize: RFValue(11),
    marginTop: heightPercentageToDP("1%"),
    color: "red",
  },
  buttonContainer: {
    backgroundColor: Colors.E6DADE,
    width: widthPercentageToDP("35%"),
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: heightPercentageToDP("6%"),
    padding: widthPercentageToDP("1.4%"),
  },
  buttonText: {
    fontSize: RFValue(14),
    color: "white",
  },
  allButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: heightPercentageToDP("10%"),
    marginTop: heightPercentageToDP("3%"),
    marginBottom: heightPercentageToDP("5%"),
  },
  addProductButtonText: {
    fontSize: RFValue(11),
    color: "white",
  },
  productPricingTextInput: {
    borderWidth: 0,
    backgroundColor: "white",
    fontSize: RFValue(10),
    width: widthPercentageToDP("60%"),
    height: heightPercentageToDP("5.2%"),
    marginLeft: widthPercentageToDP("2%"),
    marginTop: heightPercentageToDP("1%"),
    paddingLeft: widthPercentageToDP("2%"),
  },
  productCurrency: {
    position: "absolute",
    top: heightPercentageToDP("1%"),
    paddingTop: RFValue(10),
    left: widthPercentageToDP("2%"),
    zIndex: 10,
  },
  storePriceInput: {
    borderWidth: 0,
    backgroundColor: "#D3D3D3",
    fontSize: RFValue(10),
    width: widthPercentageToDP("60%"),
    height: heightPercentageToDP("5.2%"),
    marginLeft: widthPercentageToDP("2%"),
    marginTop: heightPercentageToDP("1%"),
    paddingLeft: widthPercentageToDP("2%"),
  },
  productPricingContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    position: "relative",
  },
  productPricingText: {
    fontSize: RFValue(9),
    marginTop: heightPercentageToDP("1%"),
  },
  formContainer: {
    backgroundColor: Colors.F0EEE9,
    marginHorizontal: widthPercentageToDP("3%"),
    alignItems: "flex-start",
    marginTop: heightPercentageToDP("3%"),
    padding: widthPercentageToDP("4%"),
  },
  prStatementInput: {
    borderWidth: 0,
    backgroundColor: "white",
    fontSize: RFValue(12),
    width: "100%",
    marginTop: heightPercentageToDP("1%"),
    marginBottom: heightPercentageToDP("2%"),
    padding: 10,
    paddingLeft: widthPercentageToDP("2%"),
  },
  productDescriptionInput: {
    borderWidth: 0,
    backgroundColor: "white",
    fontSize: RFValue(12),
    height: heightPercentageToDP("15%"),
    width: "100%",
    marginTop: heightPercentageToDP("1%"),
    paddingLeft: widthPercentageToDP("2%"),
  },
});
