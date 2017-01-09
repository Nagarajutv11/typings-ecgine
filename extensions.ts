import { $e } from './components/Ecgine'
import { UIBaseDatabaseService } from './components/UIBaseDatabaseService'
import { ReportRegistryService } from './components/ReportRegistryService'
import { Report } from './components/Report'
import * as DashboardView from './components/dashboard/DashboardView.vue';
import * as FormControl from './components/formcontrol/FormControl.vue';
import * as ListViewControl from './components/savedsearch/ListViewControl.vue';
import * as ReportView from './components/report/ReportViewControl.vue';
import * as ListPortletViewControl from './components/dashboard/ListPortletViewControl.vue';
import * as ReportPortletViewControl from './components/dashboard/ReportPortletViewControl.vue';
import * as ChartPortletView from './components/dashboard/ChartPortletView.vue';

export class Extensions {

    register() {
        let _this = this;
        $e.addExtPoint("", function () {
            let points: { [name: string]: any[]; } = {}
            points['org.ecgine.client.view'] = _this.views()
            points['org.ecgine.client.dashboard'] = [{ id: 'ecgineDashboard', layout: 'Both', personalize: true }]
            points['org.ecgine.client.portletType'] = _this.portletTypes()
            points['org.ecgine.client.command'] = _this.commands()
            return points;
        });
    }

    commands(): any[] {
        let _this1 = this;
        let model = {
            id: 'model',
            command: function (params: any, callback: (input: any) => void) {
                let db = $e.service('org.ecgine.core.shared.api.DatabaseService') as UIBaseDatabaseService
                db.load(parseInt(params.id)).subscribe(i => {
                    let input = { instance: i, isEdit: params.edit == 'true', viewName: 'FormView' };
                    callback(input)
                });
            }
        }

        let report = {
            id: 'report',
            command: function (params: { [key: string]: string }, callback: (input: any) => void) {
                let reportBuilder = params['reportBuilder'];
                let sr = $e.service('ReportRegistryService') as ReportRegistryService
                sr.report(reportBuilder, (report: Report) => {
                    let filterValues: { [key: string]: any } = {}
                    report.filters.forEach(f => {
                        let fv = params[f.identity] as any
                        if (fv != undefined) {
                            if (f.type.type == 'REFERENCE') {
                                fv = { id: fv, _type: f.type.referenceType };
                            }
                            filterValues[f.identity] = fv;
                        }
                    })
                    let input = { viewName: 'ReportView', reportBuilder: reportBuilder, isPortlet: false, filterValues: filterValues };
                    callback(input)
                });
            }
        }
        return [model, report];
    }

    views(): any[] {
        return [
            { id: 'Dashboard', view: DashboardView },
            { id: 'FormView', view: FormControl },
            { id: 'ListView', view: ListViewControl },
            { id: 'ReportView', view: ReportView },
            { id: 'search' },
            { id: 'calendarview' },
            { id: 'ChartPortletView', view: ChartPortletView },
            { id: 'ListPortletView', view: ListPortletViewControl },
            { id: 'ReportPortletView', view: ReportPortletViewControl }
        ]
    }

    portletTypes(): any[] {
        return [
            { id: 'ChartPortletType', isConfigurable: true, view: 'ChartPortletView' },
            { id: 'ListPortletType', isConfigurable: true, view: 'ListPortletView' },
            { id: 'ReportPortletType', isConfigurable: true, view: 'ReportPortletView' }
        ]
    }
}