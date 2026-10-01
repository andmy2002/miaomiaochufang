export enum EPlatform {
    Web,
}

export enum EBuildVersion {
    Debug,
    Release,
}

export class ServerInfo {
    public platform: EPlatform = EPlatform.Web;
    public buildVersion: EBuildVersion = EBuildVersion.Debug;
    public get isRelease() {
        if (this.buildVersion == EBuildVersion.Release)
            return true;
        else
            return false;
    }
}
