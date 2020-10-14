import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import PasswordResetScreen from "../Screens/PasswordReset";
import PasswordResetCompletionScreen from "../Screens/PasswordResetCompletion";

const screens = {
  PasswordResetScreen: {
    screen: PasswordResetScreen,
  },
  PasswordResetCompletionScreen: {
    screen: PasswordResetCompletionScreen,
  },
};
const ResetPasswordStack = createStackNavigator(screens, {
  headerMode: "none",
  defaultNavigationOptions: {
    headerVisible: false,
  },
});
export default createAppContainer(ResetPasswordStack);
