const navigationHelper = {
    gotoHomeStoreList: ({ props, url, images }) => {
        props.navigation.navigate("HomeStoreList", {
            url,
            images
        })
    }
}

export default navigationHelper