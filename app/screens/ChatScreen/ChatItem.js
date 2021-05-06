import React, { useEffect, useMemo, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableNativeFeedback,
} from "react-native";

import Translate from "../../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import ChatText from "../ChatText";
import ChatContact from "../ChatContact";
import moment from 'moment-timezone';
import { Linking } from "react-native";
import { timezone as myTimeZone } from "expo-localization";
import navigationHelper from "../../lib/navigationHelper";

const ChatItem = ({
    userId, parentProps, onLongPressObjChanged, onShowPopUpChanged,
    redirectToChat, tmpMultiSelect, selects, findParams, request,
    showCheckBox, imageMap, setSelectMsg, item
}) => {

    let chat = item
    if (!chat?.data?.userID) return null
    let isSelected = selects.find(el => el?.id == chat?.id) ? true : false

    const onMessageLongPress = () => {
        onLongPressObjChanged({
            id: chat.id,
            message: chat.data.message,
            data: chat.data,
            contactID: chat.data.contactID,
            contactName: chat.data.contactName,
            image: chat.data.image
        });
        onShowPopUpChanged(true);
    }

    const onPressContact = () => {
        if (tmpMultiSelect) {
            onSelectMessage()
        } else {
            redirectToChat(
                chat.data.contactID,
                chat.data.contactName
            );
        }
    }

    const onHyperLinkClicked = (url, text) => {
        if (!tmpMultiSelect) {
            if (findParams(url, "apn") && findParams(url, "link")) {
                let link = decodeURIComponent(findParams(url, "link"));
                console.log(findParams(link, "product_id"));
                if (findParams(link, "product_id")) {
                    let apiUrl = request.getApiUrl() + "products/" + findParams(link, "product_id");
                    navigationHelper.navigate("HomeStoreList", {
                        url: apiUrl,
                        images: []
                    });
                } else {
                    Linking.openURL(url);
                }
            } else {
                Linking.openURL(url);
            }
        }
    }

    const [isSelect, setIsSelect] = useState(false)


    if (isSelected && !isSelect) setIsSelect(true)

    useEffect(() => {
        if (!tmpMultiSelect) setIsSelect(false)
    }, [tmpMultiSelect])

    const onSelectMessage = () => {
        if (tmpMultiSelect) {
            setSelectMsg({ ...chat, ...chat?.data }, isSelect)
            setIsSelect(!isSelect)
        }
    }

    return useMemo(() => {
        let props = parentProps

        let dateOfMessage = null
        let now = moment().tz(myTimeZone);
        let momentDateOfMsg = moment(chat.data.createdAt, 'YYYY:MM:DD:HH:mm').tz(myTimeZone)
        if (chat.first) {
            if (now.isSame(momentDateOfMsg, 'd')) {
                dateOfMessage = Translate.t("today")
            } else if (now.diff(momentDateOfMsg, 'd') === 1) {
                dateOfMessage = Translate.t("yesterday")
            } else {
                dateOfMessage = momentDateOfMsg.format('YYYY/MM/DD');
                // dateOfMessage = tmpMonth + "/" + tmpDay
            }

            dateOfMessage = dateOfMessage ? <Text style={[styles.chat_date]}>
                {dateOfMessage}
            </Text> : null

        }

        const itemProps = {
            longPress: onMessageLongPress,
            hyperLinkClicked: onHyperLinkClicked,
            props,
            showCheckBox,
            date: momentDateOfMsg.format('HH:mm'),//tmpHours + ":" + tmpMinutes,
            isSelf: chat.data.userID == userId ? 'true' : '',
            // seen={
            //   totalMessage - index >= totalMessage - totalMessageRead &&
            //   chat.data.userID == userId
            //     ? (seen = "true")
            //     : (seen = "")
            // }
            text: !chat.data.contactID && !chat.data.image
                ? chat.data.message : "",

            imageURL: chat.data.image ? chat.data.image : "",
            image: imageMap[chat.data.userID],
            contactID: chat.data.contactID,
            contactName: chat.data.contactName
        }

        return <TouchableNativeFeedback
            key={chat.id}
            delete={
                chat.data["delete_" + userId] || chat.data["delete"]
                    ? true
                    : false
            }
            onPress={onSelectMessage}
            onLongPress={onMessageLongPress}
        >
            <View
                style={
                    tmpMultiSelect && isSelect ? styles.selected : styles.non_selected
                }
                key={chat.id}
            >
                {dateOfMessage}
                {chat.data.contactID ? (
                    <ChatContact
                        press={onPressContact}
                        {...itemProps}
                    />
                ) : (
                    <ChatText
                        {...itemProps}
                    />
                )}
            </View>
        </TouchableNativeFeedback>
    }, [isSelect, tmpMultiSelect])
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    chat_date: {
        textAlign: "center",
        fontSize: RFValue(10),
    },
    selected: {
        backgroundColor: "#BBD8B3",
    },
    non_selected: {},
})

export default ChatItem


