import React, { useMemo } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableNativeFeedback,
    Modal,
} from "react-native";

import {
    widthPercentageToDP,
    heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../../assets/Translates/Translate";
import { Colors } from "../../assets/Colors";
import { RFValue } from "react-native-responsive-fontsize";
const ChatPopup = ({
    showPopUp,
    onCopy,
    onFoward,
    onCancel,
    onAddToFav,
    onMutiSelect,
    onCustomerInformation,
    onShowPopUpChanged, needShowCancel
}) => {

    const cancelMsgAll = () => {
        onCancel(true)
    }

    const hidePopUp = () => {
        onShowPopUpChanged(false);
    }

    return React.useMemo(() => {
        return <Modal
            presentationStyle={"overFullScreen"}
            visible={showPopUp}
            transparent={true}
            animationType="fade"
        >
            <TouchableNativeFeedback onPress={hidePopUp} >
                <View style={styles.container}>
                    <View style={showPopUp == true ? styles.popUpView : styles.none}>
                        <View
                            style={styles.wrapItem}
                        >
                            <PopupItem
                                onPress={onCopy}
                                langKey='copy'
                            />
                            <PopupItem
                                onPress={onFoward}
                                langKey='forward'
                            />
                            {needShowCancel && <PopupItem
                                onPress={onCancel}
                                langKey='cancelOnlyMe'
                            />}
                            <PopupItem
                                onPress={cancelMsgAll}
                                langKey='remove'
                            />
                            <PopupItem
                                onPress={onAddToFav}
                                langKey='addToFav'
                            />
                            <PopupItem
                                onPress={onMutiSelect}
                                langKey='multiSelect'
                            />
                            {!needShowCancel && <PopupItem
                                onPress={onCustomerInformation}
                                langKey='customerInformation'
                            />}
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        </Modal>
    }, [showPopUp, needShowCancel])
}


const PopupItem = ({
    onPress,
    langKey
}) => {
    return useMemo(() => {
        return <TouchableOpacity
            onPress={onPress}
        >
            <Text style={styles.popUpText}>
                {Translate.t(langKey)}
            </Text>
        </TouchableOpacity>
    }, [])
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "transparent" },
    wrapItem: {
        marginTop: heightPercentageToDP("1%"),
        // paddingBottom: heightPercentageToDP("1.5%"),
        flex: 1,
        width: "100%",
    },
    none: {
        display: "none",
    },
    popUpView: {
        position: "absolute",
        backgroundColor: "white",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        borderWidth: 1,
        borderColor: Colors.D7CCA6,
        marginHorizontal: widthPercentageToDP("15%"),
        marginVertical: heightPercentageToDP("34%"),
    },
    popUpText: {
        marginLeft: widthPercentageToDP("2%"),
        fontSize: RFValue(12),
        paddingBottom: heightPercentageToDP("2%"),
    },
    selected: {
        backgroundColor: "#BBD8B3",
    },
    non_selected: {},
});

export default ChatPopup