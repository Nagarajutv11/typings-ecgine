import { Vue, Component, Lifecycle, Prop } from 'av-ts'
import { $e } from '../Ecgine';
import { ReportInput } from '../ReportInput';
import { FormInput } from '../FormInput';
import { DatabaseObject } from '../DatabaseObject'
import { EntityRegistry } from '../EntityRegistry'
import { Report, ReportColumn, ReportResult, ReportColumnData } from '../Report';
import { ReportRegistryService } from '../ReportRegistryService';
import { MapOfObjects, ListOfMapOfObjects } from '../SavedSearch';
import { TableColumn } from '../table/TableColumn';
import { FieldType } from '../Field'
import { Entity } from '../Entity'
import { ControlUtils } from '../ControlUtils'
import { TreeItem } from '../table/TreeItem'
import { ReportService } from '../ReportService'
import { Filter } from '../Filter'
import * as treetable from '../table/treetable.vue';
import * as FiltersPanel from '../filters/filterspanel.vue';

@Component({ components: { treetable, FiltersPanel } })
export default class ReportViewControl extends Vue {

    @Prop
    input: ReportInput

    report: Report | null = null;
    filterValues: MapOfObjects = { values: {} }
    tableColumns: TableColumn[] = []
    dataSetTableColumns: TableColumn[] = []
    dataSetColumns: ReportColumn[] = [];
    needHeader: boolean = false;
    clickActions: { [key: string]: (row: any) => void } = {}
    root: TreeItem | null = null;
    dataSetKey: any = null;
    service: ReportService;
    filters: Filter[] = []

    @Lifecycle
    created() {
        this.filters = []
        this.dataSetKey = null;
        if (!this.input.databaseService) {
            this.input.databaseService = $e.service('org.ecgine.core.shared.api.DatabaseService')
        }
        if (!this.input.reportService) {
            this.input.reportService = $e.service('org.ecgine.report.shared.service.ReportService')
        }
        this.service = this.input.reportService as ReportService;


        this.root = { row: {}, subitems: [] };
        this.tableColumns = [];


        this.filterValues = { values: {} }
        if (this.input.filterValues) {
            for (let key in this.input.filterValues) {
                this.filterValues.values[key] = this.input.filterValues[key];
            }
        }
        this.needHeader = !this.input.isPortlet
        this.clickActions = {}

        if (this.input.report) {
            this.setReport(this.input.report)
        } else {
            let sr = $e.service('ReportRegistryService') as ReportRegistryService
            let _this1 = this;
            sr.report(this.input.reportBuilder, (report: Report) => { _this1.setReport(report) });
        }
    }

    setReport(report: Report) {
        if (!report.cls) {
            return;
        }
        this.report = report;
        this.filters = this.report.filters
        this.computeDataSetColumns()
        this.createTableColumns()
        this.$emit('title', report.name)
        ControlUtils.addDefaultValues(this.filterValues, this.filters)
        this.refresh()
    }

    refresh() {
        if (!this.report) {
            return;
        }
        let fv = ControlUtils.prepareMapOfObjects(this.filterValues, this.filters)
        this.dataSetKey = this.filterValues.values['__data_sets'];
        if (this.dataSetKey != null) {
            fv.values['__data_sets'] = { v: this.dataSetKey.identity, type: { type: 'TEXT' } }
            this.service.executeDatasetReport({
                reportBuilder: this.report.cls,
                filterValues: fv,
                isChart: false,
                report: 0
            }).subscribe((data: ReportResult) => {
                this.onDataSetReportResult(data);
            })
        } else {
            this.service.executeReport({
                reportBuilder: this.report.cls,
                filterValues: fv,
                isChart: false,
                report: 0
            }).subscribe((data: ListOfMapOfObjects) => {
                this.onReportResult(data);
            })
        }
    }

    computeDataSetColumns() {
        if (this.report) {
            this.dataSetColumns = this.report.columns.filter(col => !col.isGroup)
                .filter(col => col.isUseAsDataSetColumn);
        }
    }

    onDataSetReportResult(result: ReportResult) {
        this.createTableColumns()
        this.prepareDatasetColumns(result.dataSetValues);
        this.onReportResult(result.reportResult);
    }

