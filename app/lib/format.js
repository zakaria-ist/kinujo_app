// const base = "kinujo-develop.c2sg.asia";
const base = "kinujo-release.c2sg.asia";
// const base = "http://192.168.0.107:8000";
let api = "https://" + base + "/api/";
let httpApi = "http://" + base + "/api/";

class Format {
    separator(number){
        if(number){
            number = parseFloat(number).toFixed(0);
            return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return number;
    }
}

export default Format;
