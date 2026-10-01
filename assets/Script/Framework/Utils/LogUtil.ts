export class LogUtil implements Console {
    memory: any;
    assert(test?: boolean, message?: string, ...optionalParams: any[]) { }
    clear() { }
    count(countTitle?: string) { }
    debug(message?: string, ...optionalParams: any[]) { }
    dir(value?: any, ...optionalParams: any[]) { }
    dirxml(value: any) { }
    error(message?: any, ...optionalParams: any[]) { }
    exception(message?: string, ...optionalParams: any[]) { }
    group(groupTitle?: string) { }
    groupCollapsed(groupTitle?: string) { }
    groupEnd() { }
    info(message?: any, ...optionalParams: any[]) { }
    log(message?: any, ...optionalParams: any[]) { }
    msIsIndependentlyComposed(element: Element) { return false };
    profile(reportName?: string) { }
    profileEnd() { }
    select(element: Element) { }
    table(...data: any[]) { }
    time(timerName?: string) { }
    timeEnd(timerName?: string) { }
    trace(message?: any, ...optionalParams: any[]) { }
    warn(message?: any, ...optionalParams: any[]) { }
    countReset(label?: string): void { }
    timeLog(label?: string, ...data: any[]): void { }
    timeStamp(label?: string): void { }
}
