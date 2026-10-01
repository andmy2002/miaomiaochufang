export class TimeUtil {

    /** 获取现在到明天凌晨的秒数 */
    public static getSecUntilTomorrow() {
        console.log("隔天凌晨时间: ");
        let date = new Date();
        // 获取当前时间(毫秒数)
        let now = date.getTime();        
        // 去除当前时间的小时/分钟/秒
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        // 获取今天凌晨的时间(毫秒数)
        let earlyMorning = date.getTime();        
        // 获取距离明天的秒数
        return 60 * 60 * 24 - (now - earlyMorning) / 1000;
    }
}
