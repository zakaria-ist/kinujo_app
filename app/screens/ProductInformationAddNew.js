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
} from "react-native";
import { Colors } from "../assets/Colors.js";
import ImagePicker from "react-native-image-picker";
import { RadioButton } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import ProductNoneVariations from "./ProductNoneVariations";
import ProductOneVariations from "./ProductOneVariations";
import ProductTwoVariations from "./ProductTwoVariations";
import { ScrollView, TextInput, TouchableWithoutFeedback } from "react-native-gesture-handler";
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
export default function ProductInformationAdd(props) {
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
  
  function getId(url){
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
      if(props.route.params.url){
        console.log(props.route.params.url)
        request.get(props.route.params.url).then((response)=>{
          onProductChanged(response.data)
          onProductNameChanged(response.data.name)
          onBrandNameChanged(response.data.brand_name)
          onPrChanged(response.data.pr)
          onProductIdChanged(response.data.url_str)
          onPublishDateChanged(response.data.opened_date)
          onPublishStateChanged(response.data.is_opened ? "published" : "unpublished")
          onProductCategoryChanged(response.data.category)
          onProductVariationChanged(response.data.variety == 0 ? "none" : (response.data.variety == 1 ? "one" : "two"))
          onProductStatusChanged(response.data.is_used == 0 ? "new" : "secondHand")
          onTargetUserChanged(response.data.target == 0 ? "allUser" : (response.data.target == 1 ?  "generalUser" : "storeUser"))
          onPriceChanged(response.data.price.toString())
          onStorePriceChanged(response.data.store_price)
          onShippingChanged(response.data.shipping + "")
          onProductDescriptionChanged(response.data.description)
          onProductImagesChanged(response.data.productImages)

          let tmpImages = response.data.productImages;
          let html = []
          tmpImages.map((image) => {
            image = image.image;
            html.push(<View
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
            </View>)
          })
          onProductImageHtmlChanged(html);

          if(response.data.variety == 0){
            let productVariety = response.data.productVarieties[0]
            let productVarietySelection = productVariety.productVarietySelections[0]
            let horizontal = productVarietySelection.jancode_horizontal[0]
            onNoneVariationItemsChanged({
              id: horizontal.id,
              janCode: horizontal.jan_code,
              stock: horizontal.stock
            });
          }  
          if(response.data.variety == 1){
            let tmpItems = {}
            let productVariety = response.data.productVarieties[0]
            tmpItems['name'] = productVariety['name']
            tmpItems['items'] = []
            for(var i=0; i<productVariety.productVarietySelections.length; i++){
              let productVarietySelection = productVariety.productVarietySelections[i]
              let vertical = productVarietySelection.jancode_vertical[0]
              tmpItems['items'].push({
                id: vertical.id,
                index: i,
                choice: productVarietySelection.selection,
                stock: vertical.stock + "",
                janCode: vertical.jan_code,
              })
            }
            onOneVariationItemsChanged(tmpItems);
          }  
          if(response.data.variety == 2){
            let firstProductVariety = response.data.productVarieties[0]
            let secondProductVariety = response.data.productVarieties[1]

            let tmpItems = {
              "items" : [
                {
                  id: firstProductVariety['id'],
                  index: 0,
                  horizontalItem: firstProductVariety['name'],
                  choices: [
                  ],
                },
                {
                  id: secondProductVariety['id'],
                  index: 1,
                  horizontalItem: secondProductVariety['name'],
                  choices: [
                  ],
                },
              ],
              "mappingValue" : {}
            }

            rawMapping = {}

            firstProductVariety.productVarietySelections.map((productVarietySelection) => {
              rawMapping[productVarietySelection.id] = productVarietySelection.selection;
              tmpItems['items'][0]['choices'].push({
                choiceIndex: tmpItems['items'][0]['choices'].length,
                choiceItem: productVarietySelection.selection,
              })
            })
            secondProductVariety.productVarietySelections.map((productVarietySelection) => {
              rawMapping[productVarietySelection.id] = productVarietySelection.selection;
              tmpItems['items'][1]['choices'].push({
                choiceIndex: tmpItems['items'][1]['choices'].length,
                choiceItem: productVarietySelection.selection,
              })
            })

            firstProductVariety.productVarietySelections.map((productVarietySelection) => {
              productVarietySelection.jancode_horizontal.map((horizontal) => {
                if(horizontal.horizontal && horizontal.vertical){
                  let horizontalId = getId(horizontal.horizontal)
                  let verticalId = getId(horizontal.vertical)
                  if(!tmpItems['mappingValue'][rawMapping[horizontalId]]){
                    tmpItems['mappingValue'][rawMapping[horizontalId]] = {}
                  }
                  tmpItems['mappingValue'][rawMapping[horizontalId]][rawMapping[verticalId]] = {
                    id: horizontal.id,
                    stock: horizontal.stock + "",
                    janCode: horizontal.jan_code
                  }
                }
              })
              productVarietySelection.jancode_vertical.map((vertical) => {
                if(vertical.horizontal && vertical.vertical){
                  let horizontalId = getId(vertical.horizontal)
                  let verticalId = getId(vertical.vertical)
                  if(!tmpItems['mappingValue'][rawMapping[horizontalId]]){
                    tmpItems['mappingValue'][rawMapping[horizontalId]] = {}
                  }
                  tmpItems['mappingValue'][rawMapping[horizontalId]][rawMapping[verticalId]] = {
                    id: vertical.id,
                    stock: vertical.stock + "",
                    janCode: vertical.jan_code
                  }
                }
              })
            })
            secondProductVariety.productVarietySelections.map((productVarietySelection) => {
              productVarietySelection.jancode_horizontal.map((horizontal) => {
                if(horizontal.horizontal && horizontal.vertical){
                  let horizontalId = getId(horizontal.horizontal)
                  let verticalId = getId(horizontal.vertical)
                  if(!tmpItems['mappingValue'][rawMapping[horizontalId]]){
                    tmpItems['mappingValue'][rawMapping[horizontalId]] = {}
                  }
                  tmpItems['mappingValue'][rawMapping[horizontalId]][rawMapping[verticalId]] = {
                    id: horizontal.id,
                    stock: vertical.stock + "",
                    janCode: vertical.jan_code
                  }
                }
              })
              productVarietySelection.jancode_vertical.map((vertical) => {
                if(vertical.horizontal && vertical.vertical){
                  let horizontalId = getId(vertical.horizontal)
                  let verticalId = getId(vertical.vertical)
                  if(!tmpItems['mappingValue'][rawMapping[horizontalId]]){
                    tmpItems['mappingValue'][rawMapping[horizontalId]] = {}
                  }
                  tmpItems['mappingValue'][rawMapping[horizontalId]][rawMapping[verticalId]] = {
                    id: vertical.id,
                    stock: vertical.stock + "",
                    janCode: vertical.jan_code
                  }
                }
              })
            })
            onTwoVariationItemsChanged(tmpItems);
          }  
        })
      }
    }, [])
  function onValueChanged(variant) {
    onProductVariationChanged(variant);
    if (variant == "none") {
    } else if (variant == "one") {
    } else if (variant == "two") {
    }
  }

  function createProduct(draft){
    AsyncStorage.getItem("user").then(function (url) {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      let userId = urls[urls.length - 1];
      onSpinnerChanged(true)
      request.post("createProduct/" + userId + "/", {
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
        draft: draft
      }).then((response) => {
        onSpinnerChanged(false);
        response = response.data;
        if(response.success){
          props.navigation.pop();
        } else {
          if (
            response.errors &&
            Object.keys(response.errors).length > 0
          ) {
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
      }).catch((error) => {
        onSpinnerChanged(false);
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
      })
    });
  }

  function saveProduct(draft){
    AsyncStorage.getItem("user").then(function (url) {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      let userId = urls[urls.length - 1];
      onSpinnerChanged(true)
      request.post("saveProduct/" + userId + "/", {
        id:  product.id,
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
        draft: draft
      }).then((response) => {
        onSpinnerChanged(false);
        response = response.data;
        if(response.success){
          props.navigation.pop();
        } else {
          if (
            response.errors &&
            Object.keys(response.errors).length > 0
          ) {
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
      }).catch((error) => {
        onSpinnerChanged(false);
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
      })
    });
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
        onBack={() => props.navigation.pop()}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
      />
      <CustomSecondaryHeader name={user.nickname} accountType={""} />
      <View style={{ height: height - heightPercentageToDP("20%") }}>
        <ScrollView>
          <View style={styles.formContainer}>
            <Text style={styles.text}>{Translate.t("productName")}</Text>
            <TextInput
              style={styles.textInput}
              value={productName}
              onChangeText={(value) => {
                console.log(value);
                onProductNameChanged(value)
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
              style={styles.textInput}
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
            <TextInput
              style={styles.textInput}
              value={productCategory}
              onChangeText={(value) => onProductCategoryChanged(value)}
            ></TextInput>

            <Text style={styles.text}>{Translate.t("variation")}</Text>
            <View style={styles.radioGroupContainer}>
              <RadioButton.Group
                style={{ alignItems: "flex-start" }}
                onValueChange={(variant) => onValueChanged(variant)}
                value={productVariation}
              >
                <View style={styles.radionButtonLabel}>
                  <RadioButton
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
                  <RadioButton
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
                  <RadioButton
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
              <ProductOneVariations pItems={oneVariationItems} onItemsChanged={
                (items) => {
                  onOneVariationItemsChanged(items);
                }
              }/>
            </View>
            <View style={productVariation !== "two" ? styles.none : null}>
              <ProductTwoVariations pItems={twoVariationItems} onItemsChanged={
                (items) => {
                  onTwoVariationItemsChanged(items);
                }
              }/>
            </View>
            <View style={productVariation !== "none" ? styles.none : null}>
              {
                <ProductNoneVariations pItems={noneVariationItems} onItemsChanged={
                  (items) => {
                    onNoneVariationItemsChanged(items);
                  }
                }/>
              }
            </View>

            <Text style={styles.text}>{Translate.t("publishState")}</Text>
            <View style={styles.radioGroupContainer}>
              <RadioButton.Group
                onValueChange={(newValue) => onPublishStateChanged(newValue)}
                value={publishState}
              >
                <Text style={styles.radioButtonText}>
                  {Translate.t("published")}
                </Text>
                <RadioButton value="published" />
                <Text style={styles.radioButtonText}>
                  {Translate.t("nonPublished")}
                </Text>
                <RadioButton value="unpublished" />
              </RadioButton.Group>
            </View>
            <View style={styles.releaseDateContainer}>
              <Text style={styles.radioButtonText}>
                {Translate.t("publishedDate")} :
              </Text>
              <TextInput
                style={styles.releaseDateTextInput}
                value={publishDate}
                onChangeText={(value) => onPublishDateChanged(value)}
              ></TextInput>
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
                <Text style={styles.radioButtonText}>{Translate.t("new")}</Text>
                <RadioButton value="new" />
                <Text style={styles.radioButtonText}>
                  {Translate.t("secondHand")}
                </Text>
                <RadioButton value="secondHand" />
              </RadioButton.Group>
            </View>
            <Text style={styles.text}>{Translate.t("targetUser")}</Text>
            <View style={styles.radioGroupContainer}>
              <RadioButton.Group
                onValueChange={(newValue) => onTargetUserChanged(newValue)}
                value={targetUser}
              >
                <Text style={styles.radioButtonText}>
                  {Translate.t("allUser")}
                </Text>
                <RadioButton value="allUser" />
                <Text style={styles.radioButtonText}>
                  {Translate.t("generalUser")}
                </Text>
                <RadioButton value="generalUser" />
                <Text style={styles.radioButtonText}>
                  {Translate.t("storeUser")}
                </Text>
                <RadioButton value="storeUser" />
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
              }}
            >
              <View style={styles.productPricingContainer}>
                <TextInput
                  style={styles.productPricingTextInput}
                  value={price}
                  onChangeText={(value) => onPriceChanged(value)}
                ></TextInput>
                <Text style={styles.productPricingText}>
                  {Translate.t("generalPrice")} :
                </Text>
              </View>
              <View style={styles.productPricingContainer}>
                <TextInput
                  style={styles.productPricingTextInput}
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
                <TextInput
                  style={styles.productPricingTextInput}
                  value={shipping}
                  onChangeText={(value) => onShippingChanged(value)}
                ></TextInput>
                <Text style={styles.productPricingText}>
                  {Translate.t("shipping")} :
                </Text>
              </View>
            </View>
            <Text style={styles.text}>
              {Translate.t("productPageDisplayMethod")}
            </Text>
            <View style={styles.radioGroupContainer}>
              <RadioButton.Group
                onValueChange={(newValue) =>
                  onProductPageDisplayMethodChanged(newValue)
                }
                value={productPageDisplayMethod}
              >
                <Text style={styles.radioButtonText}>
                  {Translate.t("slidingType")}
                </Text>
                <RadioButton value="slidingType" />

                <Text style={styles.radioButtonText}>
                  {Translate.t("lrType")}
                </Text>
                <RadioButton value="lrType" />
              </RadioButton.Group>
            </View>
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
              <TouchableWithoutFeedback style={
                  {width: "100%",
                  height: heightPercentageToDP("30%"),
                  justifyContent: "center",
                  alignItems: "center"}
              } onPress={
                ()=>{
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
                          let html = []
                          tmpImages.map((image) => {
                            html.push(<View
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
                            </View>)
                          })
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
                              error.response.data[Object.keys(error.response.data)[0]][0]
                            );
                          }
                        });
                    }
                  });
                }
              }>
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
              </View>
            <Text style={styles.text}>{Translate.t("productDescription")}</Text>
            <TextInput
              style={styles.productDescriptionInput}
              multiline={true}
              value={productDescription}
              onChangeText={(value) => onProductDescriptionChanged(value)}
            ></TextInput>
          </View>
          <View style={styles.allButtonContainer}>
            <TouchableOpacity onPress={
              ()=>{
                createProduct(1);
              }
            }>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>
                  {Translate.t("saveDraft")}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={
              ()=>{
                createProduct(0);
              }
            }>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>{Translate.t("listing")}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    fontSize: RFValue(14),
    width: "100%",
    marginTop: heightPercentageToDP("1%"),
    marginBottom: heightPercentageToDP("2%"),
    padding: 10,
    paddingLeft: widthPercentageToDP("2%"),
  },
  text: {
    fontSize: RFValue(14),
    marginBottom: heightPercentageToDP("2%"),
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
    fontSize: RFValue(14),
    height: heightPercentageToDP("6%"),
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
    fontSize: RFValue(10),
    marginTop: heightPercentageToDP("1%"),
    color: "red",
  },
  buttonContainer: {
    backgroundColor: Colors.E6DADE,
    width: widthPercentageToDP("35%"),
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: heightPercentageToDP("8%"),
    padding: widthPercentageToDP("1.4%"),
  },
  buttonText: {
    fontSize: RFValue(18),
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
    fontSize: RFValue("14"),
    color: "white",
  },
  productPricingTextInput: {
    borderWidth: 0,
    backgroundColor: "white",
    fontSize: RFValue(14),
    width: widthPercentageToDP("60%"),
    height: heightPercentageToDP("6%"),
    marginLeft: widthPercentageToDP("2%"),
    marginTop: heightPercentageToDP("1%"),
    paddingLeft: widthPercentageToDP("2%"),
  },
  productPricingContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
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
    fontSize: RFValue(14),
    width: "100%",
    marginTop: heightPercentageToDP("1%"),
    paddingLeft: widthPercentageToDP("2%"),
  },
  productDescriptionInput: {
    borderWidth: 0,
    backgroundColor: "white",
    fontSize: RFValue(14),
    height: heightPercentageToDP("15%"),
    width: "100%",
    marginTop: heightPercentageToDP("1%"),
    paddingLeft: widthPercentageToDP("2%"),
  },
});
