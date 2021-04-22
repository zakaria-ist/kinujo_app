import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import EmojiBoard from "react-native-emoji-board";
import {
    heightPercentageToDP,
} from "react-native-responsive-screen";
const numOfColumn = parseInt(heightPercentageToDP("30%") / 60)

const EmojiKeyboard = ({
    showEmoji,
    onClick,
    onRemove,
    messages
}) => {
    return useMemo(() => {
        return <EmojiBoard
            numCols={numOfColumn}
            showBoard={showEmoji}
            style={styles.emoji}
            containerStyle={styles.containerEmoji}
            onClick={onClick}
            onRemove={onRemove}
        />
    }, [showEmoji, messages])
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    emoji: {
        height: heightPercentageToDP("50%"),
        marginBottom: heightPercentageToDP("10%"),
    },
    containerEmoji: {
        height: heightPercentageToDP("30%"),
    }
})

export default EmojiKeyboard