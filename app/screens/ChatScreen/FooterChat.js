import React from "react";
import {
    StyleSheet,
    View,
    TouchableNativeFeedback, TouchableOpacity,
    TextInput,
    Platform,
    Animated,
} from "react-native";

import { Colors } from "../../assets/Colors.js";

import {
    widthPercentageToDP,
    heightPercentageToDP,
} from "react-native-responsive-screen";
import ImagePicker from "react-native-image-picker";
import { RFValue } from "react-native-responsive-fontsize";
import AndroidKeyboardAdjust from "react-native-android-keyboard-adjust";

import ArrowDownLogo from "../../assets/icons/arrow_down.svg";
import PlusCircleLogo from "../../assets/icons/plus_circle.svg";
import EmojiLogo from "../../assets/icons/emoji.svg";
import SendLogo from "../../assets/icons/send.svg";
import CameraLogo from "../../assets/icons/camera.svg";
import GalleryLogo from "../../assets/icons/gallery.svg";
import ContactLogo from "../../assets/icons/contact.svg";
import FooterAction from "./FooterAction.js";

if (Platform.OS === "android") {
    AndroidKeyboardAdjust.setAdjustResize();
}


const FooterChat = ({
    inputBarPosition, textInputHeight, shouldShow, hideEmoji, onHide, onContentSizeChange, messages,
    onChangeText, handleEmojiIconPressed, shareContact, onSendMsg, onSendImage
}) => {


    const onPhoto = () => {
        const options = {
            mediaType: "photo",
            includeBase64: false,
            allowsEditing: true
        };
        ImagePicker.launchImageLibrary(options, onSendImage);
    }

    const onCamera = () => {
        const options = {
            noData: true,
            mediaType: "photo",
            includeBase64: false,
            allowsEditing: true
        };
        ImagePicker.launchCamera(options, onSendImage);
    }

    return <View style={[styles.container, { bottom: inputBarPosition, }]}>
        <View style={[styles.wrapInput, { height: textInputHeight, }]} >
            <View style={styles.input_bar_file}>
                <TouchableOpacity
                    onPress={onHide}
                >
                    {shouldShow ? (
                        <ArrowDownLogo
                            width={"100%"}
                            height={"100%"}
                            resizeMode="contain"
                        />
                    ) : (
                        <PlusCircleLogo
                            style={styles.plusLogo}
                        />
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.input_bar_text}>
                <View style={styles.input_bar_text_border}>
                    <TextInput
                        onContentSizeChange={onContentSizeChange}
                        onFocus={hideEmoji}
                        multiline={true}
                        value={messages}
                        onChangeText={onChangeText}
                        placeholder="Type a message"
                        style={styles.inputStyle}
                    />

                    <TouchableNativeFeedback
                        onPress={handleEmojiIconPressed}
                    >
                        <View style={styles.user_emoji_input}>
                            <EmojiLogo
                                style={styles.emojiLogo}
                            />
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
            {/* SEND BUTTON */}
            <TouchableNativeFeedback onPress={onSendMsg} >
                <View style={styles.input_bar_send}>
                    <SendLogo
                        style={styles.btnSend}
                    />
                </View>
            </TouchableNativeFeedback>
        </View>
        <Animated.View
            style={[shouldShow ? styles.input_bar_widget : styles.none]}
        >
            <FooterAction
                onPress={onCamera}
                Logo={CameraLogo}
                i18key={'camera'}
            />
            <FooterAction
                onPress={onPhoto}
                Logo={GalleryLogo}
                i18key={'gallery'}
            />

            <FooterAction
                onPress={shareContact}
                Logo={ContactLogo}
                i18key={'contact'}
            />
        </Animated.View>
        <View style={{ flex: 1 }} />
    </View>
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        left: 0,
        overflow: "hidden",
    },
    none: {
        display: "none",
    },
    input_bar: {
        height: heightPercentageToDP("7%"),
        backgroundColor: "#F0EEE9",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    input_bar_file: {
        marginLeft: 5,
        height: heightPercentageToDP("6%"),
        width: heightPercentageToDP("6%"),
        padding: 10,
    },
    input_bar_text: {
        height: "100%",
        flexGrow: 1,
        padding: 5,
    },
    input_bar_text_border: {
        borderRadius: 25,
        backgroundColor: "#FFF",
        width: "100%",
        height: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
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
    user_emoji_input: {
        width: heightPercentageToDP("6%"),
        fontSize: RFValue(10),
        padding: 10,
        alignItems: "center",
    },
    input_bar_send: {
        marginRight: 5,
        height: heightPercentageToDP("6%"),
        width: heightPercentageToDP("6%"),
        padding: 10,
    },
    input_bar_widget: {
        height: heightPercentageToDP("10%"),
        backgroundColor: "#FFF",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
    },
    widget_box: {
        alignItems: "center",
        height: heightPercentageToDP("8%"),
        width: heightPercentageToDP("10%"),
        padding: 10,
        color: "#000",
        textAlign: "center",
    },
    widget_icon: {
        height: heightPercentageToDP("7%") - 20,
        width: heightPercentageToDP("7%") - 20,
        margin: "auto",
    },
    wrapInput: {
        backgroundColor: "#F0EEE9",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    plusLogo: {
        width: RFValue(23),
        height: RFValue(23),
        alignSelf: "center",
    },
    inputStyle: {
        fontSize: RFValue(15),
        width: widthPercentageToDP("15%"),
        flexGrow: 1,
        color: "black",
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingLeft: 15,
    },
    emojiLogo: {
        width: RFValue(22),
        height: RFValue(22),
        alignSelf: "center",
    },
    footerText: { fontSize: RFValue(11) },
    btnSend: {
        width: RFValue(23),
        height: RFValue(23),
        alignSelf: "center",
    }
});

export default FooterChat