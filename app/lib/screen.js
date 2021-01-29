import React from "react";
import { InteractionManager } from 'react-native';

class ScreenFlow {
  useEffect(callback, useEffectParams) {
    React.useEffect(()=>{
        InteractionManager.runAfterInteractions(() => {
            if(callback){
                callback();
            }
        });
    }, useEffectParams)
  }
}
export default ScreenFlow;
