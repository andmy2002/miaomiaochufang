import { task } from "../Config/ConfigConst";
import { App } from "../../Manager/App";
import { ETaskID } from "../Const/EnumDefine";

/** 日常任务 */
export class DailyTask {

    public taskType = 1;
    public finishTaskType = 2;
    private _tasks: task[];
    public get tasks(): task[] {
        return this._tasks;
    }
    public set tasks(value: task[]) {
        this._tasks = value;
        this.updateLocalStorate();
    }


    public constructor() {
        this.initData();
    }

    public initData() {
        let dailyTask = App.LocalStorageUtil.getJsonObj(App.LocalStorageUtil.lst_dailytask) as DailyTask;
        if (dailyTask)
            this.tasks = dailyTask._tasks;
        else
            this.tasks = App.ConfigMgr.getTaskList();
    }

    private updateLocalStorate() {
        App.LocalStorageUtil.setJsonObj(App.LocalStorageUtil.lst_dailytask, this);
        console.log("设置日常任务数据:", this);
    }

    /** 获取任务在任务数组中的索引 */
    private getTask(taskID: ETaskID): number {
        let result = -1;
        this.tasks.forEach((value, index) => {
            if (value.id == taskID) result = index;
        });
        return result;
    }

    /** 完成一次 */
    public doOneTimes(taskID: ETaskID) {
        let taskIndex = this.getTask(taskID);
        this.tasks[taskIndex].overNum += 1;
        this.isFinishTask(this.tasks[taskIndex]);
        this.updateLocalStorate();
    }


    /** 是否完成某个任务 */
    private isFinishTask(task: task): boolean {
        let result = false;
        if (task.overNum >= task.maxNum) {
            task.overNum = task.maxNum;
            result = true;
        }
        return result;
    }

    /** 是否完成所有任务 */
    private isFinishAllTask(): boolean {
        let result = true;
        this.tasks.forEach((value) => {
            if (value.overNum < value.maxNum) result = false;
        })
        return result;
    }

}
