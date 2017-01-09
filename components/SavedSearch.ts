import { FieldType } from './Field'
import { Filter } from './Filter'

export class SavedSearch {
    cls: string
    name: string
    identifier: string
    needPagination: boolean
    disableViewEdit: boolean
    columns: SearchColumn[]
    filters: Filter[]
}

export class SearchColumn {
    name: string;
    identity: string;
    searchColumnType: string = "PropertyPath";
    propertyPath: string;
    summaryType: string;
    functionType: string;
    summaryLabel: string;
    needLink: boolean;
    minWidth: number = 150;
    maxWidth: number;
    width: number;
    whenOrderByProperty: string;
    formula: string;
    type: FieldType
}

export class LinkColumn {
    name: string
    list: string
    searchColumn?:string
    action: (filterValues: { [key: string]: any }, row: any) => void
}

export class SavedSearchResult {
    list: ListOfMapOfObjects;
    start: number;
    totalCount: number;
}

export class ListOfMapOfObjects {
    value: ({ [key: string]: any })[]
}

export class SearchExecutionInput {
    filterValues: MapOfObjects
    isSummary: boolean
    searchBuilder: string;
    search?: number
}

export class MapOfObjects {
    values: { [key: string]: any }
}