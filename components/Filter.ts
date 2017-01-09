import { FieldType } from './Field'

export class Filter {
    name: string;
    property: string;
    value: string;
    showInFilterRegion: boolean;
    useAsDataSet: boolean;
    values: string;
    supportAll: boolean;
    collapse: boolean;
    condition: string;
    identity: string;
    dateRangeFilters: string;
    type: FieldType;
    isNamedCondition:boolean
    namedConditions:any[]
}