    prepareDatasetColumns(dataSetValues: ReportColumnData[]) {
        this.dataSetTableColumns = [];
        this.tableColumns.forEach(c => {
            c.rowspan = 2;
            this.dataSetTableColumns.push(c);
        });

        let index = 0;
        dataSetValues.forEach(dataSet => {
            let dataSetIndex = index++;
            this.dataSetColumns.forEach(dsc => {
                let key = "_ds" + dataSetIndex + dsc.identity;
                let column = new TableColumn();
                column.id = key;
                column.name = dsc.name;
                column.component = "LabelField"
                this.setColumnWidth(column, dsc, dsc.type.type);
                this.tableColumns.push(column);
            })
            let column = new TableColumn();
            column.id = dataSet.name;
            column.name = dataSet.name;
            column.component = "LabelField"
            column.colspan = this.dataSetColumns.length;
            this.dataSetTableColumns.push(column);
        })

        // For DataSet Total
        this.dataSetColumns.forEach(dsc => {
            let key = "_dst" + dsc.identity;
            let column = new TableColumn();
            column.id = key;
            column.name = dsc.name;
            column.component = "LabelField"
            this.setColumnWidth(column, dsc, dsc.type.type);
            this.tableColumns.push(column);
        })

        let column = new TableColumn();
        column.id = 'Total';
        column.name = 'Total';
        column.component = "LabelField"
        column.colspan = this.dataSetColumns.length;
        this.dataSetTableColumns.push(column);
    }

    onReportResult(data: ListOfMapOfObjects) {
        let parents: { [index: number]: TreeItem } = {}
        let records = data.value;
        let root = { row: {}, subitems: [] }
        records.forEach(record => {
            let parentIndex = record['_parentIndex'];

            let item: TreeItem = { row: record, subitems: [] }
            let parent: TreeItem;
            if (parentIndex == -1) {
                parent = root;
            } else {
                parent = parents[parentIndex];
            }

            parent.subitems.push(item);
            parents[parentIndex + 1] = item;
        })
        this.root = root;
    }

    createTableColumns() {
        this.dataSetTableColumns = []
        this.tableColumns = []
        this.clickActions = {};
        let reportColumns = this.calculateReportColumns();
        let _this1 = this
        let hasDatasets = this.dataSetColumns.length != 0
        reportColumns.forEach(rc => {
            if (!rc.canShow) {
                return;
            }

            let isLink = false;
            let drillDown = rc.drillDownReport;
            if (drillDown) {
                isLink = true;
            }

            let columnInfo = rc.type
            let propertyType = columnInfo.type;
            let key = rc.identity
            let columnName = rc.name;
            if (rc.isGroup) {
                if (this.report) {
                    this.report.columns.filter(c => c.isGroup).forEach(c => {
                        let column = new TableColumn();
                        column.id = c.identity;
                        column.name = c.name;
                        column.component = "LabelField"
                        _this1.setColumnWidth(column, c, c.type.type);
                        _this1.tableColumns.push(column);
                    })
                }
            } else if (this.dataSetKey == null || !rc.isUseAsDataSetColumn) {
                let column = new TableColumn();
                column.id = key;
                column.name = columnName;
                if (propertyType == 'BOOLEAN') {
                    column.component = "BooleanReadOnlyField"
                } else if (isLink) {
                    _this1.createLinkTableColumn(column, rc, drillDown);
                } else {
                    column.component = "LabelField"
                }
                _this1.setColumnWidth(column, rc, propertyType);
                _this1.tableColumns.push(column);
            }

            let column = new TableColumn();
            if (rc.showCredit && !rc.isUseAsDataSetColumn) {
                column.name = 'Credit';
                column.id = key + "-Credit";
                column.value1 = key + "__currency"
            } else if (rc.useAsRunningTotalColumn && !rc.isUseAsDataSetColumn) {
                let runningTotalColumnName = rc.runningTotalColumnName;
                if (runningTotalColumnName == null) {
                    runningTotalColumnName = 'Running ' + columnName;
                }
                column.id = key + "-RunningTotal";
                column.value1 = key + "__currency"
                column.name = runningTotalColumnName;
            } else if (rc.showPercentage && !rc.isUseAsDataSetColumn) {
                column.id = key + "-Percentage";
                column.value1 = key + "__currency"
                column.name = "Percent Of " + columnName;
            }
            if (!column.name) {
                return;
            }

            if (isLink) {
                _this1.createLinkTableColumn(column, rc, drillDown);
            } else {
                column.component = "LabelField"
            }
            _this1.setColumnWidth(column, rc, propertyType);
            _this1.tableColumns.push(column);
        })
    }

