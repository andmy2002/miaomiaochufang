/**
 * 游戏数据
 * @author chenk <hzzhewu@163.com>
 * @date 2018/8/25
 */
class GameInfo {



}

/**狗狗类型 */
export enum dogType {
    s_hsq,
    m_hsq,
    l_hsq,
    s_jm,
    m_jm,
    l_jm,
    s_td,
    m_td,
    l_td,
    //------add 柴犬
    s_cq,   //小
    m_cq,   //中1
    b_cq    //中2

}

/**狗狗动作 */
enum dogAct {
    baobao,
    chifan,
    daiji,
    jiepanzi,
    meijiezhong,
    shumao1,
    shumao2,
    shumao3,
    xizao,
    zang,
    e,
    shangxin
}

/**狗狗吃饭类型 */
enum ChifanType {
    shui,
    gouliang,
    guantou,
    gutou
}

/**洗澡类型 */
enum XizaoType {
    feizao,
    xiangzao,
    muyulu,
    shunmaogao
}

/**属性类型 */
enum ATType {
    jinbi,
    tili,
    qingjie

}

/**日常任务类型 */
enum DailyTaskID {
    jinbixiaohao = 26,
    weishi,
    qingjie,
    wanshua,
    songli = 30,
    waichu,
    zengsongjinbi,
    haoyouzhuli,
    huifuzhuangtai,
    bimei = 35,
    zhongjidajiang = 37
}




