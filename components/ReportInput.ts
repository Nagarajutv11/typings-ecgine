import { IViewInput } from './IViewInput'
import { Report } from './Report'
import { UIBaseDatabaseService } from './UIBaseDatabaseService'
import { ReportService } from './ReportService'

export class ReportInput implements IViewInput {
    reportBuilder: string;
    report?: Report;
    filterValues: { [key: string]: any };
    isPortlet: boolean;
    databaseService?: UIBaseDatabaseService;
    reportService?: ReportService;
    changeRecords?: (records: ({ [key: string]: any })[]) => ({ [key: string]: any })[]
}