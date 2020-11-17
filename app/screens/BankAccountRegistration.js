import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  ImageBackground,
  Switch,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { ScrollView } from "react-native-gesture-handler";
const request = new Request();
const alert = new CustomAlert();
import zenginCode from "zengin-code";

const win = Dimensions.get("window");
export default function BankAccountRegistration(props) {
  const [financialAccount, onFinancialAccountChanged] = React.useState({
    financial_name: "test",
  });
  const [financialName, onFinancialNameChanged] = React.useState("");
  const [branchName, onBranchNameChanged] = React.useState("");
  const [accountType, onAccountTypeChanged] = React.useState("");
  const [accountNumber, onAccountNumberChanged] = React.useState("");
  const [accountHolder, onAccountHolderChanged] = React.useState("");
  const [loaded, onLoaded] = React.useState("");
  const [user, onUserChanged] = React.useState({});
  React.useEffect(() => {
    AsyncStorage.getItem("user").then(function(url) {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      let userId = urls[urls.length - 1];

      if (!user.url) {
        request
          .get(url)
          .then(function(response) {
            onUserChanged(response.data);
          })
          .catch(function(error) {
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
      }

      if (!loaded) {
        request
          .get("financial-account/" + userId + "/")
          .then(function(response) {
            onLoaded(true);
            onFinancialAccountChanged(response.data.financialAccount);
            onFinancialNameChanged(
              response.data.financialAccount.financial_name
            );
            onBranchNameChanged(response.data.financialAccount.branch_name);
            onAccountTypeChanged(response.data.financialAccount.account_type);
            onAccountNumberChanged(
              response.data.financialAccount.account_number
            );
            onAccountHolderChanged(response.data.financialAccount.account_name);
          })
          .catch(function(error) {
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
      }
    });
  });

  return (
    <ScrollView>
      <CustomHeader
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onBack={() => {
          props.navigation.pop();
        }}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        text={Translate.t("bankAccount")}
      />
      <CustomSecondaryHeader
        name={user.real_name ? user.real_name : user.nickname}
        accountType={
          props.route.params.is_store ? Translate.t("storeAccount") : ""
        }
      />
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder={Translate.t("financialInstitutionName")}
          placeholderTextColor={Colors.deepGrey}
          style={styles.textInput}
          onChangeText={(text) => onFinancialNameChanged(text)}
          value={financialName}
        ></TextInput>
        <TextInput
          placeholder={Translate.t("branchName")}
          placeholderTextColor={Colors.deepGrey}
          style={styles.textInput}
          onChangeText={(text) => onBranchNameChanged(text)}
          value={branchName}
        ></TextInput>
        <TextInput
          placeholder={Translate.t("accountType")}
          placeholderTextColor={Colors.deepGrey}
          style={styles.textInput}
          onChangeText={(text) => onAccountTypeChanged(text)}
          value={accountType}
        ></TextInput>
        <TextInput
          placeholder={Translate.t("accountNumber")}
          placeholderTextColor={Colors.deepGrey}
          style={styles.textInput}
          onChangeText={(text) => onAccountNumberChanged(text)}
          value={accountNumber}
        ></TextInput>
        <TextInput
          placeholder={Translate.t("accountHolder")}
          placeholderTextColor={Colors.deepGrey}
          style={styles.textInput}
          onChangeText={(text) => onAccountHolderChanged(text)}
          value={accountHolder}
        ></TextInput>
      </View>
      <Text style={styles.warningText}>
        {Translate.t("bankRegistrationWarning")}
      </Text>
      <View style={{ paddingBottom: heightPercentageToDP("5%") }}>
        <TouchableWithoutFeedback
          onPress={() => {
            if (
              financialName &&
              branchName &&
              accountType &&
              accountNumber &&
              accountHolder
            ) {
              AsyncStorage.getItem("user").then(function(url) {
                url = url.replace("http://testserver", "http://127.0.0.1:8000");
                let urls = url.split("/");
                urls = urls.filter((url) => {
                  return url;
                });

                request
                  .post("financial_account/", {
                    user: url.replace("testserver", "127.0.0.1:8000"),
                    financial_name: financialName,
                    account_type: accountType,
                    branch_code: "000",
                    branch_name: branchName,
                    account_number: accountNumber,
                    account_name: accountHolder,
                    financial_code: "0000",
                  })
                  .then(function(response) {
                    onAccountHolderChanged("");
                    onAccountNumberChanged("");
                    onBranchNameChanged("");
                    onFinancialNameChanged("");
                    onAccountTypeChanged("");
                    props.navigation.pop();
                  })
                  .catch(function(error) {
                    alert.warning(
                      error.response.data[
                        Object.keys(error.response.data)[0]
                      ][0]
                    );
                    onLoaded(true);
                  });
              });
            } else {
              alert.warning(Translate.t("fieldNotFilled"));
            }
          }}
        >
          <View style={styles.saveButtonContainer}>
            <Text style={styles.saveButtonText}>{Translate.t("save")}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "white",
    fontSize: RFValue(12),
    height: heightPercentageToDP("5%"),
    paddingLeft: widthPercentageToDP("2%"),
    marginVertical: heightPercentageToDP("1%"),
  },
  textInputContainer: {
    marginTop: heightPercentageToDP("3%"),
    backgroundColor: Colors.F0EEE9,
    marginHorizontal: widthPercentageToDP("5%"),
    padding: widthPercentageToDP("4%"),
    justifyContent: "space-evenly",
  },
  warningText: {
    color: "red",
    fontSize: RFValue(12),
    marginHorizontal: widthPercentageToDP("5%"),
    marginTop: heightPercentageToDP("5%"),
  },
  saveButtonContainer: {
    backgroundColor: Colors.E6DADE,
    marginHorizontal: widthPercentageToDP("25%"),
    borderRadius: 5,
    alignItems: "center",
    marginTop: heightPercentageToDP("5%"),
    padding: heightPercentageToDP("1%"),
  },
  saveButtonText: {
    fontSize: RFValue(12),
    color: "white",
  },
});
