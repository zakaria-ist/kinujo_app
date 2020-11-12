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
import { ScrollView, TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";

import DustBinIcon from "../assets/icons/dustbin.svg";
import ArrowDownIcon from "../assets/icons/arrow_down.svg";
import ArrowUpIcon from "../assets/icons/arrow_up.svg";

export default function ProductTwoVariations({ props }) {
  const [invt, hideInvt] = React.useState(false);

  return (
    <SafeAreaView>
      {/*項目名*/}
      <View style={{ width: "100%" }}>
        <View style={styles.subframe}>
          <Text style={styles.text}>{"横軸項目名"}</Text>
          <TextInput style={styles.textInput}></TextInput>

          <View style={styles.multiVariant}>
            <View
              style={{
                height: "100%",
                marginHorizontal: widthPercentageToDP("1%"),
                flexDirection: "row",
                alignItems: "flex-end",
              }}
            >
              <TouchableOpacity>
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
                    +{"追加"}
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
              <Text style={styles.text}>{"選択肢"}</Text>

              <View style={styles.multiVariant}>
                <Text style={styles.text}>{"1"}</Text>
                <TextInput style={styles.textInput}></TextInput>
              </View>

              <View style={styles.multiVariant}>
                <Text style={styles.text}>{"2"}</Text>
                <TextInput style={styles.textInput}></TextInput>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.subframe}>
          <Text style={styles.text}>{"横軸項目名"}</Text>
          <TextInput style={styles.textInput}></TextInput>

          <View style={styles.multiVariant}>
            <View
              style={{
                height: "100%",
                marginHorizontal: widthPercentageToDP("1%"),
                flexDirection: "row",
                alignItems: "flex-end",
              }}
            >
              <TouchableOpacity>
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
                    +{"追加"}
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
              <Text style={styles.text}>{"選択肢"}</Text>

              <View style={styles.multiVariant}>
                <Text style={styles.text}>{"1"}</Text>
                <TextInput style={styles.textInput}></TextInput>
              </View>

              <View style={styles.multiVariant}>
                <Text style={styles.text}>{"2"}</Text>
                <TextInput style={styles.textInput}></TextInput>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.line} />
      </View>

      <View style={{ width: "100%" }}>
        {/*在庫*/}
        <View style={styles.icon_title_wrapper}>
          <Text style={styles.text}>{"在庫編集"}</Text>
          <TouchableOpacity
            onPress={() => hideInvt(!invt)}>
            {invt ? <ArrowDownIcon
              style={styles.widget_icon}
              resizeMode="contain"/> :
              <ArrowUpIcon
                style={styles.widget_icon}
                resizeMode="contain"/>
            }
          </TouchableOpacity>
        </View>
        <View style={invt ? styles.none : null}>
          <Text style={{ fontSize: RFValue(14) }}>
            {"在庫数は編集中にも変動します。"}
          </Text>
          <Text style={{ fontSize: RFValue(14), marginBottom: 20 }}>
            {
              "変更する場合は増減を「+1」「-1」などの絶対値で入力してください(在庫数全体を変更する場合は、数値で「100」などと入力してください)在庫数欄が空欄の場合は、在庫数は変更されません。"
            }
          </Text>
        </View>
      </View>

      <View style={styles.variantTitle}>
        <Text style={{ color: "#FFF", fontSize: RFValue(14) }}>{"サイズ"}</Text>
      </View>

      <View style={{ width: "100%" }}>
        <View style={styles.icon_title_wrapper}>
          <Text style={styles.variantName}>{"XS"}</Text>
          <TouchableOpacity>
            {false ? <ArrowDownIcon
              style={styles.widget_icon}
              resizeMode="contain"/> :
              <ArrowUpIcon
                style={styles.widget_icon}
                resizeMode="contain"/>
            }
          </TouchableOpacity>
        </View>
        <View style={false ? styles.none : null}>
          <View style={styles.subline} />
          <View style={styles.variantContainer}>
            <TextInput style={styles.variantInput}></TextInput>
            <Text style={styles.variantText}>{"在庫"} :</Text>
          </View>
          <View style={styles.variantContainer}>
            <TextInput style={styles.variantInput}></TextInput>
            <Text style={styles.variantText}>{"JANコード"} :</Text>
          </View>
          <View
            style={[
              styles.variantContainer,
              { paddingBottom: heightPercentageToDP("1.5%") },
            ]}
          >
            <Text style={styles.variantText}>{"削除"}</Text>
            <DustBinIcon
              style={styles.widget_icon}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.line} />
      </View>

      <View style={{ width: "100%" }}>
        <View style={styles.icon_title_wrapper}>
          <Text style={styles.variantName}>{"S"}</Text>
          <TouchableOpacity>
            {false ? <ArrowDownIcon
              style={styles.widget_icon}
              resizeMode="contain"/> :
              <ArrowUpIcon
                style={styles.widget_icon}
                resizeMode="contain"/>
            }
          </TouchableOpacity>
        </View>
        <View style={false ? styles.none : null}>
          <View style={styles.subline} />
          <View style={styles.variantContainer}>
            <TextInput style={styles.variantInput}></TextInput>
            <Text style={styles.variantText}>{"在庫"} :</Text>
          </View>
          <View style={styles.variantContainer}>
            <TextInput style={styles.variantInput}></TextInput>
            <Text style={styles.variantText}>{"JANコード"} :</Text>
          </View>
          <View
            style={[
              styles.variantContainer,
              { paddingBottom: heightPercentageToDP("1.5%") },
            ]}
          >
            <Text style={styles.variantText}>{"削除"}</Text>
            <DustBinIcon
              style={styles.widget_icon}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.line} />
      </View>

      <View style={{ width: "100%" }}>
        <View style={styles.icon_title_wrapper}>
          <Text style={styles.variantName}>{"M"}</Text>
          <TouchableOpacity>
            {true ? <ArrowDownIcon
              style={styles.widget_icon}
              resizeMode="contain"/> :
              <ArrowUpIcon
                style={styles.widget_icon}
                resizeMode="contain"/>
            }
          </TouchableOpacity>
        </View>
        <View style={true ? styles.none : null}>
          <View style={{ width: "100%" }}>
            <View style={styles.subline} />
            <View style={styles.variantContainer}>
              <TextInput style={styles.variantInput}></TextInput>
              <Text style={styles.variantText}>{"在庫"} :</Text>
            </View>
            <View style={styles.variantContainer}>
              <TextInput style={styles.variantInput}></TextInput>
              <Text style={styles.variantText}>{"JANコード"} :</Text>
            </View>
            <View
              style={[
                styles.variantContainer,
                { paddingBottom: heightPercentageToDP("1.5%") },
              ]}
            >
              <Text style={styles.variantText}>{"削除"}</Text>
              <DustBinIcon
                style={styles.widget_icon}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={{ width: "100%" }}>
            <View style={styles.subline} />
            <View style={styles.variantContainer}>
              <TextInput style={styles.variantInput}></TextInput>
              <Text style={styles.variantText}>{"在庫"} :</Text>
            </View>
            <View style={styles.variantContainer}>
              <TextInput style={styles.variantInput}></TextInput>
              <Text style={styles.variantText}>{"JANコード"} :</Text>
            </View>
            <View
              style={[
                styles.variantContainer,
                { paddingBottom: heightPercentageToDP("1.5%") },
              ]}
            >
              <Text style={styles.variantText}>{"削除"}</Text>
              <DustBinIcon
                style={styles.widget_icon}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
        <View style={styles.line} />
      </View>

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
    display: "none"
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
  multiVariant: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden"
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
    marginTop: heightPercentageToDP("1%"),
    marginBottom: heightPercentageToDP("2%"),
    padding: 10,
    paddingLeft: widthPercentageToDP("2%"),
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
});