    setColumnWidth(tc: TableColumn, rc: ReportColumn, propertyType: string) {
        if (rc.minWidth != 0) {
            tc.minWidth = rc.minWidth;
        } else if (rc.columnType == 'SOQL' || rc.columnType == 'Formula') {
            tc.minWidth = 100;
            tc.sortable = false;
        } else if (ControlUtils.isStringTypeProperty(propertyType)) {
            tc.minWidth = 150;
        } else {
            switch (propertyType) {
                case 'LONG':
                case 'DOUBLE':
                case 'AMOUNT':
                case 'DATE':
                case 'TEXT':
                case 'BIG_DECIMAL':
                    tc.minWidth = 100;
                    break;
                case 'REFERENCE':
                    tc.minWidth = 150;
                    break;
                default:
                    break;
            }
        }
        if (rc.maxWidth != 0) {
            tc.maxWidth = rc.maxWidth;
        }
        if (rc.width != 0) {
            tc.width = rc.width;
        }
        tc.sortable = false;
    }

    createLinkTableColumn(column: TableColumn, rc: ReportColumn, drillDown: string) {
        column.component = 'LinkField'
        this.clickActions[column.id] = function (row: any) {
            //Need to do some action
            console.log('Link clicked:' + column.id)
        }
    }

    onRowClick(e: any, row: any) {
        // if (ev.getClickCount() != 2) {
        // 	return;
        // }

        // TreeItem<Map<String, Object>> selectedItem = treeTableView.getSelectionModel().getSelectedItem();
        // if (selectedItem == null) {
        // 	return;
        // }

        if (row == null) {
            return;
        }
        let openRecordId = row['_openrecordId']
        let record_id: any;
        if (openRecordId) {
            record_id = openRecordId.id;
        } else {
            record_id = row['record_id'];
        }
        if (!record_id || !this.report) {
            return;
        }
        let er = $e.service('EntityRegistry') as EntityRegistry;
        let entity: Entity = er.entity(this.report.reportType.primaryComponent)
        let drillDownReportBuilder = this.report.drillDownReport;
        if (drillDownReportBuilder != null) {
            let filterValues: { [key: string]: string } = {}
            let sr = $e.service('ReportRegistryService') as ReportRegistryService
            let _this1 = this;
            sr.report(drillDownReportBuilder, (report: Report) => {
                report.filters.filter(f => {
                    if (f.type.type != 'REFERENCE') {
                        return false
                    }
                    if (er.entity(f.type.referenceType).canAssign(entity)) {
                        return true;
                    }
                    return false
                }).forEach(f => {
                    filterValues[f.identity] = record_id
                })
                $e.viewManager().openReportView(drillDownReportBuilder, filterValues)
            });
        } else {
            if (!entity.isChildModel || this.report.openPath != null) {
                let view: FormInput = {
                    instance: { id: record_id } as DatabaseObject,
                    isEdit: false,
                    viewName: 'FormView'
                }
                $e.viewManager().openFormView(view);
            }
        }
    }

    calculateReportColumns(): ReportColumn[] {
        if (!this.report) {
            return [];
        }
        let groupColumns = this.report.columns.filter(c => c.isGroup);
        let nonGroupColumns = this.report.columns.filter(c => !c.isGroup);
        let reportColumns: ReportColumn[] = [];
        if (groupColumns.length > 0) {
            reportColumns.push(groupColumns[groupColumns.length - 1]);
        }
        nonGroupColumns.forEach(c => reportColumns.push(c))
        return reportColumns;
    }
}