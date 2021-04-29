import React, { useState } from "react";
import { InteractionManager } from 'react-native';
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
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
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
// let janCode;
// let stock;
// let items = [];
export default function ProductNoneVariations({
  props,
  pItems,
  onItemsChanged,
  type,
}) {
  const [invt, hideInvt] = useStateIfMounted(false);
  const [janCode, setJanCode] = useStateIfMounted("");
  const [curStock, setStock] = useStateIfMounted("0");
  const [editStock, setEditStock] = useStateIfMounted("");
  const [id, setId] = useStateIfMounted("");
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (pItems) {
        console.log('pItems', pItems);
        setStock(pItems.stock);
        setJanCode(pItems.janCode);
        setId(pItems.id);
        setEditStock(pItems.editStock);
        
        // if (pItems.editStock) {
        //   console.log(pItems.editStock)
        //   if(pItems.editStock != "+" && pItems.editStock != "-"){
        //     if(String(pItems.editStock).match(/[-|+]?[0-9]\d*(\.\d+)?/g)){
        //       setEditStock(String(pItems.editStock).match(/[-|+]?[0-9]\d*(\.\d+)?/g)[0]);
        //     } else {
        //       setEditStock("");
        //     }
        //   }
        // }
      } else {
        setJanCode("");
        setStock("0");
        setEditStock("");
      }
    });
  }, [pItems]);
  function handleStock(value) {
    if (onItemsChanged) {
      onItemsChanged({
        id: id,
        janCode: janCode,
        stock: value,
        editStock: editStock
      });
    }
  }
  function handleEditStock(value) {
    if (onItemsChanged) {
      onItemsChanged({
        id: id,
        janCode: janCode,
        stock: curStock,
        editStock: value
      });
    }
  }
  return (
    <SafeAreaView>
      {/*項目名*/}
      <View style={{ width: "100%" }}>
        <Text style={styles.text}>{Translate.t("janCode")}</Text>
        <TextInput
          style={styles.textInput}
          maxLength={13}
          value={janCode}
          onChangeText={(value) => {
            setJanCode(value);
            if (onItemsChanged) {
              onItemsChanged({
                id: id,
                janCode: value,
                stock: curStock,
                editStock: editStock
              });
            }
          }}
        ></TextInput>

        <Text style={styles.text}>{Translate.t("inStock")}</Text>
        <TextInput
          keyboardType={"numeric"}
          style={styles.textInput}
          value={curStock}
          onChangeText={(value) => {
            setStock(value);
            handleStock(value);
          }}
        ></TextInput>

        <View style={styles.line} />
      </View>
      {type == "newProduct" ? (
        <View></View>
      ) : (
        <View
          style={{
            width: widthPercentageToDP("89%"),
          }}
        >
          <View>
            <View style={styles.icon_title_wrapper}>
              <Text style={styles.text}>{Translate.t("stockEdit")}</Text>
              <TouchableOpacity onPress={() => hideInvt(!invt)}>
                {invt ? (
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

            <View style={invt ? styles.none : null}>
              <Text style={{ fontSize: RFValue(14) }}>
                {Translate.t("stockEditWarning")}
              </Text>
              <Text style={{ fontSize: RFValue(14), marginBottom: 20 }}>
                {Translate.t("stockEditDescription")}
              </Text>

              <View style={styles.variantContainer}>
                <TouchableOpacity>
                  <View
                    style={{
                      backgroundColor: Colors.deepGrey,
                      marginTop: heightPercentageToDP("2%"),
                      marginBottom: heightPercentageToDP("2%"),
                      marginLeft: widthPercentageToDP("2%"),
                      borderRadius: 5,
                      alignItems: "center",
                      padding: widthPercentageToDP("1%"),
                      alignSelf: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: RFValue("11"),
                        color: "#FFF",
                      }}
                    >
                      {Translate.t("stockRegister")}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TextInput 
                  style={styles.variantInput}
                  value={editStock}
                  onChangeText={(value) => {
                    if(String(value).match(/[+\-0-9]\d*(\.\d+)?/g)){
                      value = String(value).match(/[+\-0-9]\d*(\.\d+)?/g)[0];
                      setEditStock(value);
                      handleEditStock(value);
                    } else {
                      setEditStock("");
                      handleEditStock("");
                    }
                  }}
                ></TextInput>
                <Text style={styles.variantText}>
                  {Translate.t("inStock")} :
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.line} />
        </View>
      )}
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
    justifyContent: "center",
  },
  variantText: {
    fontSize: RFValue(9),
    marginTop: heightPercentageToDP("1%"),
  },
  variantInput: {
    borderWidth: 0,
    backgroundColor: "white",
    fontSize: RFValue(14),
    width: widthPercentageToDP("40%"),
    height: heightPercentageToDP("6%"),
    marginLeft: widthPercentageToDP("2%"),
    marginTop: heightPercentageToDP("1%"),
    paddingLeft: widthPercentageToDP("2%"),
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
    fontSize: RFValue(11),
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
