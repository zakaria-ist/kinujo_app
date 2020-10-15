import axios from "axios";
import { Alert } from "react-native";

class CustomAlert {
  async warning(text, func) {
    Alert.alert("Warning", text, [{ 
      text: "OK",
      onPress: () => func()
    }], { cancelable: false });
  }
}

export default CustomAlert;
