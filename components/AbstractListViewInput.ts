import { IViewInput } from './IViewInput'
import { SavedSearch } from './SavedSearch'
import { UIBaseDatabaseService } from './UIBaseDatabaseService'
import { SavedSearchService } from './SavedSearchService'

export class AbstractListViewInput implements IViewInput {
    cls: string;
    savedSearch?: SavedSearch;
    filterValues: { [key: string]: any };
    dbService?: UIBaseDatabaseService;
    savedSearchService?: SavedSearchService;
    isPreview: boolean;
}