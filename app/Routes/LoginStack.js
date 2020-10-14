import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import LoginScreen from "../screens/LoginScreen";
import RegistrationGeneral from "../screens/RegistrationGeneral";
import RegistrationStore from "../screens/RegistrationStore";
import SMSAuthentication from "../screens/SMSAuthentication";
import AccountExamination from "../screens/AccountExamination";
import PasswordReset from "../screens/PasswordReset";
import PasswordResetCompletion from "../screens/PasswordResetCompletion";
const screens = {
  LoginScreen: {
    screen: LoginScreen,
  },
  RegistrationGeneral: {
    screen: RegistrationGeneral,
  },
  RegistrationStore: {
    screen: RegistrationStore,
  },
  SMSAuthentication: {
    screen: SMSAuthentication,
  },
  AccountExamination: {
    screen: AccountExamination,
  },
  PasswordReset: {
    screen: PasswordReset,
  },
  PasswordResetCompletion: {
    screen: PasswordResetCompletion,
  },
};

const LoginStack = createStackNavigator(screens, {
  headerMode: "none",
});

export default createAppContainer(LoginStack);
