import { BaseView } from "../../lightMVC/core/base/BaseView";
/**
 * 单例基类
 * @author chenk <hzzhewu@163.com>
 * @date 2016/10/11
 */
export class SingleClass extends BaseView{
   
    /**
     * 获取一个单例
     */
    public static getInstance(): any {
        var Class: any = this;
        if(Class.instance == null) {
            Class.instance = new Class();
        }
        return Class.instance;
    }
}
