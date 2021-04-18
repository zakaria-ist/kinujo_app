import React, { useMemo, useState } from 'react';
import FastImage from 'react-native-fast-image';
import { SliderBox } from 'react-native-image-slider-box';
import _ from 'lodash'

let prevImages = null
export default MySliderBox = React.memo((props) => {

    const { images, width } = props

    const [isChangeImage, onChangeImage] = useState(true)

    if (prevImages) {
        if (_.difference(images, prevImages).length) {
            onChangeImage(!isChangeImage)
            prevImages = images
        }
    }

    return useMemo(() => {
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
    }, [isChangeImage])
})