import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { TableColumn } from '../table/TableColumn';
import { Entity } from '../Entity';
import { Callback } from '../Models';
import { Field } from '../Field';
import { $e } from '../Ecgine';
import { EntityRegistry } from '../EntityRegistry';
import { ControlUtils } from '../ControlUtils';
import { ModelPaneGroup } from '../formcontrol/ModelPaneGroup';
import { ModelField } from '../formcontrol/ModelField';
import { PropertyProvider } from '../PropertyProvider';
import { PropertyProviderInstance } from '../PropertyProviderInstance';
import * as etable from '../table/etable.vue';


@Component({
    components: { etable }
})
export default class EditTable extends Vue {


    @Prop
    input: any;

    @Prop
    property: string;

    @Prop
    group: ModelPaneGroup;

    @Prop
    pp: PropertyProvider

    rpcConfiguration: any;
    parent: string;
    ppis: PropertyProviderInstance[] = []
    referenceType: Entity | undefined = undefined;
    field: Field | null = null;

    isPrifil: boolean = false;
    prefilType: string = 'NONE'

    value: any[] = []

    // Used for prefill
    allRows: any[] = []
    @Lifecycle
    mounted() {
        this.value = []
        this.allRows = []
        this.ppis = []
        let field = this.input.entity.getField(this.property);
        this.field = field;
        let entity = field.referenceType;
        let es = $e.service("EntityRegistry") as EntityRegistry;
        this.referenceType = es.entity(entity);
        this.isPrifil = this.hasPrefil(field);
        this.prefilType = field.prefilType

        this.createEmptyRows();
        this.pp.parent.pp.addWatcher(this.property, 'edit table', () => {
            this.createEmptyRows();
        });
        if (!this.isReadFieldOnly(field) && this.isPrifil) {
            this.doPrefil(field);
        }
    }

    createEmptyRows() {
        if (!this.field) {
            return;
        }
        let value = this.input.value[this.property] as any[];
        if (value && this.value == value) {
            if (!this.isPrifil) {
                this.allRows = value;
            }
            return;
        }
        if (this.ppis) {
            this.ppis.forEach(p => { p.remove() });
        }
        if (!value) {
            value = []
            this.input.value[this.property] = value;
        }
        this.value = value;
        this.ppis = [];
        if (this.field && !this.isPrifil) {
            let isEdit = this.input.isEdit && !this.isReadFieldOnly(this.field);
            value.forEach(r => {
                this.ppis.push(this.pp.createProvider(r, isEdit));
            })
        }
        if (!this.isPrifil) {
            this.allRows = value;
        }
    }

    onPrefilSelected(selected: boolean, idx: number) {
        let row = this.allRows[idx];
        if (selected) {
            this.value.push(row);
        } else {
            this.value.splice(this.value.indexOf(row), 1);
        }
        this.$emit('propertyChange', this.property);
    }

    onPropertyChange(path: string, indx: number) {
        this.ppis[indx].onPropertyChange(path);
    }

    doPrefil(field: Field) {
        if (this.referenceType) {
            let dummy = this.pp.createDummyProvider();
            dummy.addWatcher(field.prefilBasedOn + '_referenceFrom', 'prefill', () => {
                let val = dummy.instance[field.prefilBasedOn + '_referenceFrom'];
                let oldValues: any[] = []
                this.value.forEach(r => {
                    if (r.id != 0) {
                        oldValues.push(r);
                    }
                })
                this.value.splice(0, this.value.length);
                this.allRows.splice(0, this.allRows.length);
                this.createEmptyRows();
                oldValues.forEach(r => {
                    this.addRow(true, r, true)
                })


                val.forEach((v: any) => {
                    let has = false;
                    oldValues.forEach(o => {
                        if (o[field.prefilBasedOn] == v) {
                            has = true;
                        }
                    })
                    if (has) {
                        return;
                    }
                    let row = this.createNewInstance(true);
                    row[field.prefilBasedOn] = v;
                    this.onPropertyChange(field.prefilBasedOn, row.__index);
                })
                this.$emit('propertyChange', this.property);
            });
        }
    }

    addNewRow() {
        this.createNewInstance(false);
        this.$emit('propertyChange', this.property);
    }

