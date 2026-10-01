
export enum Sex {
    None = 0,
    Boy = 1,
    Girl = 2,
}
export enum EPlay {
    ShuMao = 0,
    FeiPan = 1,
    CaiGuTou = 2,
}
export enum ERewardType {
    Icon = 0,//金币
    Feed = 1,//喂食
    Clear = 2,//清洁
    Active = 3,//活力
    QingMi = 4,//亲密
}
export enum dogStatus {
    None = 0,
    Feed = 1,//喂食
    Play = 3,//玩耍
    Clear = 2,//清理
}
export enum CommunicationType {
    Water = 1,//喂水
    GouLiang = 2,//狗粮
    GuanTou = 3,//罐头
    Bone = 4,//骨头
    ShuBao = 10,//梳毛
    FeiPan = 11,//接飞盘
    PlayBon = 13,//玩骨头
    FeiZhao = 5,//肥皂
    XiangZhao = 6,//香皂
    XiangBo = 7,//香波
    ShunMaoGao = 8,//顺毛膏
}

/** 年龄段 */
export enum EAgeGroup {
    /**幼年阶段 */
    PERIOD_KIDS = 1,
    /**青春期阶段 */
    PERIOD_YOUNG = 2,
    /**成年阶段 */
    PERIOD_GROWNUP = 3
}

/** 消耗 */
export enum EConsume {
    /**属性：金币 */
    Attr_coin = 1,
    /**属性：经验,亲密度 */
    Attr_jingyan = 101,
    /**属性：勇敢 */
    Attr_yonggan = 102,
    /**属性：智慧或聪明 */
    Attr_congming = 103,
    /**属性：魅力 */
    Attr_meili = 104,
    /**属性：体力或者饥饿 */
    Attr_tili = 201,
    /**属性：心情 */
    Attr_xinqing = 202,
    /**属性：卫生或清洁 */
    Attr_weisheng = 203,
    /**属性：屎 */
    Attr_shi = 301
}

// /**1 心情值降低 */
// public static readonly DOG_OUT_EVENT_SAD: number = 1;
// /**2 丢失金币 */
// public static readonly DOG_OUT_EVENT_LOST_MONEY: number = 2;
// /**3 心情值增加 */
// public static readonly DOG_OUT_EVENT_HAPPY: number = 3;
// /**4 获得金币 */
// public static readonly DOG_OUT_EVENT_GAIN_MONEY: number = 4;

/** 任务ID */
export enum ETaskID {
    WeiShi = 27,//喂食
    QingJie = 28,//清洁
    WanShua = 29,//玩耍
    WaiChu = 30,//外出
    LeiJiXiaoHao = 31,//累计消耗
    ZhongJiJiangLi = 32//终极奖励
}
export enum ETaskStatus {
    None = 0,
    GOTO = 1,//前往
    Reward = 2,//领取
    Finish = 3,//完成
}

/** 配置表中的属性字段 */
export enum EConfigAttrProp {
    cq_attr,
    cq_childhood,
    cq_youth,
    cq_adulthood,
}