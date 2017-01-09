import { SavedSearch } from './SavedSearch';
import { RemoteServiceSyncProxy } from './RemoteServiceSyncProxy';
import { $e } from './Ecgine';

export class SavedSearchRegistryService {

    private static _instance: SavedSearchRegistryService;

    private allSearches: { [name: string]: SavedSearch; } = {};

    constructor() {
        if (SavedSearchRegistryService._instance) {
            throw new Error("Error: Do not create another object. This is singleton");
        }
        SavedSearchRegistryService._instance = this;
        let _this = this;
    }

    public search(fullName: string, callback: (search: SavedSearch) => void): void {
        let search = this.allSearches[fullName];
        if (search) {
            callback(search)
        } else {
            this.downloadDefinition(fullName, callback);
        }
    }

    downloadDefinition(fullName: string, callback: (search: SavedSearch) => void) {
        if (!fullName) {
            return;
        }
        let _this = this
        let proxy = $e.service('RemoteServiceSyncProxy') as RemoteServiceSyncProxy;
        proxy.sendEcgineRequest("/org.ecgine.webui/u/savedsearches", { savedsearch: fullName }, function (res: any): void {
            var search = res as SavedSearch
            _this.allSearches[search.cls] = search;
            callback(search);
        });
    }
}