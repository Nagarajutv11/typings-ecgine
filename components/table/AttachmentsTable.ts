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
import * as etable from '../table/etable.vue';


@Component({
    components: { etable }
})
export default class AttachmentsTable extends Vue {


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
    rows: any[] = []
    referenceType: Entity | undefined = undefined;

    referenceFromValues: { [key: string]: any[] } = {}

    @Lifecycle
    mounted() {
        let rows = this.input.value[this.property] as any[];
        if (!rows) {
            rows = []
            this.input.value[this.property] = rows;
        }
        this.rows = rows;
    }

    onPropertyChange(path: string, indx: number) {        
        this.pp.onPropertyChange(path);
        this.$emit('propertyChange', this.property + '.' + path)
    }

    addNewRow() {
        if (this.referenceType) {
            let row = this.referenceType.newInstance() as any;
            for (var property in this.referenceFromValues) {
                if (this.referenceFromValues.hasOwnProperty(property)) {
                    row[property] = this.referenceFromValues[property]
                }
            }

            this.rows.push(row)
            this.$emit('propertyChange', this.property);
        }
    }
    isEditable(): boolean {
        let field = this.input.entity.getField(this.property);
        if (field == null) {
            return false;
        }
        return !this.isReadFieldOnly(field) && this.input.isEdit
    }

    isReadFieldOnly(field: Field): boolean {
        let writeControlType = field.writeControlType;
        return !this.input.isEdit || (writeControlType == 'READ_ONLY') || (field.hasComputation);
    }

    getColumns(): TableColumn[] {
        let field = this.input.entity.getField(this.property);
        if (field == null) {
            return [];
        }

        let columns: TableColumn[] = [];
        let c = new TableColumn();      
        
        c.maxWidth = 300;
        //TODO column path
        let res = ControlUtils.createControl(field, false, false);
        c.value1 = res.value1;
        c.value2 = {}
        for (var property in res.value2) {
            if (res.value2.hasOwnProperty(property)) {
                c.value2[property] = res.value2[property]
            }
        }
        c.component = res.component;
        c.sortable = false;        
        columns.push(c);
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

        if (this.parent != null) {
            let f = this.input.entity.getField(this.parent);
            if (f != null && f.prefilBasedOn == mf.property) {
                return true;
            }
        }
        return false;
    }

}