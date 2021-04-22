import React from 'react';
import { StyleSheet, TouchableNativeFeedback, View, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import Translate from "../../assets/Translates/Translate";

export default FooterAction = ({
    onPress, Logo, i18key
}) => {
    return React.useMemo(() => {
        return <TouchableNativeFeedback onPress={onPress}>
            <View style={styles.widget_box}>
                <Logo style={styles.widget_icon} resizeMode="contain" />
                <Text style={styles.footerText}>
                    {Translate.t(i18key)}
                </Text>
            </View>
        </TouchableNativeFeedback>
    }, [])
}

const styles = StyleSheet.create({
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
    footerText: { fontSize: RFValue(11) },
})