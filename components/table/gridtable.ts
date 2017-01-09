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
import { NewViewDecider } from '../NewViewDecider';
import * as etable from '../table/etable.vue';


@Component({
    components: { etable }
})
export default class GridTable extends Vue {

    @Prop
    value: any;

    @Prop
    entity: Entity;

    @Prop
    property: string;

    @Prop
    group: ModelPaneGroup;

    @Prop
    pp: PropertyProvider

    @Prop
    isEdit: boolean;

    rpcConfiguration: any;
    parent: string;
    rows: any[] = []
    referenceType: Entity | undefined = undefined;
    field: Field | null = null;

    @Lifecycle
    mounted() {
        this.createEmptyRows();
        this.pp.parent.pp.addWatcher(this.property, 'grid table', () => {
            this.createEmptyRows();
        });
        let field = this.entity.getField(this.property);
        this.field = field;
        let entity = field.referenceType;
        let es = $e.service("EntityRegistry") as EntityRegistry;
        this.referenceType = es.entity(entity);
    }

    createEmptyRows() {
        let rows = this.value[this.property] as any[];
        if (rows && this.rows == rows) {
            return;
        }
        if (!rows) {
            rows = []
            this.value[this.property] = rows;
        }
        this.rows = rows;
    }

    addNewRow() {
        if (this.referenceType) {
            let _this1 = this;
            NewViewDecider.showNewView(this.entity, this.property, (v: any) => {
                if (v) {
                    _this1.rows.push(v)
                    _this1.pp.onPropertyChange(this.property);
                }
            }, true);
        }
    }

    getColumns(): TableColumn[] {
        let field = this.entity.getField(this.property);
        if (field == null) {
            return [];
        }
        let fields = this.group.fields;
        let entity = field.referenceType;
        let es = $e.service("EntityRegistry") as EntityRegistry;
        let referenceType = es.entity(entity);

        let columns: TableColumn[] = [];

        fields.forEach(f => {
            if (!ControlUtils.canCreatePropertyControl(f, this.value, this.isEdit)) {
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
}