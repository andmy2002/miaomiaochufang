/**
 * 单例类父类
 */
export class Singleton {
    private static instance;
    public static getInstance<T>(): T {
        if (this.instance == null) {
            var Class: any = this;
            this.instance = new Class() as T;
        }
        return this.instance;
    }
    public static ins() {
        if (this.instance == null) {
            var Class: any = this;
            this.instance = new Class();
        }
        return this.instance;
    }

    public static createInstance() {
        if (this.instance == null) {
            var Class: any = this;
            this.instance = new Class();
            this.instance.init();
        }
    }

    public static destroyInstance() {
        if (this.instance != null) {
            this.instance.unInit();
            this.instance = null;
        }
    }

    public init() { };	//资源初始化		

    public unInit() { };	//资源释放
}
