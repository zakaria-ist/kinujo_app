import React from 'react';

import moment from 'moment';
import * as Localization from "expo-localization";
const myTimeZone = Localization.timezone

const ChatItem = ({
    item, userId
}) => {

    let chat = item["item"];
    let created = chat.data.createdAt;
    try {
        let tStamps = chat.data.timeStamp.toDate();
        created = moment(tStamps).tz(myTimeZone).format('YYYY:MM:DD:HH:mm:ss');
    } catch (e) {
        console.log('ERROR', e);
    }

    // let date = chat.data.createdAt.split(":");
    let date = created.split(":");
    let tmpMonth = date[1].length > 1 ? date[1] : '0' + date[1];
    let tmpDay = date[2].length > 1 ? date[2] : '0' + date[2]; //message created at
    let tmpHours = date[3].length > 1 ? date[3] : '0' + date[3];
    let tmpMinutes = date[4].length > 1 ? date[4] : '0' + date[4];
    // let tmpMessageID = messageID.filter((item) => {
    //     return item == chat.id;
    // });


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


    if (tmpDay == day) {
        return (
            <TouchableNativeFeedback
                key={chat.id}
                delete={
                    chat.data["delete_" + userId] || chat.data["delete"]
                        ? true
                        : false
                }
                onPress={() => {
                    if (tmpMultiSelect) {
                        if (selectedChat(chat.id)) {
                            selects = selects.filter((select) => {
                                return select.id != chat.id;
                            });
                        } else {
                            selects.push({
                                id: chat.id,
                                message: chat.data.message,
                                contactID: chat.data.contactID,
                                contactName: chat.data.contactName,
                                image: chat.data.image
                            });
                        }
                        processOldChat(oldChats);
                    }
                }}
                onLongPress={() => {
                    onLongPressObjChanged({
                        id: chat.id,
                        message: chat.data.message,
                        data: chat.data,
                        contactID: chat.data.contactID,
                        contactName: chat.data.contactName,
                        image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                }}
            >
                <View
                    style={
                        selectedChat(chat.id) ? styles.selected : styles.non_selected
                    }
                    key={chat.id}
                >
                    {chat.first ? (
                        <Text style={[styles.chat_date]}>{Translate.t("today")}</Text>
                    ) : (
                        <Text style={[styles.chat_date]}>{""}</Text>
                    )}
                    {/*///////////////////////////////////////*/}
                    {chat.data.contactID ? (
                        <ChatContact
                            press={() => {
                                if (!tmpMultiSelect) {
                                    redirectToChat(
                                        chat.data.contactID,
                                        chat.data.contactName
                                    );
                                } else {
                                    console.log("1");
                                    if (selectedChat(chat.id)) {
                                        selects = selects.filter((select) => {
                                            return select.id != chat.id;
                                        });
                                    } else {
                                        selects.push({
                                            id: chat.id,
                                            message: chat.data.message,
                                            contactID: chat.data.contactID,
                                            contactName: chat.data.contactName,
                                            image: chat.data.image
                                        });
                                    }
                                    processOldChat(oldChats);
                                }
                            }}
                            longPress={() => {
                                onLongPressObjChanged({
                                    id: chat.id,
                                    message: chat.data.message,
                                    data: chat.data,
                                    contactID: chat.data.contactID,
                                    contactName: chat.data.contactName,
                                    image: chat.data.image
                                });
                                onShowPopUpChanged(true);
                            }}
                            showCheckBox={showCheckBox}
                            props={props}
                            date={tmpHours + ":" + tmpMinutes}
                            isSelf={
                                chat.data.userID == userId
                                    ? (isSelf = "true")
                                    : (isSelf = "")
                            }
                            // seen={
                            //   totalMessage - index >= totalMessage - totalMessageRead &&
                            //   chat.data.userID == userId
                            //     ? (seen = "true")
                            //     : (seen = "")
                            // }
                            contactID={chat.data.contactID}
                            contactName={chat.data.contactName}
                            image={imageMap[chat.data.userID]}
                        />
                    ) : (
                        <ChatText
                            longPress={() => {
                                onLongPressObjChanged({
                                    id: chat.id,
                                    message: chat.data.message,
                                    data: chat.data,
                                    contactID: chat.data.contactID,
                                    contactName: chat.data.contactName,
                                    image: chat.data.image
                                });
                                onShowPopUpChanged(true);
                            }}
                            hyperLinkClicked={(url, text) => {
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
                            }}
                            props={props}
                            showCheckBox={showCheckBox}
                            date={tmpHours + ":" + tmpMinutes}
                            isSelf={
                                chat.data.userID == userId
                                    ? (isSelf = "true")
                                    : (isSelf = "")
                            }
                            // seen={
                            //   totalMessage - index >= totalMessage - totalMessageRead &&
                            //   chat.data.userID == userId
                            //     ? (seen = "true")
                            //     : (seen = "")
                            // }
                            text={
                                chat.data.contactID == null && chat.data.image == null
                                    ? chat.data.message
                                    : ""
                            }
                            imageURL={chat.data.image ? chat.data.image : ""}
                            image={imageMap[chat.data.userID]}
                        />
                    )}
                    {/*///////////////////////////////////////*/}
                </View>
            </TouchableNativeFeedback>
        );
        previousMessageDateToday = tmpDay;
    } else if (tmpDay == day - 1) {
        return (
            <TouchableNativeFeedback
                key={chat.id}
                delete={
                    chat.data["delete_" + userId] || chat.data["delete"]
                        ? true
                        : false
                }
                onPress={() => {
                    if (tmpMultiSelect) {
                        if (selectedChat(chat.id)) {
                            selects = selects.filter((select) => {
                                return select.id != chat.id;
                            });
                        } else {
                            selects.push({
                                id: chat.id,
                                message: chat.data.message,
                                contactID: chat.data.contactID,
                                contactName: chat.data.contactName,
                                image: chat.data.image
                            });
                        }
                        updateChats(newChats);
                        processOldChat(oldChats);
                    }
                }}
                onLongPress={() => {
                    onLongPressObjChanged({
                        id: chat.id,
                        message: chat.data.message,
                        data: chat.data,
                        contactID: chat.data.contactID,
                        contactName: chat.data.contactName,
                        image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                }}
            >
                <View
                    style={
                        selectedChat(chat.id) ? styles.selected : styles.non_selected
                    }
                    key={chat.id}
                >
                    {chat.first ? (
                        <Text style={[styles.chat_date]}>
                            {Translate.t("yesterday")}
                        </Text>
                    ) : (
                        <Text style={[styles.chat_date]}>{""}</Text>
                    )}
                    {/*///////////////////////////////////////*/}
                    {chat.data.contactID ? (
                        <ChatContact
                            press={() => {
                                if (!tmpMultiSelect) {
                                    redirectToChat(
                                        chat.data.contactID,
                                        chat.data.contactName
                                    );
                                } else {
                                    if (selectedChat(chat.id)) {
                                        selects = selects.filter((select) => {
                                            return select.id != chat.id;
                                        });
                                    } else {
                                        selects.push({
                                            id: chat.id,
                                            message: chat.data.message,
                                            contactID: chat.data.contactID,
                                            contactName: chat.data.contactName,
                                            image: chat.data.image
                                        });
                                        updateChats(newChats);
                                    }
                                    processOldChat(oldChats);
                                }
                            }}
                            longPress={() => {
                                onLongPressObjChanged({
                                    id: chat.id,
                                    message: chat.data.message,
                                    data: chat.data,
                                    contactID: chat.data.contactID,
                                    contactName: chat.data.contactName,
                                    image: chat.data.image
                                });
                                onShowPopUpChanged(true);
                            }}
                            hyperLinkClicked={(url, text) => {
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
                            }}
                            showCheckBox={showCheckBox}
                            props={props}
                            date={tmpHours + ":" + tmpMinutes}
                            isSelf={
                                chat.data.userID == userId
                                    ? (isSelf = "true")
                                    : (isSelf = "")
                            }
                            // seen={
                            //   totalMessage - index >= totalMessage - totalMessageRead &&
                            //   chat.data.userID == userId
                            //     ? (seen = "true")
                            //     : (seen = "")
                            // }
                            contactID={chat.data.contactID}
                            contactName={chat.data.contactName}
                            image={imageMap[chat.data.userID]}
                        />
                    ) : (
                        <ChatText
                            longPress={() => {
                                onLongPressObjChanged({
                                    id: chat.id,
                                    message: chat.data.message,
                                    data: chat.data,
                                    contactID: chat.data.contactID,
                                    contactName: chat.data.contactName,
                                    image: chat.data.image
                                });
                                onShowPopUpChanged(true);
                            }}
                            hyperLinkClicked={(url, text) => {
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
                            }}
                            props={props}
                            showCheckBox={showCheckBox}
                            date={tmpHours + ":" + tmpMinutes}
                            isSelf={
                                chat.data.userID == userId
                                    ? (isSelf = "true")
                                    : (isSelf = "")
                            }
                            // seen={
                            //   totalMessage - index >= totalMessage - totalMessageRead &&
                            //   chat.data.userID == userId
                            //     ? (seen = "true")
                            //     : (seen = "")
                            // }
                            text={
                                chat.data.contactID == null && chat.data.image == null
                                    ? chat.data.message
                                    : ""
                            }
                            imageURL={chat.data.image ? chat.data.image : ""}
                            image={imageMap[chat.data.userID]}
                        />
                    )}
                    {/*///////////////////////////////////////*/}
                </View>
            </TouchableNativeFeedback>
        );
        previousMessageDateYesterday = tmpDay;
    } else if (tmpDay != day && tmpDay != day - 1) {
        return (
            <TouchableNativeFeedback
                key={chat.id}
                delete={
                    chat.data["delete_" + userId] || chat.data["delete"]
                        ? true
                        : false
                }
                onPress={() => {
                    if (multiSelect) {
                        if (selectedChat(chat.id)) {
                            selects = selects.filter((select) => {
                                return select.id != chat.id;
                            });
                        } else {
                            selects.push({
                                id: chat.id,
                                message: chat.data.message,
                                contactID: chat.data.contactID,
                                contactName: chat.data.contactName,
                                image: chat.data.image
                            });
                        }
                        updateChats(newChats);
                        onShowPopUpChanged(false);
                    }
                }}
                onLongPress={() => {
                    onLongPressObjChanged({
                        id: chat.id,
                        message: chat.data.message,
                        data: chat.data,
                        contactID: chat.data.contactID,
                        contactName: chat.data.contactName,
                        image: chat.data.image
                    });
                    onShowPopUpChanged(true);
                }}
            >
                <View
                    style={
                        selectedChat(chat.id) ? styles.selected : styles.non_selected
                    }
                    key={chat.id}
                >
                    {!chat.first ? (
                        <Text style={[styles.chat_date]}>{""}</Text>
                    ) : (
                        <Text style={[styles.chat_date]}>
                            {tmpMonth + "/" + tmpDay}
                        </Text>
                    )}
                    {/*///////////////////////////////////////*/}
                    {chat.data.contactID ? (
                        <ChatContact
                            press={() => {
                                console.log("ERE");
                                if (!tmpMultiSelect) {
                                    redirectToChat(
                                        chat.data.contactID,
                                        chat.data.contactName
                                    );
                                } else {
                                    if (selectedChat(chat.id)) {
                                        selects = selects.filter((select) => {
                                            return select.id != chat.id;
                                        });
                                    } else {
                                        selects.push({
                                            id: chat.id,
                                            message: chat.data.message,
                                            contactID: chat.data.contactID,
                                            contactName: chat.data.contactName,
                                            image: chat.data.image
                                        });
                                        console.log(selects.length)
                                    }
                                }
                            }}
                            longPress={() => {
                                onLongPressObjChanged({
                                    id: chat.id,
                                    message: chat.data.message,
                                    data: chat.data,
                                    contactID: chat.data.contactID,
                                    contactName: chat.data.contactName,
                                    image: chat.data.image
                                });
                                onShowPopUpChanged(true);
                            }}
                            showCheckBox={showCheckBox}
                            props={props}
                            date={tmpHours + ":" + tmpMinutes}
                            isSelf={
                                chat.data.userID == userId
                                    ? (isSelf = "true")
                                    : (isSelf = "")
                            }
                            // seen={
                            //   totalMessage - index >= totalMessage - totalMessageRead &&
                            //   chat.data.userID == userId
                            //     ? (seen = "true")
                            //     : (seen = "")
                            // }
                            contactID={chat.data.contactID}
                            contactName={chat.data.contactName}
                            image={imageMap[chat.data.userID]}
                        />
                    ) : (
                        <ChatText
                            longPress={() => {
                                onLongPressObjChanged({
                                    id: chat.id,
                                    message: chat.data.message,
                                    data: chat.data,
                                    contactID: chat.data.contactID,
                                    contactName: chat.data.contactName,
                                    image: chat.data.image
                                });
                                onShowPopUpChanged(true);
                            }}
                            hyperLinkClicked={(url, text) => {
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
                            }}
                            props={props}
                            showCheckBox={showCheckBox}
                            date={tmpHours + ":" + tmpMinutes}
                            isSelf={
                                chat.data.userID == userId
                                    ? (isSelf = "true")
                                    : (isSelf = "")
                            }
                            // seen={
                            //   totalMessage - index >= totalMessage - totalMessageRead &&
                            //   chat.data.userID == userId
                            //     ? (seen = "true")
                            //     : (seen = "")
                            // }
                            text={
                                chat.data.contactID == null && chat.data.image == null
                                    ? chat.data.message
                                    : ""
                            }
                            imageURL={chat.data.image ? chat.data.image : ""}
                            image={imageMap[chat.data.userID]}
                        />
                    )}
                    {/*///////////////////////////////////////*/}
                </View>
            </TouchableNativeFeedback>
        );

        previousMessageDateElse = chat.data.timeStamp.toDate().toDateString();
    }
}

export default ChatItem

