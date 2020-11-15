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
import { RadioButton } from "react-native-paper";
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

import { ScrollView, TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const request = new Request();
const alert = new CustomAlert();

const win = Dimensions.get("window");
const ratioProductAddIcon = win.width / 10 / 28;
export default function ProductInformationAdd(props) {
  const [user, onUserChanged] = React.useState({});

  const [variant, setVariant] = React.useState("one");

  return (
    <SafeAreaView>
      <CustomHeader
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        text={Translate.t("productInformation")}
        onBack={() => props.navigation.pop()}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
      />
      <CustomSecondaryHeader
        name={user.real_name ? user.real_name : user.nickname}
        accountType={""}
      />
      <View style={{ height: height - heightPercentageToDP("20%")}}>
        <ScrollView>
          <View style={styles.formContainer}>
            <Text style={styles.text}>{Translate.t("productName")}</Text>
            <TextInput style={styles.textInput}></TextInput>

            <Text style={styles.text}>{Translate.t("brandName")}</Text>
            <TextInput style={styles.textInput}></TextInput>

            <Text style={styles.text}>{Translate.t("prStatement")}</Text>
            <TextInput
              multiline={true}
              numberOfLines={4}
              style={styles.textInput}
            ></TextInput>

            <Text style={styles.text}>{Translate.t("productIDURL")}</Text>
            <TextInput style={styles.textInput}></TextInput>

            <Text style={styles.text}>{Translate.t("productCategory")}</Text>
            <TextInput style={styles.textInput}></TextInput>

            <Text style={styles.text}>{Translate.t("variation")}</Text>
            <View style={styles.radioGroupContainer}>
              <RadioButton.Group
                style={{ alignItems: "flex-start" }}
                onValueChange={(variant) => setVariant(variant)}
                value={variant}
              >
                <View style={styles.radionButtonLabel}>
                  <RadioButton
                    value="one"
                    uncheckedColor="#FFF"
                    color="#BD9848"
                  />
                  <Text style={styles.radioButtonText}>{"1 "}{Translate.t("item")}</Text>
                </View>
                <View style={styles.radionButtonLabel}>
                  <RadioButton
                    value="two"
                    uncheckedColor="#FFF"
                    color="#BD9848"
                  />
                  <Text style={styles.radioButtonText}>{"2 "}{Translate.t("item")}</Text>
                </View>
                <View style={styles.radionButtonLabel}>
                  <RadioButton
                    value="none"
                    uncheckedColor="#FFF"
                    color="#BD9848"
                  />
                  <Text style={styles.radioButtonText}>{Translate.t("none")}</Text>
                </View>
              </RadioButton.Group>
            </View>

            <View style={styles.line} />

            {/*1 項目*/}
            <View style={variant !== "one" ? styles.none : null}>
              <ProductOneVariations />
            </View>
            <View style={variant !== "two" ? styles.none : null}>
              <ProductTwoVariations />
            </View>
            <View style={variant !== "none" ? styles.none : null}>
              <ProductNoneVariations />
            </View>

            <Text style={styles.text}>{Translate.t("publishState")}</Text>
            <View style={styles.radioGroupContainer}>
              <RadioButton.Group>
                <Text style={styles.radioButtonText}>
                  {Translate.t("published")}
                </Text>
                <RadioButton />
                <Text style={styles.radioButtonText}>
                  {Translate.t("nonPublished")}
                </Text>
                <RadioButton />
              </RadioButton.Group>
            </View>
            <View style={styles.releaseDateContainer}>
              <Text style={styles.radioButtonText}>
                {Translate.t("publishedDate")} :
              </Text>
              <TextInput style={styles.releaseDateTextInput}></TextInput>
            </View>
            <Text style={styles.releaseDateWarningText}>
              {Translate.t("publishWarning")}
            </Text>
            <Text style={styles.text}>{Translate.t("productStatus")}</Text>
            <View style={styles.radioGroupContainer}>
              <RadioButton.Group>
                <Text style={styles.radioButtonText}>{Translate.t("new")}</Text>
                <RadioButton />
                <Text style={styles.radioButtonText}>
                  {Translate.t("secondHand")}
                </Text>
                <RadioButton />
              </RadioButton.Group>
            </View>
            <Text style={styles.text}>{Translate.t("targetUser")}</Text>
            <View style={styles.radioGroupContainer}>
              <RadioButton.Group>
                <Text style={styles.radioButtonText}>
                  {Translate.t("allUser")}
                </Text>
                <RadioButton />
                <Text style={styles.radioButtonText}>
                  {Translate.t("generalUser")}
                </Text>
                <RadioButton />
                <Text style={styles.radioButtonText}>
                  {Translate.t("storeUser")}
                </Text>
                <RadioButton />
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
                <TextInput style={styles.productPricingTextInput}></TextInput>
                <Text style={styles.productPricingText}>
                  {Translate.t("generalPrice")} :
                </Text>
              </View>
              <View style={styles.productPricingContainer}>
                <TextInput style={styles.productPricingTextInput}></TextInput>
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
                <TextInput style={styles.productPricingTextInput}></TextInput>
                <Text style={styles.productPricingText}>
                  {Translate.t("shipping")} :
                </Text>
              </View>
            </View>
            <Text style={styles.text}>
              {Translate.t("productPageDisplayMethod")}
            </Text>
            <View style={styles.radioGroupContainer}>
              <RadioButton.Group>
                <Text style={styles.radioButtonText}>
                  {Translate.t("slidingType")}
                </Text>
                <RadioButton />

                <Text style={styles.radioButtonText}>
                  {Translate.t("lrType")}
                </Text>
                <RadioButton />
              </RadioButton.Group>
            </View>
            <Text style={styles.text}>{Translate.t("productImage")}</Text>
            <View
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
            </View>
            <View
              style={{
                width: "100%",
                alignItems: "flex-end",
                marginTop: heightPercentageToDP("2%"),
              }}
            >
              <TouchableOpacity>
                <View
                  style={{
                    backgroundColor: Colors.deepGrey,
                    width: widthPercentageToDP("25%"),
                    borderRadius: 5,
                    alignItems: "center",
                    padding: widthPercentageToDP("2%"),
                  }}
                >
                  <Text style={styles.addProductButtonText}>
                    +{Translate.t("add")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>{Translate.t("productDescription")}</Text>
            <TextInput
              style={styles.productDescriptionInput}
              multiline={true}
            ></TextInput>
          </View>
          <View style={styles.allButtonContainer}>
            <TouchableOpacity>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>
                  {Translate.t("saveDraft")}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
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
    marginBottom:heightPercentageToDP("5%")
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
