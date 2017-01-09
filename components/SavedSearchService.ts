import { Observable } from 'rx'
import { DatabaseObject } from './DatabaseObject'
import { Filter } from './Filter'
import { SavedSearch, SavedSearchResult, SearchExecutionInput, MapOfObjects } from './SavedSearch'

export interface SavedSearchService {
	/**
	 * this will check already query prepared or not if not prepared then it
	 * will create query
	 */
    executeSearch(input: SearchExecutionInput): Observable<SavedSearchResult>;

	/**
	 * this will not check query already prepared or not it will always create
	 * new query to get savedsearch data
	 */
    executeSearchPreview(savedSearch: SavedSearch, isSummary: boolean,
        filters: MapOfObjects): Observable<SavedSearchResult>

	/**
	 * presently we are supporting only databaseobject for filtervalues
	 */
    getFilterValues(searchBuilder: string, referenceType: string,
        filter: Filter): Observable<DatabaseObject[]>
}