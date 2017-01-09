import { Observable } from 'rx'
import { Report, ReportExecutionInput, ReportResult } from './Report'
import { MapOfObjects, ListOfMapOfObjects } from './SavedSearch'
import { DatabaseObject } from './DatabaseObject'
import { Filter } from './Filter'

export interface ReportService {
    /**
	 * returns report filter values presently returns DatabaseObject values only
	 * 
	 * @param service
	 * @param filter
	 * @return
	 * @throws Exception
	 */
    getReportFilterValues(reportBuilder: string, referenceType: string,
        filter: Filter): Observable<DatabaseObject[]>;

	/**
	 * returns result of a report but report should not be dataset report.(it
	 * may be chart or normal report)
	 * 
	 * @param report
	 * @param filters
	 * @param isChart
	 * @return
	 * @throws Exception
	 */
    executeDatasetReport(input: ReportExecutionInput): Observable<ReportResult>;

	/**
	 * returns report result report may be dataset report or normal report
	 * 
	 * @param report
	 * @param filters
	 * @return
	 * @throws Exception
	 */
    executeReport(input: ReportExecutionInput): Observable<ListOfMapOfObjects>;

	/**
	 * It will create new query and execute every time
	 * 
	 * @param report
	 * @param filters
	 * @param isChart
	 * @return
	 * @throws Exception
	 */
    executeReportPreview(report: Report, filters: MapOfObjects, isChart: boolean): Observable<ListOfMapOfObjects>;
}