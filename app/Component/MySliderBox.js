import React, { useMemo, useState } from 'react';
import FastImage from 'react-native-fast-image';
import { SliderBox } from 'react-native-image-slider-box';

function arr_diff (a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}

export default MySliderBox = React.memo((props) => {

    const { images, width } = props;
    return <SliderBox
        ImageComponent={FastImage}
        images={images}
        sliderBoxHeight={width / 1.4 + 20}
        parentWidth={width - 30}
        onCurrentImagePressed={(index) =>
            console.warn(`image ${index} pressed`)
        }
        dotColor="#D8CDA7"
        inactiveDotColor="#90A4AE"
        resizeMethod={"resize"}
        resizeMode={"cover"}
        autoplay={true}
        circleLoop={true}
        paginationBoxStyle={{
            position: "absolute",
            bottom: 0,
            padding: 0,
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "center",
            marginBottom: -60,
        }}
    />
}, (prevProps, nextProps) => {
    return  !arr_diff(prevProps.images, nextProps.images).length
})