import { Vue, Component, Lifecycle, Prop } from 'av-ts'
import { $e } from '../Ecgine';
import { SavedSearch, SearchColumn, LinkColumn, SearchExecutionInput, MapOfObjects } from '../SavedSearch';
import { ListViewInput } from '../ListViewInput';
import { TableColumn } from '../table/TableColumn';
import { Field, FieldType } from '../Field';
import { ControlUtils } from '../ControlUtils';
import { Filter } from '../Filter';
import { FormInput } from '../FormInput';
import { SavedSearchRegistryService } from '../SavedSearchRegistryService';

import * as etable from '../table/etable.vue';
import * as FiltersPanel from '../filters/filterspanel.vue';

@Component({
    components: { etable, FiltersPanel }
})
export default class ListViewControl extends Vue {

    @Prop
    input: ListViewInput

    search: SavedSearch
    filterValues: MapOfObjects = { values: {} }
    needHeader: boolean = true
    needPagination: boolean = true;
    columns: TableColumn[] = []
    filters: Filter[] = []
    rows: any[] = []
    links: LinkColumn[] = []

    @Lifecycle
    created() {
        this.filters = []
    }

    @Lifecycle
    mounted() {
        if (!this.input.dbService) {
            this.input.dbService = $e.service('org.ecgine.core.shared.api.DatabaseService')
        }
        if (!this.input.savedSearchService) {
            this.input.savedSearchService = $e.service('org.ecgine.search.shared.service.SavedSearchService')
        }

        this.filterValues = { values: {} }
        if (this.input.filterValues) {
            for (let key in this.input.filterValues) {
                this.filterValues.values[key] = this.input.filterValues[key];
            }
        }

        this.needHeader = this.input.dontShowHeader || this.input.isPortlet;
        this.rows = []

        if (this.input.savedSearch) {
            this.setSearch(this.input.savedSearch);
        } else {
            let sr = $e.service('SavedSearchRegistryService') as SavedSearchRegistryService
            let _this1 = this;
            sr.search(this.input.cls, (search: SavedSearch) => {
                _this1.setSearch(search)
            });
        }
    }

    setSearch(search: SavedSearch) {
        this.$emit('title', search.name);
        this.search = search;
        this.needPagination = this.search.needPagination
        this.links = []
        $e.multiExtPoint('org.ecgine.client.list.linkcolumn', 'list', this.search.cls, c => this.links.push(c));
        this.columns = this.createColumns();
        this.createFilters();
        ControlUtils.addDefaultValues(this.filterValues, this.filters)
        this.refresh();
    }

    onCellClick(e: any) {
        for (let c of this.links) {
            if (c.name == e.id) {
                c.action({}, e.row)
                return;
            }
        }
        if (e.id == 'editOrView') {
            $e.$router.push({ name: 'home', params: { appid: $e.appName, viewid: 'model' }, query: { id: e.row._id, edit: '' + (e.type == 'edit') } })
        }
    }

    onRowClick(row: any) {
        this.$emit('row-selected', row)
    }

    onOrderByColumn(col: string, asc: boolean) {
        console.log('Order clicked:' + col + ':' + asc)
    }

    createFilters() {
        this.filters = []
        for (var filter of this.search.filters) {
            if (filter.showInFilterRegion) {
                this.filters.push(filter);
            }
        }
    }

    refresh() {
        let executionInput = this.prepareExecutionInput();
        let req;
        if (this.input.savedSearchService) {
            if (this.input.isPreview) {
                req = this.input.savedSearchService.executeSearchPreview(this.search, executionInput.isSummary, executionInput.filterValues);
            } else {
                req = this.input.savedSearchService.executeSearch(executionInput);
            }

            let _this1 = this
            req.subscribe(r => {
                _this1.rows = r.list.value;
                _this1.links.filter(c => !c.searchColumn).forEach(c => {
                    _this1.rows.forEach(r => r[c.name] = c.name)
                })
            });
        }
    }

    prepareExecutionInput(): SearchExecutionInput {
        let fv = ControlUtils.prepareMapOfObjects(this.filterValues, this.filters)
        return { isSummary: this.input.isSummary, filterValues: fv, searchBuilder: this.search.cls }
    }

    private createColumns(): TableColumn[] {
        let columns: TableColumn[] = [];
        let _this = this;
        if (!this.input.isSummary && !this.search.disableViewEdit) {
            columns.push(this.createEditViewColumn());
        }

        this.search.columns.forEach(function (searchColumn: SearchColumn) {
            if (_this.input.isSummary && !searchColumn.summaryType) {
                return;
            }
            if (searchColumn.searchColumnType === "Custom") {
                columns.push(this.createCustomColumn(searchColumn));
                return;
            }
            let key = searchColumn.identity;
            let info = _this.getLinkColumn(key);
            let fieldType = searchColumn.type
            if (searchColumn.summaryType == 'Count') {
                let longType = { name: key, type: 'LONG', scale: fieldType.scale } as FieldType
                fieldType = longType
            }

            let c = new TableColumn();
            c.name = searchColumn.name;
            c.id = searchColumn.identity;
            c.maxWidth = searchColumn.maxWidth;
            c.minWidth = searchColumn.minWidth;
            c.width = searchColumn.width;
            c.sortable = true;
            if (info) {
                c.component = 'LinkField';
            } else {
                let res = ControlUtils.createControl(fieldType, false, true);
                c.component = res.component;
                c.value1 = res.value1;
                c.value2 = res.value2;
            }
            columns.push(c);
        });

        this.links.filter(c => !c.searchColumn).forEach(l => {
            let c = new TableColumn();
            c.name = l.name;
            c.id = l.name;
            c.sortable = false;
            c.component = 'LinkField';
            columns.push(c);
        });

        return columns;
    }

    getLinkColumn(key: string): LinkColumn | undefined {
        for (let c of this.links) {
            if (c.searchColumn == key) {
                return c;
            }
        }
    }

    private createEditViewColumn(): TableColumn {
        let editOrView = new TableColumn();
        editOrView.name = "Edit/View";
        editOrView.id = "editOrView";
        editOrView.component = "EditAndViewTableColumn";
        return editOrView;
    }

    private createCustomColumn(column: SearchColumn): TableColumn {
        let customColumn = new TableColumn();
        customColumn.name = column.name;
        customColumn.id = column.identity;
        customColumn.component = "LinkTableColumn";
        return customColumn;
    }

}