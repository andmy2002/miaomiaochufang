/******  配置类  ******/
export class nick {
    /******  昵称  ******/
    public nick: string;
}
export class attr {
    /******  狗的初始属性及各个时期成长值  ******/
    public prop: string;
    /******  勇气  ******/
    public yq: number;
    /******  智慧  ******/
    public zh: number;
    /******  魅力  ******/
    public ml: number;
}
export class exp {
    /******  亲密度（等级）  ******/
    public lv: number;
    /******  升级所需亲密值（经验）  ******/
    public exp: number;
}
export class task {
    /******  日常任务  ******/
    public id: number;

    public type: number;

    public name: string;

    public explain: string;

    public maxNum: number;

    public unit: string;

    public reason: number;

    public gold: number;

    public img: string;

    public overNum: number;

    public isGet: number;
}
export class consume {
    /******  狗消耗  ******/
    public feedid: number;

    public type: number;

    public titleLabel: string;

    public sourceImg: string;

    public typeImg: string;

    public descr: string;

    public delAttr: string;

    public reward: string;
}
export class fuli_day {
    /******  福利-每日签到  ******/
    public day: number;

    public reward: number;

    public status: number;
}
export class fuli_watch {
    /******  福利-每日观看  ******/
    public day: number;

    public times: string;

    public reward: number;

    public status: number;
}
