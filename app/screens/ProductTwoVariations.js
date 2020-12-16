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
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import { RadioButton } from "react-native-paper";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import DustBinIcon from "../assets/icons/dustbin.svg";
import ArrowDownIcon from "../assets/icons/arrow_down.svg";
import ArrowUpIcon from "../assets/icons/arrow_up.svg";
import _ from "lodash";
import CustomAlert from "../lib/alert";
const alert = new CustomAlert();
let items = [
  {
    index: 0,
    horizontalItem: "",
    choices: [
      {
        choiceIndex: 1,
        choiceItem: "",
        janCode: "",
        stock: "",
      },
    ],
  },
  {
    index: 1,
    horizontalItem: "",
    choices: [
      {
        choiceIndex: 1,
        choiceItem: "",
        janCode: "",
        stock: "",
      },
    ],
  },
];
let globalMappingValue = {};
export default function ProductTwoVariations({
  props,
  pItems,
  onItemsChanged,
}) {
  const [invt, hideInvt] = React.useState(false);
  const [choice, onChoiceChanged] = React.useState("");
  const [horizontalAxis, onHorizontalAxisChanged] = React.useState("");
  const [janCode, onJanCodeChanged] = React.useState("");
  const [stock, onStockChanged] = React.useState("");
  const [itemName, onItemNameChanged] = React.useState("");
  const [variationHtml, onProcessVariationHtml] = React.useState(<View></View>);
  const [horizontalName, onHorizontalNameChanged] = React.useState();
  const [loaded, onLoaded] = React.useState(false);
  const [variationDetailsHtml, onProcessVariationDetailsHtml] = React.useState(
    <View></View>
  );

  React.useEffect(() => {
    if (pItems && pItems.mappingValue && pItems.items) {
      globalMappingValue = pItems.mappingValue;
      items = pItems.items;
      onProcessVariationHtml(processVariationHtml(items));
      onProcessVariationDetailsHtml(processDetailsVariationHtml(items));
    } else {
      globalMappingValue = {};
      items = [
        {
          index: 0,
          horizontalItem: "",
          choices: [
            {
              choiceIndex: 1,
              choiceItem: "",
              janCode: "",
              stock: "",
            },
          ],
        },
        {
          index: 1,
          horizontalItem: "",
          choices: [
            {
              choiceIndex: 1,
              choiceItem: "",
              janCode: "",
              stock: "",
            },
          ],
        },
      ];
      onProcessVariationHtml(processVariationHtml(items));
      onProcessVariationDetailsHtml(processDetailsVariationHtml(items));
    }
  }, [pItems]);

  function populateMapping() {
    mappingValue = globalMappingValue;
    items[0].choices.map((choice1) => {
      if (choice1) {
        items[1].choices.map((choice2) => {
          if (choice2) {
            if (mappingValue[choice1.choiceItem]) {
              if (!mappingValue[choice1.choiceItem][choice2.choiceItem]) {
                mappingValue[choice1.choiceItem][choice2.choiceItem] = {
                  stock: 0,
                  janCode: "",
                };
              }
            } else {
              mappingValue[choice1.choiceItem] = {};
              mappingValue[choice1.choiceItem][choice2.choiceItem] = {
                stock: 0,
                janCode: "",
              };
            }
          }
        });
      }
    });
    globalMappingValue = mappingValue;
    if (onItemsChanged) {
      onItemsChanged({
        items: items,
        mappingValue: globalMappingValue,
      });
    }
  }
  function addNewChoice(index, choiceIndex) {
    let choiceObj = {
      choiceIndex: choiceIndex + 1,
      choiceItem: "",
    };

    items.map((product) => {
      if (index == product.index) {
        let tmpChoices = product.choices.filter((item) => {
          return !item.choiceItem;
        });
        if (tmpChoices.length == 0) {
          product.choices.push(choiceObj);
        } else {
          alert.warning("Please fill in the choice.");
        }
      }
      return product;
    });

    populateMapping();
    onProcessVariationHtml(processVariationHtml(items));
    onLoaded(true);
  }
  function deleteChoice(index, choiceIndex) {
    items.map((product) => {
      if (index == product.index) {
        product.choices = product.choices.filter((choice) => {
          return choice.choiceItem != choiceIndex;
        });

        let choices = [];

        product.choices.map((choice) => {
          choice["choiceIndex"] = choices.length + 1;
          choices.push(choice);
        });

        product.choices = choices;
        if(product.choices.length == 0){
          product.choices.push({
            choiceIndex: 1,
            choiceItem: "",
            janCode: "",
            stock: "",
          })
        }
      }
      return product;
    });

    populateMapping();
    onProcessVariationHtml(processVariationHtml(items));
    onLoaded(true);
  }
  function processChoiceHtml(index, choices) {
    let tmpChoiceHtml = [];
    choices.map((choice) => {
      tmpChoiceHtml.push(
        <View style={styles.multiVariant} key={choice.choiceIndex}>
          <View
            style={{
              height: "100%",
              marginHorizontal: widthPercentageToDP("1%"),
              flexDirection: "row",
              alignItems: "flex-end",
              position: "absolute",
              bottom: 0,
              left: 0,
              marginBottom: RFValue("12"),
            }}
          >
            <TouchableOpacity
              onPress={() => addNewChoice(index, choice.choiceIndex)}
            >
              <View
                style={
                  choice.choiceIndex == choices.length
                    ? styles.addNewChoice
                    : styles.none
                }
                // style={styles.addNewChoice}
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
          <View
            style={{
              flex: 1,
              padding: widthPercentageToDP("1%"),
            }}
          >
            <View style={styles.subMultiVariant}>
              <Text style={styles.text}>{choice.choiceIndex}</Text>
              <TextInput
                style={styles.textInput}
                value={choice.choiceItem}
                onChangeText={(value) =>
                  onValueChanged(value, "choice", index, choice.choiceIndex)
                }
              ></TextInput>
            </View>
          </View>
          <View>
            <TouchableWithoutFeedback
              onPress={() => {
                deleteChoice(index, choice.choiceItem);
              }}
            >
              <View
                style={[
                  styles.variantContainer,
                  { paddingBottom: heightPercentageToDP("1.5%") },
                ]}
              >
                <DustBinIcon style={styles.widget_icon} resizeMode="contain" />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      );
    });
    return tmpChoiceHtml;
  }
  function processVariationHtml(items) {
    onHorizontalNameChanged(items[0].horizontalItem)
    let tmpVariationHtml = [];
    items.map((product) => {
      tmpVariationHtml.push(
        <View style={{ width: "100%" }} key={product.index}>
          <View style={styles.subframe}>
            <Text style={styles.text}>
              {tmpVariationHtml.length == 0
                ? Translate.t("horizonItemName")
                : Translate.t("verticalItemName")}
            </Text>
            <TextInput
              style={styles.textInput}
              value={product.horizontalItem}
              onChangeText={(value) =>
                onValueChanged(value, "horizontalItem", product.index)
              }
            ></TextInput>
            <Text style={styles.text_choice}>{Translate.t("choice")}</Text>
            {processChoiceHtml(product.index, product.choices)}
          </View>
          <View style={styles.line} />
        </View>
      );
    });
    return tmpVariationHtml;
  }
  function onValueChanged(value, type, index, choiceIndex) {
    items = items.map((product) => {
      if (index == product.index) {
        if (type == "horizontalItem") {
          product.horizontalItem = value;
        }
        product.choices.map((choices) => {
          if (type == "choice") {
            if (choices.choiceIndex == choiceIndex) {
              choices.choiceItem = value;
            }
          } else if (type == "stock") {
            if (choices.choiceIndex == choiceIndex) {
              choices.stock = value;
            }
          } else if (type == "janCode") {
            if (choices.choiceIndex == choiceIndex) {
              choices.janCode = value;
            }
          }
          return choices;
        });
      }
      return product;
    });
    populateMapping();
    onProcessVariationHtml(processVariationHtml(items));
    onProcessVariationDetailsHtml(processDetailsVariationHtml(items));
  }
  function processDetailsVariationHtml(items) {
    let tmpVariationDetailsHtml = [];
    items[0].choices.map((choice) => {
      if (choice.choiceItem) {
        tmpVariationDetailsHtml.push(
          <View style={{ width: "100%" }} key={choice.choiceIndex}>
            <View style={styles.icon_title_wrapper}>
              <Text style={styles.variantName}>{choice.choiceItem}</Text>
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
            {populateChoiceDetailsHtml(choice.choiceItem, items[1].choices)}
            <View style={styles.line} />
          </View>
        );
      }
    });
    return tmpVariationDetailsHtml;
  }
  function populateChoiceDetailsHtml(choice1Item, choices) {
    let tmpChoiceDetailsHtml = [];
    choices.map((choice) => {
      let isDelete =
        globalMappingValue[choice1Item][choice.choiceItem]["delete"];
      tmpChoiceDetailsHtml.push(
        <View style={{}}>
          <View style={styles.subline} />
          <View
            style={{
              opacity: isDelete ? 0.3 : 1,
            }}
          >
            <View style={styles.variantContainer}>
              <Text style={styles.colorText}>{choice.choiceItem}</Text>
              {/* onValueChanged(value, "choice", index, choice.choiceIndex) */}
              <TextInput
                style={styles.variantStockInput}
                editable={!isDelete}
                value={
                  globalMappingValue[choice1Item] &&
                  globalMappingValue[choice1Item][choice.choiceItem]
                    ? globalMappingValue[choice1Item][choice.choiceItem][
                        "stock"
                      ]
                    : ""
                }
                onChangeText={(value) => {
                  globalMappingValue[choice1Item][choice.choiceItem][
                    "stock"
                  ] = value;
                  onProcessVariationHtml(processVariationHtml(items));
                  onProcessVariationDetailsHtml(
                    processDetailsVariationHtml(items)
                  );
                }}
              ></TextInput>
              <Text style={styles.variantText}>{Translate.t("inStock")} :</Text>
            </View>
            <View style={styles.variantContainer}>
              <TextInput
                maxLength={13}
                style={styles.variantInput}
                editable={!isDelete}
                value={
                  globalMappingValue[choice1Item] &&
                  globalMappingValue[choice1Item][choice.choiceItem]
                    ? globalMappingValue[choice1Item][choice.choiceItem][
                        "janCode"
                      ]
                    : ""
                }
                onChangeText={(value) => {
                  globalMappingValue[choice1Item][choice.choiceItem][
                    "janCode"
                  ] = value;
                  onProcessVariationHtml(processVariationHtml(items));
                  onProcessVariationDetailsHtml(
                    processDetailsVariationHtml(items)
                  );
                }}
              ></TextInput>
              <Text style={styles.variantText}>{Translate.t("janCode")} :</Text>
            </View>
          </View>
        </View>
      );
    });

    return tmpChoiceDetailsHtml;
  }
  function deleteProduct(index, choiceIndex) {
    items = items.map((item) => {
      if (item.index == index) {
        choices = item.choices.filter((choice) => {
          return choice.choiceIndex != choiceIndex;
        });
      }
      return item;
    });
    onProcessVariationHtml(processVariationHtml(items));
    onProcessVariationDetailsHtml(processDetailsVariationHtml(items));
  }
  if (!loaded) {
    onProcessVariationHtml(processVariationHtml(items));
    onProcessVariationDetailsHtml(processDetailsVariationHtml(items));
    onLoaded(true);
  }

  return (
    <SafeAreaView>
      {/*項目名*/}
      {variationHtml}
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
        <Text style={{ color: "#FFF", fontSize: RFValue(14) }}>
          {horizontalName}
        </Text>
      </View>

      {variationDetailsHtml}

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
            {"在庫登録"}
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
    height: RFValue(16),
    width: RFValue(16),
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
  text_choice: {
    fontSize: RFValue(14),
    marginBottom: heightPercentageToDP("2%"),
    paddingRight: widthPercentageToDP("2%"),
    paddingLeft: RFValue("12") * 4,
  },
  multiVariant: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    paddingLeft: RFValue("12") * 4,
  },
  subMultiVariant: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
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
  colorText: {
    position: "absolute",
    left: 300,
    fontSize: RFValue(9),
    marginTop: heightPercentageToDP("1%"),
  },
  variantInput: {
    borderWidth: 0,
    backgroundColor: "white",
    fontSize: RFValue(10),
    height: heightPercentageToDP("5%"),
    alignSelf: "center",
    width: widthPercentageToDP("60%"),
    // height: heightPercentageToDP("6%"),
    // backgroundColor: "orange",
    marginLeft: widthPercentageToDP("2%"),
    marginTop: heightPercentageToDP("1%"),
    paddingLeft: widthPercentageToDP("2%"),
    // backgroundColor: "orange",
  },
  variantStockInput: {
    borderWidth: 0,
    alignSelf: "center",
    backgroundColor: "white",
    fontSize: RFValue(10),
    width: widthPercentageToDP("30%"),
    height: heightPercentageToDP("5%"),
    marginLeft: widthPercentageToDP("2%"),
    marginTop: heightPercentageToDP("1%"),
    paddingLeft: widthPercentageToDP("2%"),
    // backgroundColor: "orange",
  },
  subframe: {
    borderWidth: 1,
    borderColor: "#BD9848",
    marginTop: heightPercentageToDP("2%"),
    width: "100%",
    padding: 6,
    marginLeft: -3,
  },
  textInput: {
    borderWidth: 0,
    backgroundColor: "white",
    fontSize: RFValue(14),
    width: "100%",
    height: heightPercentageToDP("6%"),
    marginTop: heightPercentageToDP("1%"),
    marginBottom: heightPercentageToDP("2%"),
    padding: 10,
    paddingLeft: widthPercentageToDP("2%"),
    // backgroundColor: "orange",
  },
  text: {
    fontSize: RFValue(14),
    marginBottom: heightPercentageToDP("2%"),
    paddingRight: widthPercentageToDP("2%"),
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
  addNewChoice: {
    backgroundColor: Colors.deepGrey,
    marginTop: heightPercentageToDP("2%"),
    marginBottom: heightPercentageToDP("2%"),
    borderRadius: 5,
    alignItems: "center",
    padding: widthPercentageToDP("1%"),
    alignSelf: "flex-start",
  },
});
