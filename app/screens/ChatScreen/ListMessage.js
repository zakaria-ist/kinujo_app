import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {
    StyleSheet,
    // FlatList,
    SectionList
} from "react-native";

import { Colors } from "../../assets/Colors.js";
import { LinearGradient } from "expo-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import ChatItem from "./ChatItem.js";

const ListMessage = forwardRef((props, ref) => {
    const { newChats, groupID, favIndex, selects } = props
    const scrollViewReference = useRef();

    const scrollToEnd = () => {
        scrollViewReference.current.scrollToLocation({
            sectionIndex: 0,
            itemIndex: 0,
            viewPosition: 0,
            // viewOffset: 1000,
            animated: true,
        });
    }

    const onScrollToIndexFailed = (error) => {
        scrollViewReference.current.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
        setTimeout(() => {
            if (newChats.length !== 0 && scrollViewReference.current !== null) {
                scrollViewReference.current.scrollToLocation({
                    sectionIndex: 0,
                    viewPosition: 0, itemIndex: error.index, animated: true
                });
            }
        }, 100);
    }

    const onEndReached = () => {
        if (favIndex != undefined && favIndex != null && favIndex != -1) {
            setTimeout(() => {
                if (scrollViewReference) {
                    scrollViewReference.current.scrollToOffset({
                        animated: true,
                        sectionIndex: 0,
                        viewPosition: 0, itemIndex: favIndex
                    });
                }
            }, 300);
        }
    }

    useImperativeHandle(ref, () => ({
        scrollToEnd
    }));

    const renderItem = ({ item, index }) => {
        return <ChatItem
            item={item}
            {...props}
        />
    }

    return <LinearGradient
        colors={[Colors.E4DBC0, Colors.C2A059]}
        start={[0, 0]}
        end={[1, 0.6]}
        style={styles.container}
    >
        {/* <FlatList
            ref={scrollViewReference}
            data={newChats}
            extraData={newChats}
            renderItem={renderItem}
            onContentSizeChange={scrollToEnd}
            keyExtractor={chat => groupID + "_chat_" + chat.id}
            onScrollToIndexFailed={onScrollToIndexFailed}
            onEndReached={onEndReached}
        /> */}

        <SectionList
            ref={scrollViewReference}
            inverted
            extraData={selects.length}
            sections={[{
                title: '',
                data: newChats
            }]}
            onEndReached={onEndReached}
            renderItem={renderItem}
            onScrollToIndexFailed={onScrollToIndexFailed}
            keyExtractor={chat => groupID + "_chat_" + chat.id}
        />
    </LinearGradient>
})

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

export default ListMessage