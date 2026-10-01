/**数值处理相关 */
export class NumberUtil {
    /**
     * 数值向下取整
     */
    public static toInt(num: number): number {
        return Math.floor(num);
    }

    /** 随机值，[min, max)*/
    public static getRandomNum(min: number, max: number): number {
        return min + Math.random() * (max - min);
    }

    /**随机整数 [min,max)*/
    public static getRandomInt(min: number, max: number): number {
        return Math.floor(min + Math.random() * (max - min));
    }

    /** 保留2位小数 */
    public static toFixedTwoDigit(value: number) {
        return parseFloat(value.toFixed(2));
    }

    /**
     * 显示完整数值，补0
     * num:源数据
     * len:需要的长度
     */
    public static toFitZero(num: number, len: number): string {
        let numStr = num.toString();
        if (numStr.length < len) {
            let need = len - numStr.length;
            for (let i = 0; i < need; i++) {
                numStr = "0" + numStr;
            }
        }
        return numStr;
    }

    // /** 随机值，[min, max)*/
    // public static getRandomNum(min: number, max: number): number {
    //     return min + Math.random() * (max - min);
    // }

}
