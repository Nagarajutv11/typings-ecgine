import { MapOfObjects, ListOfMapOfObjects } from './SavedSearch'
import { FieldType } from './Field'
import { Filter } from './Filter'

export class Report {
    cls: string
    appIdentity: string;
    name: string;
    description: string;
    reportType: ReportType;
    columns: ReportColumn[];
    filters: Filter[]
    sortOrders: ReportSortOrder[]
    showZeros: boolean;
    allowWebQuery: boolean;
    showCurrencySymbol: boolean;
    expandLevel: string;
    drillDownReport: string;
    isDetail: boolean;
    openPath: string;
    identity: string;
}

export class ReportType {
    primaryComponent: string;
}

export class ReportColumn {
    identity: string;
    type: FieldType
    columnType: string;
    name: string;
    isGroup: boolean;
    useAsRunningTotalColumn: boolean;
    property: string;
    filter: string;
    showGrandTotal: boolean;
    formulaType: string;
    applyFormulaToGrandTotal: boolean;
    showCredit: boolean;
    lastNthMonth: number;
    minWidth: number;
    maxWidth: number;
    width: number;
    canShow: boolean;
    summaryProperty: boolean;
    creditLabel: string;
    isUseAsDataSetColumn: boolean;
    runningTotalColumnName: string;
    startDate: number;
    endDate: number;
    summary: string;
    alternativeDateRange: string;
    alternateDateRangeType: string;
    showPercentage: boolean;
    drillDownReport: string;
}

export class ReportSortOrder {
    property: string;
    descending: boolean;
}

export class ReportExecutionInput {
    reportBuilder: string;
    filterValues: MapOfObjects;
    isChart: boolean;
    report: number;
}

export class ReportResult {
    dataSetValues: ReportColumnData[];
    reportResult: ListOfMapOfObjects;
}

export class ReportColumnData {
    name: string;
    object: any;
}