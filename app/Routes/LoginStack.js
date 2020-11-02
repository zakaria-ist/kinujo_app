import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../Screens/LoginScreen";
import RegistrationGeneral from "../Screens/RegistrationGeneral";
import RegistrationStore from "../Screens/RegistrationStore";
import SMSAuthentication from "../Screens/SMSAuthentication";
import AccountExamination from "../Screens/AccountExamination";
import PasswordReset from "../Screens/PasswordReset";
import PasswordResetCompletion from "../Screens/PasswordResetCompletion";
import TermsOfCondition from "../Screens/TermsOfCondition";
import StoreAccountSelection from "../Screens/StoreAccountSelection";
import BankAccountRegistrationOption from "../Screens/BankAccountRegistrationOption";
import RegisterCompletion from "../Screens/RegisterCompletion";
import HomeGeneral from "../Screens/HomeGeneral";
import HomeStore from "../Screens/HomeStore";
import ChatScreen from "../Screens/ChatScreen";
import ReceiptView from "../Screens/ReceiptView";
import QRCode from "../Screens/QRCode";
import SettingGeneral from "../Screens/SettingGeneral";
import SettingStore from "../Screens/SettingStore";
import Setting from "../Screens/Setting";
import ProfileEditingGeneral from "../Screens/ProfileEditingGeneral";
import ProfileEditingStore from "../Screens/ProfileEditingStore";
import ExhibitedProductList from "../Screens/ExhibitedProductList";
import PurchaseHistory from "../Screens/PurchaseHistory";
import CustomerList from "../Screens/CustomerList";
import CustomerInformation from "../Screens/CustomerInformation";
import BankAccountRegistration from "../Screens/BankAccountRegistration";
import ProfileInformation from "../Screens/ProfileInformation";
import StoreInformation from "../Screens/StoreInformation";
import ShippingList from "../Screens/ShippingList";
import PurchaseHistoryDetails from "../Screens/PurchaseHistoryDetails";
import SalesManagement from "../Screens/SalesManagement";
import Cart from "../Screens/Cart";
import Favorite from "../Screens/Favorite";
import MemoEdit from "../Screens/MemoEdit";
import AdvanceSetting from "../Screens/AdvanceSetting";
import ProductInformationAdd from "../Screens/ProductInformationAdd";
import ChatList from "../Screens/ChatList";
import Contact from "../Screens/Contact";
import AdressManagement from "../Screens/AdressManagement";
import ContactSearch from "../Screens/ContactSearch";
import GroupChatCreation from "../Screens/GroupChatCreation";
import GroupChatMember from "../Screens/GroupChatMember";
import FriendSearch from "../Screens/FriendSearch";
import CreateFolder from "../Screens/CreateFolder";
import FolderMemberSelection from "../Screens/FolderMemberSelection";
import GroupFolderCreateCompletion from "../Screens/GroupFolderCreateCompletion";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomerInformationDetails from "../Screens/CustomerInformationDetails";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomNavigationGeneral() {
  return (
    <Tab.Navigator
      initialRouteName="HomeGeneral"
      tabBarOptions={{
        showLabel: false,
        showIcon: true,
        activeTintColor: "#e91e63",
      }}
    >
      <Tab.Screen
        name="HomeGeneral"
        component={HomeGeneral}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => (
            <Image
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
              source={require("../assets/icons/home.svg")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Contact"
        component={Contact}
        options={{
          tabBarLabel: "Contact",
          tabBarIcon: () => (
            <Image
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
              source={require("../assets/icons/person.svg")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatList}
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: () => (
            <Image
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
              source={require("../assets/icons/chat.svg")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="QRCode"
        component={QRCode}
        options={{
          tabBarLabel: "QRCode",
          tabBarIcon: () => (
            <Image
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
              source={require("../assets/icons/qrcode.svg")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingGeneral"
        component={SettingGeneral}
        options={{
          tabBarLabel: "Setting",
          tabBarIcon: () => (
            <Image
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
              source={require("../assets/icons/setting.svg")}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
function BottomNavigationStore() {
  return (
    <Tab.Navigator
      initialRouteName="HomeGeneral"
      tabBarOptions={{
        showLabel: false,
        showIcon: true,
        activeTintColor: "#e91e63",
      }}
    >
      <Tab.Screen
        name="HomeGeneral"
        component={HomeGeneral}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => (
            <Image
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
              source={require("../assets/icons/home.svg")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Contact"
        component={Contact}
        options={{
          tabBarLabel: "Contact",
          tabBarIcon: () => (
            <Image
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
              source={require("../assets/icons/person.svg")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatList}
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: () => (
            <Image
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
              source={require("../assets/icons/chat.svg")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="QRCode"
        component={QRCode}
        options={{
          tabBarLabel: "QRCode",
          tabBarIcon: () => (
            <Image
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
              source={require("../assets/icons/qrcode.svg")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingStore"
        component={SettingStore}
        options={{
          tabBarLabel: "Setting",
          tabBarIcon: () => (
            <Image
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
              source={require("../assets/icons/setting.svg")}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function LoginStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen
          name="RegistrationGeneral"
          component={RegistrationGeneral}
        />
        <Stack.Screen name="RegistrationStore" component={RegistrationStore} />
        <Stack.Screen name="SMSAuthentication" component={SMSAuthentication} />
        <Stack.Screen
          name="AccountExamination"
          component={AccountExamination}
        />
        <Stack.Screen name="PasswordReset" component={PasswordReset} />
        <Stack.Screen
          name="PasswordResetCompletion"
          component={PasswordResetCompletion}
        />
        <Stack.Screen
          name="RegisterCompletion"
          component={RegisterCompletion}
        />

        <Stack.Screen name="TermsOfCondition" component={TermsOfCondition} />
        <Stack.Screen
          name="StoreAccountSelection"
          component={StoreAccountSelection}
        />
        <Stack.Screen
          name="BankAccountRegistrationOption"
          component={BankAccountRegistrationOption}
        />
        <Stack.Screen name="HomeGeneral" component={BottomNavigationGeneral} />
        <Stack.Screen name="HomeStore" component={BottomNavigationStore} />
        <Stack.Screen
          name="ProfileEditingGeneral"
          component={ProfileEditingGeneral}
        />
        <Stack.Screen
          name="ProfileEditingStore"
          component={ProfileEditingStore}
        />
        <Stack.Screen name="CustomerList" component={CustomerList} />
        <Stack.Screen
          name="ExhibitedProductList"
          component={ExhibitedProductList}
        />
        <Stack.Screen name="PurchaseHistory" component={PurchaseHistory} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen
          name="BankAccountRegistration"
          component={BankAccountRegistration}
        />
        <Stack.Screen
          name="CustomerInformation"
          component={CustomerInformation}
        />
        <Stack.Screen
          name="CustomerInformationDetails"
          component={CustomerInformationDetails}
        />
        <Stack.Screen
          name="ProfileInformation"
          component={ProfileInformation}
        />
        <Stack.Screen name="StoreInformation" component={StoreInformation} />
        <Stack.Screen name="SalesManagement" component={SalesManagement} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Favorite" component={Favorite} />
        <Stack.Screen name="MemoEdit" component={MemoEdit} />
        <Stack.Screen name="AdvanceSetting" component={AdvanceSetting} />
        <Stack.Screen name="ShippingList" component={ShippingList} />
        <Stack.Screen
          name="ProductInformationAdd"
          component={ProductInformationAdd}
        />
        <Stack.Screen name="ChatList" component={BottomNavigationGeneral} />
        <Stack.Screen name="Contact" component={BottomNavigationGeneral} />
        <Stack.Screen name="ContactSearch" component={ContactSearch} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="FriendSearch" component={FriendSearch} />
        <Stack.Screen name="GroupChatCreation" component={GroupChatCreation} />
        <Stack.Screen name="CreateFolder" component={CreateFolder} />
        <Stack.Screen name="GroupChatMember" component={GroupChatMember} />
        <Stack.Screen name="AdressManagement" component={AdressManagement} />
        <Stack.Screen name="ReceiptView" component={ReceiptView} />
        <Stack.Screen name="PurchaseHistoryDetails" component={PurchaseHistoryDetails} />
        <Stack.Screen
          name="FolderMemberSelection"
          component={FolderMemberSelection}
        />
        <Stack.Screen
          name="GroupFolderCreateCompletion"
          component={GroupFolderCreateCompletion}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
