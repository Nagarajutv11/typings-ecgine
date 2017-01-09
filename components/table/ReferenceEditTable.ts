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
export default class ReferenceEditTable extends Vue {


    @Prop
    input: any;

    @Prop
    property: string;

    @Prop
    group: ModelPaneGroup;

    @Prop
    name: string;

    @Prop
    pp: PropertyProvider

    rpcConfiguration: any;
    parent: string;
    rows: any[] = []
    referenceType: Entity | undefined = undefined;

    referenceFromValues: { [key: string]: any[] } = {}

    @Lifecycle
    mounted() {
        this.createEmptyRows();
        this.pp.parent.pp.addWatcher(this.property, 'reference table', () => {
            this.createEmptyRows();
        });

        let rows = this.input.value[this.property] as any[];
        if (!rows) {
            rows = []
            this.input.value[this.property] = rows;
        }
        this.rows = rows;
        let field = this.input.entity.getField(this.property);
        let entity = field.referenceType;
        let es = $e.service("EntityRegistry") as EntityRegistry;
        this.referenceType = es.entity(entity);
    }
    createEmptyRows() {
        let rows = this.input.value[this.property] as any[];
        if (rows && this.rows == rows) {
            return;
        }
        if (!rows) {
            rows = []
            this.input.value[this.property] = rows;
        }
        this.rows = rows;
        let isEdit = this.isEditable();
    }

    onPropertyChange(path: string, indx: number) {
        this.pp.onPropertyChange(this.property);
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
        return !this.isReadOnly(field) && this.input.isEdit && !this.hasPrefil(field)
    }
    getColumns(): TableColumn[] {
        let field = this.input.entity.getField(this.property);
        if (field == null) {
            return [];
        }
        let fields = this.group.fields;
        let entity = field.referenceType;
        let es = $e.service("EntityRegistry") as EntityRegistry;
        let referenceType = es.entity(entity);
        let hasPrefil = this.hasPrefil(field);
        let isReadOnly = this.isReadOnly(field)
        let columns: TableColumn[] = [];
        if (fields.length == 0 || !hasPrefil) {
            let extraFields = fields.map(f => f.path ? f.path : f.property);
            let col = this.createReferenceTableColumn(field, hasPrefil, isReadOnly, extraFields);
            columns.push(col)
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
            let res = ControlUtils.createControl(field, false, f.disableAddNew);
            c.value1 = res.value1;
            c.value2 = {}
            for (var property in res.value2) {
                if (res.value2.hasOwnProperty(property)) {
                    c.value2[property] = res.value2[property]
                }
            }

            c.component = res.component;
            c.sortable = false;
            this.setColumnWidth(c, f);

            //TODO
            //if (field.getExistNotUsingEntityFields().length!=0) {
            //	BooleanProperty isExist = getExistNotUsingEntity(getDummyRowObject(collectionField, getValue()),
            //			mf.getProperty());
            //	tc.setVisible(isExist.get());
            //	isExist.addListener((c, o, n) -> {
            //		tc.setVisible(n);
            //	});
            //	internalValueProperty().addListener(c -> {
            //		BooleanProperty exist = getExistNotUsingEntity(getDummyRowObject(collectionField, getValue()),
            //				mf.getProperty());
            //		exist.addListener((ch, o, n) -> {
            //			tc.setVisible(n);
            //		});
            //	});
            //}
            //tc.setExistProvider(i -> getExist((DatabaseObject) i, mf.getProperty()));

            columns.push(c);
        });
        return columns;
    }

    hasPrefil(field: Field): boolean {
        let prefilType = field.prefilType;
        return prefilType != null && prefilType != 'NONE';
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

    isReadOnly(field: Field): boolean {
        let writeControlType = field.writeControlType;
        return !this.input.isEdit || (writeControlType == 'READ_ONLY') || (field.hasComputation);
    }

    createReferenceTableColumn(field: Field, hasPrefil: boolean, isReadOnly: boolean, extraFields: string[]): TableColumn {
        let c = new TableColumn();
        let ctrl = ControlUtils.createControl(field, !(isReadOnly || hasPrefil), true)
        c.value1 = ctrl.value1;
        c.value2 = {}
        for (var property in ctrl.value2) {
            if (ctrl.value2.hasOwnProperty(property)) {
                c.value2[property] = ctrl.value2[property]
            }
        }
        c.name = this.name;
        c.maxWidth = 300;
        // each row is ReferenceRow, and column value is row.value
        // tc.setCellValueFactory(
        //     (i) -> ((TableColumn.CellDataFeatures<ReferenceRow, DatabaseObject>) i).getValue().value);
        // create a new empty ReferenceRow when user needs new row
        // et.editTable.setNewRow(() -> getNewReferenceRow(et, st));
        return c;
    }

}