import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { Filter } from '../Filter'
import { ReportService } from '../ReportService'
import { EntityRegistry } from '../EntityRegistry'
import { FilterValueEvaluator } from './FilterValueEvaluator'
import { ControlUtils } from '../ControlUtils'
import { $e } from '../Ecgine'

import * as Control from '../controls/Control.vue'

@Component({
    components: { Control }
})
export default class FiltersPanel extends Vue {

    @Prop
    filters: Filter[]

    @Prop
    values: { [key: string]: any }

    @Prop
    builder: string

    collapsedFilters: Filter[] = []
    paneFilters: Filter[] = []

    datasetItems: any[] = []
    reportService: ReportService | null = null;

    @Lifecycle
    created() {
        this.collapsedFilters = []
        this.paneFilters = []
    }

    @Lifecycle
    mounted() {
        this.reportService = $e.service('org.ecgine.report.shared.service.ReportService')
        this.computeFilters();
        this.$watch('filters', (fs) => {
            this.computeFilters();
        })
    }

    computeFilters() {
        let dataSetF: string = this.values['__data_sets'];

        this.datasetItems = []
        this.collapsedFilters = [];
        this.paneFilters = [];
        if (!this.filters) {
            return;
        }
        this.filters.filter(f => {
            if (f.useAsDataSet) {
                let dItem = { displayName: f.name, identity: f.identity }
                this.datasetItems.push(dItem)
                return false
            }
            return f.showInFilterRegion
        }).forEach(f => {
            if (f.collapse) {
                this.collapsedFilters.push(f);
            } else {
                this.paneFilters.push(f);
            }
        });

        if (this.datasetItems.length != 0) {
            let f: Filter = { name: 'Column', identity: '__data_sets' } as any
            this.paneFilters.push(f);
        }
    }

    get totalFilters() {
        let fs: Filter[] = [];
        this.collapsedFilters.forEach(f => fs.push(f))
        this.paneFilters.forEach(f => fs.push(f))
        return fs;
    }

    getComponent(rf: Filter): string {
        let filterId = rf.identity;
        if (filterId == '__data_sets') {
            this.values[filterId + '_values'] = this.datasetItems
            return 'CustomComboBox'
        }
        let type = rf.type.type;
        let comp = '';
        if (type == 'DATE' || type == 'DATETIME') {
            comp = 'DateRangeField';
        } else if (type == 'REFERENCE') {
            this.values[filterId + '_values'] = []
            if (this.reportService) {
                this.reportService
                    .getReportFilterValues(this.builder, rf.type.referenceType, rf)
                    .subscribe((values) => this.values[filterId + '_values'] = values);
            }
            comp = 'CustomComboBox'
        } else if (type == 'PICKLIST') {
            let er = $e.service('EntityRegistry') as EntityRegistry;
            this.values[filterId + '_values'] = er.enumValues(rf.type.enumCls);
            comp = 'CustomComboBox'
        } else if (rf.isNamedCondition) {
            this.values[filterId + '_values'] = rf.namedConditions;
            comp = 'CustomComboBox'
        } else {
            let c = ControlUtils.createControl(rf.type, true, true, false);
            comp = c.component;
        }

        let value = this.values[filterId];
        let ignoreFilter = this.values["_ignore" + filterId];
        if (!ignoreFilter) {
            let filterValue = null;
            if (value != null) {
                filterValue = value;
            } else if (rf.value != null) {
                let evaluator = new FilterValueEvaluator();
                filterValue = evaluator.eval(rf.type, rf.value);
                this.values[filterId] = filterValue;
            }
        }

        return comp;
    }

    getValue1Prop(f: Filter): string {
        return f.identity + "_values";
    }

    getValue2(f: Filter): any {
        if (f.type && f.type.type == 'PICKLIST') {
            return { supportAll: f.supportAll };
        }
        return {}
    }

    onPropertyChange(f: Filter) {
        let key = f.identity;
        let v = this.values[f.identity]
        if (f.type && (f.type.type == 'REFERENCE' || f.type.type == 'PICKLIST')) {
            if (v == null) {
                this.values["_ignore" + key] = true;
            } else {
                this.values["_ignore" + key] = false;
            }
        }
        this.$emit('refresh')
    }
}