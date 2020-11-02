import axios from "axios";
import { Alert } from "react-native";

class CustomAlert {
  async warning(text, func) {
    if(func){
      Alert.alert("Warning", text, [{ 
        text: "OK",
        onPress: () => {
          func()
        }
      }], { cancelable: false });
    } else {
      Alert.alert("Warning", text, [{ 
        text: "OK"
      }], { cancelable: false });
    }
  }
}

export default CustomAlert;
