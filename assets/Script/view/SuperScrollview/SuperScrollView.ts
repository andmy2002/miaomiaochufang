import * as cc from "cc";
import { UITransform, UIOpacity } from "cc";


import SuperListItem from "./SuperListItem";


import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class SuperScrollView extends cc.ScrollView {

    @property({
        type: cc.Node,
        tooltip: 'item模板',
    })
    pfItemTemplate: cc.Node = null;

    itemSize: cc.Size = null;

    /** 3.x 已移除 NodePool，这里保留一个简单的预制节点缓存。 */
    itemNodePool: cc.Node[] = [];

    @property({
        tooltip: '分帧加载时间间隔',
    })
    duration: number = 1;

    // @property({
    //     tooltip: '最多可以显示多少个Item',
    // })
    visibleNum: number = 7;

    private curIndex: number = 0;
    private itemInfoList: any[] = [];

    private isFrameLoading: boolean = false;
    private isLoadingFinished: boolean = true;

    private cbAfterSetData: Function = null;

    private lastTime: number = 0;

    /** 旧版预制体的 ScrollView 属性名与 Creator 3.x 不同；节点层级仍保留。 */
    private restoreReferences(): boolean {
        if (!this.content) {
            const view = this.node.getChildByName('view');
            const content = view?.getChildByName('contant') || view?.getChildByName('content');
            if (content) this.content = content;
        }
        if (!this.pfItemTemplate) {
            this.pfItemTemplate = this.node.parent?.getChildByName('item') || null;
        }
        return !!this.content && !!this.pfItemTemplate;
    }

    onLoad() {
        this.elastic = true;
        if (!this.restoreReferences()) {
            console.warn(`[SuperScrollView] ${this.node.name} 缺少 Content 或 Item Template 引用，已跳过列表初始化。`);
            return;
        }
        this.content.on(cc.Node.EventType.CHILD_ADDED, this.childAdded, this);
        this.node.on("touchend", this.onTouchEnd, this);
        this.node.on("scroll-ended", this.onScrollEnded, this);
        this.node.on("scrolling", this.onScrolling, this);
        this.node.on("bounce-top", this.onBounceTop, this);
        this.node.on("bounce-bottom", this.onBounceBottom, this);
        this.node.on("bounce-left", this.onBounceLeft, this);
        this.node.on("bounce-right", this.onBounceRight, this);

        this.initNodePool();

    }

    onDestroy() {
        if (this.content && cc.isValid(this.content)) {
            this.content.off(cc.Node.EventType.CHILD_ADDED, this.childAdded, this);
        }
        if (cc.isValid(this.node)) {
            this.node.off("touchend", this.onTouchEnd, this);
            this.node.off("scroll-ended", this.onScrollEnded, this);
            this.node.off("scrolling", this.onScrolling, this);
            this.node.off("bounce-top", this.onBounceTop, this);
            this.node.off("bounce-bottom", this.onBounceBottom, this);
            this.node.off("bounce-left", this.onBounceLeft, this);
            this.node.off("bounce-right", this.onBounceRight, this);
        }
    }

    private initNodePool() {
        let itemNode = cc.instantiate(this.pfItemTemplate);
        let contentSize = itemNode.getComponent(UITransform).contentSize;
        this.itemSize = contentSize;

        let parentSize = this.content.parent.getComponent(UITransform).contentSize;
        let layoutComp = this.content.getComponent(cc.Layout);
        let num = 0;
        if (layoutComp) {
            if (layoutComp.type === cc.Layout.Type.VERTICAL && this.vertical && !this.horizontal) {
                num = Math.ceil(parentSize.height / contentSize.height);
            } else if (layoutComp.type === cc.Layout.Type.HORIZONTAL && this.horizontal && this.vertical) {
                num = Math.ceil(parentSize.width / contentSize.width);
            } else if (layoutComp.type === cc.Layout.Type.GRID) {
                let rowEleCount = Math.floor((parentSize.width - layoutComp.paddingLeft - layoutComp.paddingRight + layoutComp.spacingX) / (contentSize.width + layoutComp.spacingX))
                let colEleCount = Math.floor((parentSize.height - layoutComp.paddingTop - layoutComp.paddingBottom + layoutComp.spacingY) / (contentSize.height + layoutComp.spacingY))
                num = rowEleCount * colEleCount;
                // console.log('最多显示个数:GRID', rowEleCount, colEleCount);
            }
        }
        this.visibleNum = Math.floor(num * 2) + 2;
        this.itemNodePool.length = 0;

        //多放3个
        for (let i = 0; i < this.visibleNum + 3; i++) {
            let itemNode = cc.instantiate(this.pfItemTemplate);
            this.itemNodePool.push(itemNode);
        }
    }

    //添加节点
    private childAdded(itemNode: cc.Node) {
        this.curIndex++;
        itemNode.name = "item" + this.curIndex;
    }

    public scrollToIndex(index: number, seconds: number = 0.2) {
        // cc.log("index:", index);
        let childCount = this.content.children.length;
        // cc.log("childCount:", childCount);
        if (index < 1) {
            // cc.log("index 过小");
            index = 1;
        }
        else if (index > childCount) {
            // cc.log("index 过大");
            index = childCount;
        }

        let item = this.content.getChildByName('item' + index);
        if (item) {
            let layoutComp: cc.Layout = this.content.getComponent(cc.Layout);
            if (layoutComp) {
                if (layoutComp.type === cc.Layout.Type.VERTICAL && this.vertical && !this.horizontal) {
                    this.scrollToPercentVertical((childCount - index) / childCount, seconds);
                } else if (layoutComp.type === cc.Layout.Type.HORIZONTAL && !this.vertical && this.horizontal) {
                    this.scrollToPercentHorizontal((childCount - index) / childCount, seconds, true);
                } else if (layoutComp.type === cc.Layout.Type.GRID) {
                    if (layoutComp.startAxis === cc.Layout.AxisDirection.HORIZONTAL) {
                        let contentSize = this.content.getComponent(UITransform).contentSize;
                        let itemContentSize = item.getComponent(UITransform).contentSize;
                        // contentSize.width = layoutComp.paddingLeft + layoutComp.paddingRight + itemContentSize.width * n + layoutComp.spacingX *(n-1)
                        let rowEleCount = Math.floor((contentSize.width - layoutComp.paddingLeft - layoutComp.paddingRight + layoutComp.spacingX) / (itemContentSize.width + layoutComp.spacingX))
                        // cc.log("每行多少个：", rowEleCount);

                        let hang = Math.ceil(index / rowEleCount);
                        let totalHang = Math.ceil(childCount / rowEleCount);
                        this.scrollToPercentVertical((totalHang - hang) / totalHang, seconds);
                    } else {
                        let contentSize = this.content.getComponent(UITransform).contentSize;
                        let itemContentSize = item.getComponent(UITransform).contentSize;

                        let colEleCount = Math.floor((contentSize.height - layoutComp.paddingTop - layoutComp.paddingBottom + layoutComp.spacingY) / (itemContentSize.height + layoutComp.spacingY))
                        // cc.log("每列多少个：", colEleCount);

                        let lie = Math.ceil(index / colEleCount);
                        let totalLie = Math.ceil(childCount / colEleCount);
                        this.scrollToPercentHorizontal((totalLie - lie) / totalLie, seconds, true);
                    }

                } else {
                    // cc.log("cc.Layout.Type不对");
                }
            }
        }
    }

    private onTouchEnd() {
        return;
        this.improveDC();
    }

    private onScrollEnded() {
        // cc.log("onScrollEnded");
        this.improveDC();
    }

    private onScrolling() {
        let now = Date.now();
        if (now - this.lastTime < 200) {
            return;
        }
        // cc.log("scolling");
        this.lastTime = now;

        let scrollOffset = this.getScrollOffset();

        let offsetX = scrollOffset.x;
        let offsetY = scrollOffset.y;

        this.improveDC();
    }

    private onBounceTop() {
        // cc.log("onBounceTop")
    }

    private onBounceBottom() {
        // cc.log("onBounceBottom")
    }

    private onBounceLeft() {
        // cc.log("onBounceLeft")
    }

    private onBounceRight() {
        // cc.log("onBounceLeft")
    }

    private newItemNode(): cc.Node {
        // let itemNode = this.itemNodePool.pop();
        // if (!itemNode) {
        //     cc.log("instantiate");
        //     itemNode = cc.instantiate(this.pfItemTemplate);
        // }
        let itemNode = cc.instantiate(this.pfItemTemplate);
        return itemNode;
    }

    // 优化DrawCall
    public improveDC() {
        if (this.content.children.length == 0) {
            return;
        }

        const scrollTransform = this.node.getComponent(UITransform);
        const svLeftBottomPoint = scrollTransform.convertToWorldSpaceAR(new cc.Vec3(
            -scrollTransform.anchorX * scrollTransform.width,
            -scrollTransform.anchorY * scrollTransform.height,
            0,
        ));

        // 求出 ScrollView 可视区域在世界坐标系中的矩形（碰撞盒）
        const svBBoxRect = cc.rect(svLeftBottomPoint.x, svLeftBottomPoint.y, scrollTransform.width, scrollTransform.height);

        // 遍历 ScrollView Content 内容节点的子节点，对每个子节点的包围盒做和 ScrollView 可视区域包围盒做碰撞判断
        this.content.children.forEach((childNode: cc.Node) => {
            // 如果相交了，那么就显示，否则就隐藏
            const childNodeBBox = childNode.getComponent(UITransform).getBoundingBoxToWorld();
            const opacity = childNode.getComponent(UIOpacity) || childNode.addComponent(UIOpacity);
            if (childNodeBBox.intersects(svBBoxRect)) {
                if (opacity.opacity === 0) {
                    opacity.opacity = 255;
                }

            } else {
                if (opacity.opacity !== 0) {
                    opacity.opacity = 0;
                }
            }
        });
    }

    public async setData(itemInfoList: any[], isFrameLoading: boolean = false, cb?: Function) {
        if (!this.restoreReferences()) {
            console.warn(`[SuperScrollView] ${this.node.name} 的序列化引用尚未迁移完成，未创建列表项。`);
            this.isLoadingFinished = true;
            return;
        }
        if (!this.isLoadingFinished) {
            return;
        }

        this.curIndex = 0;
        this.isLoadingFinished = false;
        this.isFrameLoading = isFrameLoading;
        this.itemInfoList = itemInfoList;
        this.cbAfterSetData = cb;

        this.content.destroyAllChildren();
        if (this.isFrameLoading) {
            await this.executePreFrame(this.getItemGenerator(this.itemInfoList.length), this.duration);
        } else {
            for (let i = 0; i < this.itemInfoList.length; i++) {
                let item = this.newItemNode();
                item.parent = this.content;
                item.getComponent(SuperListItem).setData({ index: i, data: itemInfoList[i] });
            }

            this.isLoadingFinished = true;
            this.scheduleOnce(() => {
                this.cbAfterSetData && this.cbAfterSetData();
                this.improveDC();
            });
        }
    }


    //@ts-ignore
    private executePreFrame(generator: Generator, duration: number) {
        return new Promise((resolve, reject) => {
            let gen = generator;
            // 创建执行函数
            let execute = () => {
                // 执行之前，先记录开始时间
                let startTime = new Date().getTime();

                // 然后一直从 Generator 中获取已经拆分好的代码段出来执行
                for (let iter = gen.next(); ; iter = gen.next()) {
                    // 判断是否已经执行完所有 Generator 的小代码段，如果是的话，那么就表示任务完成
                    if (iter == null || iter.done) {
                        //@ts-ignore
                        resolve();
                        return;
                    }

                    // 每执行完一段小代码段，都检查一下是否已经超过我们分配的本帧，这些小代码端的最大可执行时间
                    if (new Date().getTime() - startTime > duration) {
                        // 如果超过了，那么本帧就不在执行，开定时器，让下一帧再执行
                        this.scheduleOnce(() => {
                            execute();
                        });
                        return;
                    }
                }
            };

            // 运行执行函数
            execute();
        });
    }

    private initItem(itemInfo: any) {
        let itemNode = this.newItemNode();
        itemNode.parent = this.content;
        itemNode.getComponent(SuperListItem).setData(itemInfo);
    }


    private *getItemGenerator(length: number) {
        for (let i = 0; i < length; i++) {
            yield this.initItem({ index: i, data: this.itemInfoList[i] });
        }
        this.isLoadingFinished = true;
        this.scheduleOnce(() => {
            this.cbAfterSetData && this.cbAfterSetData();
            this.improveDC();
        });
    }

    public canInputData(): boolean {
        return this.isLoadingFinished;
    }

    //通过index去获取节点
    public getItem(index: number): cc.Node {
        let item = this.content.getChildByName('item' + index);
        return item || null;
    }

    // update (dt) {}
}
