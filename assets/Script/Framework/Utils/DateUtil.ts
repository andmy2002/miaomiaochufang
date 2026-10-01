export class DateUtil {

    /** 获取年月日  2020/8/3*/
    public static getYearMonthDay() {
        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();
        return year + "/" + month + "/" + day;
    }
}
