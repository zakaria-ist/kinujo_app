import React, { useEffect, useState, useRef } from "react";
import {
    StyleSheet,
    Text,
    Image,
    View,
    Dimensions,
    TouchableNativeFeedback,
    KeyboardAvoidingView,
    TextInput,
    Platform,
    Animated,
} from "react-native";

import { Colors } from "../../assets/Colors.js";
import RNFetchBlob from "rn-fetch-blob";

import {
    widthPercentageToDP,
    heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../../assets/Translates/Translate";
import ImagePicker from "react-native-image-picker";
import { RFValue } from "react-native-responsive-fontsize";
import AndroidKeyboardAdjust from "react-native-android-keyboard-adjust";

import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../../../firebaseConfig.js";
import ArrowDownLogo from "../../assets/icons/arrow_down.svg";
import PlusCircleLogo from "../../assets/icons/plus_circle.svg";
import EmojiLogo from "../../assets/icons/emoji.svg";
import SendLogo from "../../assets/icons/send.svg";
import CameraLogo from "../../assets/icons/camera.svg";
import GalleryLogo from "../../assets/icons/gallery.svg";
import ContactLogo from "../../assets/icons/contact.svg";
import Request from "../../lib/request";
import CustomAlert from "../../lib/alert";
import storage from "@react-native-firebase/storage";

const alert = new CustomAlert();
const { width } = Dimensions.get("window");
var uuid = require("react-native-uuid");
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
if (Platform.OS === "android") {
    AndroidKeyboardAdjust.setAdjustResize();
}
const db = firebase.firestore();
const chatsRef = db.collection("chat");
const request = new Request();
let userId;
let groupID;
let isUserBlocked = false;


const FooterChat = ({
    inputBarPosition, textInputHeight, shouldShow, hideEmoji, onHide, onContentSizeChange, messages,
    onChangeText, handleEmojiIconPressed, shareContact
}) => {


    return <View
        style={{
            width: "100%",
            bottom: inputBarPosition,
            left: 0,
            overflow: "hidden",
        }}
    >
        <View
            style={{
                height: textInputHeight,
                backgroundColor: "#F0EEE9",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <View style={styles.input_bar_file}>
                <TouchableNativeFeedback
                    onPress={() => {
                        hideEmoji();
                        setShouldShow(!shouldShow);
                    }}
                >
                    {shouldShow ? (
                        <ArrowDownLogo
                            width={"100%"}
                            height={"100%"}
                            resizeMode="contain"
                        />
                    ) : (
                        <PlusCircleLogo
                            style={{
                                width: RFValue(23),
                                height: RFValue(23),
                                alignSelf: "center",
                            }}
                        />
                    )}
                </TouchableNativeFeedback>
            </View>
            <View style={styles.input_bar_text}>
                <View style={styles.input_bar_text_border}>
                    <TextInput
                        onContentSizeChange={onContentSizeChange}
                        onFocus={() => hideEmoji()}
                        multiline={true}
                        value={messages}
                        onChangeText={(value) => setMessages(value)}
                        placeholder="Type a message"
                        style={{
                            fontSize: RFValue(15),
                            width: widthPercentageToDP("15%"),
                            flexGrow: 1,
                            color: "black",
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            paddingLeft: 15,
                        }}
                    ></TextInput>

                    <TouchableNativeFeedback
                        onPress={() => handleEmojiIconPressed()}
                    >
                        <View style={styles.user_emoji_input}>
                            <EmojiLogo
                                style={{
                                    width: RFValue(22),
                                    height: RFValue(22),
                                    alignSelf: "center",
                                }}
                            />
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
            {/* SEND BUTTON */}
            <TouchableNativeFeedback
                onPress={() => {
                    console.log('press', isUserBlocked);
                    if (!isUserBlocked) {
                        let tmpMessage = messages;
                        setMessages("");
                        let createdAt = getTime();
                        if (tmpMessage) {
                            let doc = db
                                .collection("chat")
                                .doc(groupID)
                                .collection("messages")
                                .doc();
                            doc
                                .set({
                                    userID: userId,
                                    createdAt: createdAt,
                                    timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                                    message: tmpMessage,
                                })
                                .then((item) => { });
                        }
                    } else {
                        setMessages("");
                    }
                }}
            >
                <View style={styles.input_bar_send}>
                    <SendLogo
                        style={{
                            width: RFValue(23),
                            height: RFValue(23),
                            alignSelf: "center",
                        }}
                    // width={"100%"}
                    // height={"100%"}
                    // resizeMode="contain"
                    />
                </View>
            </TouchableNativeFeedback>
        </View>
        <Animated.View
            style={[shouldShow ? styles.input_bar_widget : styles.none]}
        >
            <TouchableNativeFeedback
                onPress={() => {
                    const options = {
                        noData: true,
                        mediaType: "photo"
                    };
                    ImagePicker.launchCamera(options, (response) => {
                        if (response.uri) {
                            if (response.type.includes("image")) {
                                const reference = storage().ref(uuid.v4() + ".png");
                                if (Platform.OS === "android") {
                                    RNFetchBlob.fs.stat(response.path).then((stat) => {
                                        reference
                                            .putFile(stat.path)
                                            .then((response) => {
                                                reference.getDownloadURL().then((url) => {
                                                    let createdAt = getTime();

                                                    chatsRef
                                                        .doc(groupID)
                                                        .collection("messages")
                                                        .add({
                                                            userID: userId,
                                                            createdAt: createdAt,
                                                            message: "Photo",
                                                            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                                                            image: url,
                                                        })
                                                        .then(function () { });
                                                });
                                            })
                                            .catch((error) => { });
                                    });
                                } else {
                                    reference
                                        .putFile(response.uri.replace("file://", ""))
                                        .then((response) => {
                                            reference.getDownloadURL().then((url) => {
                                                let createdAt = getTime();

                                                chatsRef
                                                    .doc(groupID)
                                                    .collection("messages")
                                                    .add({
                                                        userID: userId,
                                                        createdAt: createdAt,
                                                        message: "Photo",
                                                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                                                        image: url,
                                                    })
                                                    .then(function () { });
                                            });
                                        })
                                        .catch((error) => { });
                                }
                            } else {
                                alert.warning(Translate.t("image_allowed"))
                            }
                        }
                    });
                }}
            >
                <View style={styles.widget_box}>
                    <CameraLogo style={styles.widget_icon} resizeMode="contain" />
                    <Text style={{ fontSize: RFValue(11) }}>
                        {Translate.t("camera")}
                    </Text>
                </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
                onPress={() => {
                    const options = {
                        mediaType: "photo"
                    };
                    ImagePicker.launchImageLibrary(options, (response) => {
                        if (response.uri) {
                            if (response.type.includes("image")) {
                                const reference = storage().ref(uuid.v4() + ".png");
                                onSpinnerChanged(true);
                                if (Platform.OS === "android") {
                                    RNFetchBlob.fs.stat(response.uri).then((stat) => {
                                        console.log(stat);
                                        reference
                                            .putFile(stat.path)
                                            .then((response) => {
                                                reference.getDownloadURL().then((url) => {
                                                    let createdAt = getTime();

                                                    chatsRef
                                                        .doc(groupID)
                                                        .collection("messages")
                                                        .add({
                                                            userID: userId,
                                                            createdAt: createdAt,
                                                            message: "Photo",
                                                            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                                                            image: url,
                                                        })
                                                        .then(function () {
                                                            onSpinnerChanged(false);
                                                        }).catch(() => {
                                                            onSpinnerChanged(false);
                                                        })
                                                }).catch(() => {
                                                    onSpinnerChanged(false);
                                                })
                                            })
                                            .catch((error) => {
                                                onSpinnerChanged(false);
                                            });
                                    });
                                } else {
                                    reference
                                        .putFile(response.uri.replace("file://", ""))
                                        .then((response) => {
                                            reference.getDownloadURL().then((url) => {
                                                let createdAt = getTime();

                                                chatsRef
                                                    .doc(groupID)
                                                    .collection("messages")
                                                    .add({
                                                        userID: userId,
                                                        createdAt: createdAt,
                                                        message: "Photo",
                                                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                                                        image: url,
                                                    })
                                                    .then(function () {
                                                        onSpinnerChanged(false);
                                                    }).catch(() => {
                                                        onSpinnerChanged(false);
                                                    })
                                            }).catch(() => {
                                                onSpinnerChanged(false);
                                            })
                                        })
                                        .catch((error) => {
                                            onSpinnerChanged(false);
                                        });
                                }
                            } else {
                                alert.warning(Translate.t("image_allowed"))
                            }
                        }
                    });
                }}
            >
                <View style={styles.widget_box}>
                    <GalleryLogo style={styles.widget_icon} resizeMode="contain" />
                    <Text style={{ fontSize: RFValue(11) }}>
                        {Translate.t("gallery")}
                    </Text>
                </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
                onPress={() =>
                    props.navigation.navigate("ContactShare", {
                        groupID: groupID,
                    })
                }
            >
                <View style={styles.widget_box}>
                    <ContactLogo style={styles.widget_icon} resizeMode="contain" />
                    <Text style={{ fontSize: RFValue(11) }}>
                        {Translate.t("contact")}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        </Animated.View>
        <View style={{ flex: 1 }} />
    </View>
}

const styles = StyleSheet.create({
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
        // alignSelf: "center",
        // marginTop: -heightPercentageToDP("15%"),
        // justifyContent: "space-evenly",
        marginHorizontal: widthPercentageToDP("15%"),
        marginVertical: heightPercentageToDP("34%"),
        // paddingTop: heightPercentageToDP("1%"),
        // paddingBottom: heightPercentageToDP("3%"),
        // alignItems: "center",
    },
    popUpText: {
        marginLeft: widthPercentageToDP("2%"),
        fontSize: RFValue(12),
        paddingBottom: heightPercentageToDP("2%"),
    },
    // user_text_input: {
    //   width: widthPercentageToDP("15%"),
    //   height: heightPercentageToDP("5%"),
    //   backgroundColor: "orange",
    //   flexGrow: 1,
    //   color: "black",
    //   flexDirection: "row",
    //   justifyContent: "flex-end",
    //   paddingLeft: 15,
    // },
    user_emoji_input: {
        // height: heightPercentageToDP("6%"),
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
});

export default FooterChat