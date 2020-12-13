import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import { RadioButton } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import CustomAlert from "../lib/alert";
const alert = new CustomAlert();
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";

import DustBinIcon from "../assets/icons/dustbin.svg";
import ArrowDownIcon from "../assets/icons/arrow_down.svg";
import ArrowUpIcon from "../assets/icons/arrow_up.svg";
let items = [];
export default function ProductOneVariations({
  props,
  pItems,
  onItemsChanged,
}) {
  const isFocused = useIsFocused();
  const [item, hideItem] = React.useState(false);
  const [invt, hideInvt] = React.useState(false);
  const [choice, onChoiceChanged] = React.useState("");
  const [janCode, onJanCodeChanged] = React.useState(123456789);
  const [stock, onStockChanged] = React.useState(1);
  const [itemName, onItemNameChanged] = React.useState("");
  const [id, onIdChanged] = React.useState("");
  const [variationHtml, onProcessVariationHtml] = React.useState(<View></View>);
  const [variationDetailsHtml, onProcessSVariationDetailsHtml] = React.useState(
    <View></View>
  );
  const [loaded, onLoaded] = React.useState(false);
  const [currentVariationCount, onCurrentVariationCount] = React.useState(1);

  React.useEffect(() => {
    if (pItems && pItems.name) {
      onItemNameChanged(pItems.name);
      onIdChanged(pItems.id);
    }

    if (pItems && pItems.id) {
      onItemNameChanged(pItems.name);
    }

    if (pItems && pItems.items) {
      items = pItems.items;
      onProcessVariationHtml(processVariationHtml(items));
      onProcessSVariationDetailsHtml(processVariationDetailsHtml(items));
    } else {
      items = [];
      items.push({
        index: items.length,
        choice: "",
        stock: 0,
        janCode: "",
      });
      onProcessVariationHtml(processVariationHtml(items));
      onProcessSVariationDetailsHtml(processVariationDetailsHtml(items));
    }
  }, [pItems]);

  function onUpdate() {
    let tmpItems = items.filter((item) => {
      return !item.choice;
    });

    if (tmpItems.length == 0) {
      items.push({
        index: items.length,
        choice: "",
        stock: 0,
        janCode: "",
      });
      onItemsChanged({
        id: id,
        name: itemName,
        items: items,
      });
      onChoiceChanged("");
      onProcessVariationHtml(processVariationHtml(items));
      onProcessSVariationDetailsHtml(processVariationDetailsHtml(items));
      onLoaded(true);
    } else {
      alert.warning("Please fill in the choice.");
    }
  }
  function onProcess(items) {
    items = items.filter((item) => {
      return !item.delete;
    })
    onProcessVariationHtml(processVariationHtml(items));
    onProcessSVariationDetailsHtml(processVariationDetailsHtml(items));
  }
  function processVariationDetailsHtml(items) {
    let tmpVariationDetailsHtml = [];
    items.map((product) => {
      if (product.choice) {
        tmpVariationDetailsHtml.push(
          <View style={{ width: "100%" }} key={product.index}>
            <View
              style={{
                opacity: product.delete ? 0.3 : 1,
              }}
            >
              <View style={styles.icon_title_wrapper}>
                <Text style={styles.variantName}>{product.choice}</Text>
                <TouchableOpacity>
                  {false ? (
                    <ArrowDownIcon
                      style={styles.widget_icon}
                      resizeMode="contain"
                    />
                  ) : (
                    <ArrowUpIcon
                      style={styles.widget_icon}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={false ? styles.none : null}>
                <View style={styles.subline} />
                <View style={styles.variantContainer}>
                  <TextInput
                    style={styles.variantInput}
                    value={product.stock}
                    onChangeText={(value) =>
                      onValueChanged(value, "stock", product.index)
                    }
                  ></TextInput>
                  <Text style={styles.variantText}>
                    {Translate.t("inStock")} :
                  </Text>
                </View>
                <View style={styles.variantContainer}>
                  <TextInput
                    maxLength={13}
                    style={styles.variantInput}
                    value={product.janCode}
                    onChangeText={(value) =>
                      onValueChanged(value, "jancode", product.index)
                    }
                  ></TextInput>
                  <Text style={styles.variantText}>
                    {Translate.t("janCode")} :
                  </Text>
                </View>
              </View>
            </View>

            {!product.delete ? (
              <TouchableWithoutFeedback
                onPress={() => {
                  onValueChanged(true, "delete", product.index);
                }}
              >
                <View
                  style={[
                    styles.variantContainer,
                    { paddingBottom: heightPercentageToDP("1.5%") },
                  ]}
                >
                  <Text style={styles.variantText}>
                    {Translate.t("delete")}
                  </Text>
                  <DustBinIcon
                    style={styles.widget_icon}
                    resizeMode="contain"
                  />
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback
                onPress={() => {
                  onValueChanged(false, "delete", product.index);
                }}
              >
                <View
                  style={[
                    styles.variantContainer,
                    { paddingBottom: heightPercentageToDP("1.5%") },
                  ]}
                >
                  <Text style={styles.variantText}>Show</Text>
                  <DustBinIcon
                    style={styles.widget_icon}
                    resizeMode="contain"
                  />
                </View>
              </TouchableWithoutFeedback>
            )}
            <View style={styles.line} />
          </View>
        );
      }
    });
    return tmpVariationDetailsHtml;
  }
  function deleteProduct(index) {
    items = items.filter((product) => {
      return product.index != index;
    });
    onProcessVariationHtml(items);
    onProcessSVariationDetailsHtml(items);
  }
  function onValueChanged(value, type, index) {
    items = items.map((product) => {
      if (product.index == index) {
        if (type == "jancode") {
          product.janCode = value;
        }
        if (type == "stock") {
          product.stock = value;
        }
        if (type == "choice") {
          product.choice = value;
        }
        if (type == "delete") {
          product.delete = value;
        }
      }
      return product;
    });
    onProcess(items);
  }
  function processVariationHtml(items) {
    let tmpVariationHtml = [];
    items.map((product) => {
      tmpVariationHtml.push(
        <View style={styles.subframe} key={product.index}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: RFValue(14) }}>{product.index + 1}</Text>
            <Text>{"  "}</Text>
            <Text style={styles.text}>{Translate.t("choice")}</Text>
          </View>
          <TextInput
            style={styles.textInput}
            value={product.choice}
            onChangeText={(value) =>
              onValueChanged(value, "choice", product.index)
            }
          ></TextInput>
        </View>
      );
      onCurrentVariationCount(currentVariationCount + 1);
    });
    return tmpVariationHtml;
  }

  React.useEffect(() => {}, [isFocused]);

  return (
    <SafeAreaView>
      {/*項目名*/}
      <View style={{ width: "100%" }}>
        <View style={styles.icon_title_wrapper}>
          <Text style={styles.text}>{Translate.t("itemName")}</Text>
          <TouchableOpacity onPress={() => hideItem(!item)}>
            {item ? (
              <ArrowDownIcon style={styles.widget_icon} resizeMode="contain" />
            ) : (
              <ArrowUpIcon style={styles.widget_icon} resizeMode="contain" />
            )}
          </TouchableOpacity>
        </View>
        <View style={item ? styles.none : null}>
          <TextInput
            style={styles.textInput}
            value={itemName}
            onChangeText={(value) => {
              onItemNameChanged(value);
              onItemsChanged({
                id: id,
                name: value,
                items: items,
              });
            }}
          ></TextInput>
          <ScrollView>
            <View
              style={{ flex: 1, marginHorizontal: widthPercentageToDP("1%") }}
            >
              {variationHtml}
            </View>
          </ScrollView>
          <TouchableOpacity onPress={() => onUpdate()}>
            <View
              style={{
                backgroundColor: Colors.deepGrey,
                marginTop: heightPercentageToDP("2%"),
                marginBottom: heightPercentageToDP("2%"),
                borderRadius: 5,
                alignItems: "center",
                padding: widthPercentageToDP("1%"),
                alignSelf: "flex-start",
              }}
            >
              <Text
                style={{
                  fontSize: RFValue("12"),
                  color: "#FFF",
                }}
              >
                +{Translate.t("add")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.line} />
      </View>

      <View style={{ width: "100%" }}>
        {/*在庫*/}
        <View style={styles.icon_title_wrapper}>
          <Text style={styles.text}>{Translate.t("stockEdit")}</Text>
          <TouchableOpacity onPress={() => hideInvt(!invt)}>
            {invt ? (
              <ArrowDownIcon style={styles.widget_icon} resizeMode="contain" />
            ) : (
              <ArrowUpIcon style={styles.widget_icon} resizeMode="contain" />
            )}
          </TouchableOpacity>
        </View>
        <View style={invt ? styles.none : null}>
          <Text style={{ fontSize: RFValue(14) }}>
            {Translate.t("stockEditWarning")}
          </Text>
          <Text style={{ fontSize: RFValue(14), marginBottom: 20 }}>
            {Translate.t("stockEditDescription")}
          </Text>
        </View>
      </View>

      <View style={styles.variantTitle}>
        <Text style={{ color: "#FFF", fontSize: RFValue(14) }}>{itemName}</Text>
      </View>

      <View style={{ width: "100%" }}>{variationDetailsHtml}</View>

      <TouchableOpacity>
        <View
          style={{
            backgroundColor: Colors.deepGrey,
            marginTop: heightPercentageToDP("2%"),
            marginBottom: heightPercentageToDP("2%"),
            borderRadius: 5,
            alignItems: "center",
            padding: widthPercentageToDP("1%"),
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontSize: RFValue("12"),
              color: "#FFF",
            }}
          >
            {Translate.t("stockRegister")}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.line} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  none: {
    display: "none",
  },
  icon_title_wrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  widget_icon: {
    height: RFValue(14),
    width: RFValue(14),
    marginTop: heightPercentageToDP("1%"),
    marginHorizontal: 10,
  },
  line: {
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#BD9848",
    width: widthPercentageToDP("94%"),
    marginHorizontal: widthPercentageToDP("-4%"),
  },
  subline: {
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#BD9848",
    width: widthPercentageToDP("90%"),
    marginRight: widthPercentageToDP("-4%"),
  },
  variantTitle: {
    marginTop: 5,
    marginBottom: 5,
    paddingVertical: heightPercentageToDP("2%"),
    paddingHorizontal: widthPercentageToDP("4%"),
    backgroundColor: "#BD9848",
    width: widthPercentageToDP("94%"),
    marginHorizontal: widthPercentageToDP("-4%"),
  },
  variantName: {
    fontSize: RFValue(14),
    marginTop: heightPercentageToDP("1%"),
    marginBottom: heightPercentageToDP("1%"),
  },
  variantContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  variantText: {
    fontSize: RFValue(9),
    marginTop: heightPercentageToDP("1%"),
  },
  variantInput: {
    borderWidth: 0,
    backgroundColor: "white",
    fontSize: RFValue(14),
    width: widthPercentageToDP("60%"),
    height: heightPercentageToDP("6%"),
    marginLeft: widthPercentageToDP("2%"),
    marginTop: heightPercentageToDP("1%"),
    paddingLeft: widthPercentageToDP("2%"),
  },
  subframe: {
    borderWidth: 1,
    // width: widthPercentageToDP("50%"),
    borderColor: "#BD9848",
    flex: 1,
    // width: widthPercentageToDP("85%"),
    padding: 10,
    // alignSelf: "center",
    marginTop: heightPercentageToDP("2%"),
    padding: 6,
    marginLeft: -3,
  },
  textInput: {
    color: "black",
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
});