    createNewInstance(isPrefil: boolean): any {
        let _this1 = this;
        if (this.referenceType) {
            let row = this.referenceType.newInstance() as any;
            _this1.addRow(isPrefil, row, false); 
            return row;           
        }
    }

    addRow(isPrefil: boolean, row: any, checked: boolean): any {
        let _this1 = this;
        if (this.referenceType) {
            if (isPrefil) {
                row.prefillCheckbox = checked || this.prefilType != 'OPTIONAL';
                row.prefillNotSelected = !row.prefillCheckbox;
            }
            this.referenceType.setParents(row, this.input.value)
            row.__index = this.allRows.length;
            this.allRows.push(row)
            if (isPrefil&&!row.prefillNotSelected) {
                this.value.push(row)
            }
            let ppi = this.pp.createProvider(row, true, isPrefil);
            if (this.isPrifil && this.prefilType != 'REQUIRED') {
                ppi.addWatcher('prefillCheckbox', 'prefillCheckbox', function () {
                    row.prefillNotSelected = !row.prefillCheckbox
                    _this1.onPrefilSelected(!row.prefillNotSelected, row.__index);
                })
            }
            this.ppis.push(ppi);
            return row;
        }
    }
    isEditable(): boolean {
        let field = this.input.entity.getField(this.property);
        if (field == null) {
            return false;
        }
        return !this.isReadFieldOnly(field) && this.input.isEdit && !this.hasPrefil(field)
    }

    isReadFieldOnly(field: Field): boolean {
        let writeControlType = field.writeControlType;
        return !this.input.isEdit || (writeControlType == 'READ_ONLY') || (field.hasComputation);
    }
    hasPrefil(field: Field): boolean {
        let prefilType = field.prefilType;
        return prefilType != null && prefilType != 'NONE';
    }
    getColumns(): TableColumn[] {
        let collField = this.input.entity.getField(this.property);
        if (collField == null) {
            return [];
        }
        let fields = this.group.fields;
        let entity = collField.referenceType;
        let es = $e.service("EntityRegistry") as EntityRegistry;
        let referenceType = es.entity(entity);

        let columns: TableColumn[] = [];
        if (this.isPrifil && this.prefilType != 'REQUIRED') {
            let c = new TableColumn();
            c.name = '';
            c.id = 'prefillCheckbox'
            c.component = "CheckBoxField";
            c.sortable = false;
            c.show = true;
            columns.push(c);
        }


        fields.forEach(f => {
            if (!ControlUtils.canCreatePropertyControl(f, this.input.value, this.input.isEdit)) {
                // configured to not to show this field
                return;
            }
            let field = referenceType.getField(f.property);
            if (field == null) {
                return;
            }
            let c = new TableColumn();
            c.name = f.label;
            c.id = f.property;
            c.maxWidth = 300;
            //TODO column path
            let res = ControlUtils.createControl(field, !this.isReadOnly(field, f), f.disableAddNew);
            c.value1 = res.value1;
            c.value2 = {}
            for (var property in res.value2) {
                if (res.value2.hasOwnProperty(property)) {
                    c.value2[property] = res.value2[property]
                }
            }
            c.disableProp = 'prefillNotSelected'
            c.component = res.component;
            c.sortable = false;
            c.show = true;
            this.setColumnWidth(c, f);


            if (field.hasExistancyCondition && field.hasExistNotUsingEntityFields) {
                this.pp.addExistNotUsingEntity(field, c);
            }
            columns.push(c);
        });
        return columns;
    }

    setColumnWidth(c: TableColumn, mf: ModelField) {
        if (mf.minWidth != 0) {
            c.minWidth = mf.minWidth;
        }
        if (mf.maxWidth != 0) {
            c.maxWidth = mf.maxWidth;
        }
        if (mf.width != 0) {
            c.width = mf.width;
        }
    }

    isReadOnly(field: Field, mf: ModelField): boolean {
        if (mf.isDisabled) {
            return true;
        }
        if (mf.path != null) {
            return true;
        }
        if (!this.input.isEdit) {
            return true;
        }
        if (field.writeControlType == 'READ_ONLY') {
            return true;
        }

        if (field.hasComputation) {
            return true;
        }

        if (this.field != null && this.field.prefilBasedOn == mf.property) {
            return true;
        }

        return false;
    }

}