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

const ChatItem = ({
    userId, parentProps, newChats, groupID, favIndex,

    day, onLongPressObjChanged, onShowPopUpChanged,
    redirectToChat, tmpMultiSelect, selectedChat, selects, setSelected,
    processOldChat, oldChats, findParams, request, showCheckBox, imageMap, setSelectMsg,

    previousMessageDateElse, updateChats, item
}) => {

    let chat = item
    let isSelected = selects.find(el => el?.id == chat?.id) ? true : false

    let created = chat.data.createdAt;
    let date = created.split(":");
    let tmpDay = date[2].length > 1 ? date[2] : '0' + date[2]; //message created at

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
                    props.navigation.navigate("HomeStoreList", {
                        url: apiUrl,
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
            setSelectMsg(chat, isSelect)
            setIsSelect(!isSelect)
        }
    }

    return useMemo(() => {
        let props = parentProps
        try {
            let tStamps = chat.data.timeStamp.toDate();
            created = moment(tStamps).tz(myTimeZone).format('YYYY:MM:DD:HH:mm:ss');
        } catch (e) {
            console.log('ERROR', e);
        }

        // let date = chat.data.createdAt.split(":");

        let tmpMonth = date[1].length > 1 ? date[1] : '0' + date[1];
        let tmpHours = date[3].length > 1 ? date[3] : '0' + date[3];
        let tmpMinutes = date[4].length > 1 ? date[4] : '0' + date[4];
        // let tmpMessageID = messageID.filter((item) => {
        //     return item == chat.id;
        // });

        let dateOfMessage = null

        if (chat.first) {
            if (tmpDay == day) {
                dateOfMessage = Translate.t("today")
            } else if (tmpDay == day - 1) {
                dateOfMessage = Translate.t("yesterday")
            } else if (previousMessageDateElse ==
                chat.data.timeStamp.toDate().toDateString()) {
                dateOfMessage = tmpMonth + "/" + tmpDay
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
            date: tmpHours + ":" + tmpMinutes,
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
                {/*///////////////////////////////////////*/}
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
                {/*///////////////////////////////////////*/}
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

