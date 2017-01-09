import { Observable } from 'rx'
import { DatabaseObject } from '../DatabaseObject'
export interface DashboardService {
    getDashboardConfigationByUser(dashboardId: string, applicationId: string): Observable<DatabaseObject>;
}