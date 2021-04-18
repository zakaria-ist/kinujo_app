const imageHelper = {
    getOriginalImage: (imageUrl = '') => {
       try {
            return imageUrl.split('?')[0]
        } catch (error) {
            return imageUrl
        }
    }
}

export default imageHelper