import { RemoteServiceSyncProxy, RpcConfiguration } from './RemoteServiceSyncProxy';
import { $e } from './Ecgine';
import { Report } from './Report'

export class ReportRegistryService {

    private static _instance: ReportRegistryService;

    private allReports: { [name: string]: Report; } = {};

    constructor() {
        if (ReportRegistryService._instance) {
            throw new Error("Error: Do not create another object. This is singleton");
        }
        ReportRegistryService._instance = this;
    }

    public report(fullName: string, callback: (search: Report) => void): void {
        let search = this.allReports[fullName];
        if (search) {
            callback(search)
        } else {
            this.downloadDefinition(fullName, callback);
        }
    }

    downloadDefinition(fullName: string, callback: (search: Report) => void) {
        let _this = this
        let proxy = $e.service('RemoteServiceSyncProxy') as RemoteServiceSyncProxy;
        proxy.sendEcgineRequest("/org.ecgine.webui/u/reports", { report: fullName }, function(res: any): void {
            var search = res as Report
            _this.allReports[search.cls] = search;
            callback(search);
        });
    }
}