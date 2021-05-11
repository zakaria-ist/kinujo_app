const commonHelper = {
    compare2arr: function (dateA, dateB) {
        try {
            let arr1 = dateA.split(':')
            let arr2 = dateB.split(':')

            for (let i = 0; i < arr1.length; i++) {
                if (+arr1[i] != +arr2[i]) {
                    return +arr1[i] > +arr2[i] ? -1 : 1
                }
            }
        } catch (error) {

        }

        return 0
    }
}

export default commonHelper
