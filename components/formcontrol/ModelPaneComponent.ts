import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { ModelPane } from './ModelPane';
import { Entity } from '../Entity';
import { Field } from '../Field';
import * as PropertiesPanel from './PropertiesPanel.vue';
import * as OneToOneChild from './OneToOneChild.vue';
import * as UnknownField from '../controls/UnknownField.vue';
import * as EditTable from '../table/edittable.vue';
import * as GridTable from '../table/gridtable.vue';
import * as ReferenceEditTable from '../table/ReferenceEditTable.vue';
import * as AttachmentsTable from '../table/AttachmentsTable.vue';

@Component({
    name: 'model-pane-component',
    components: { PropertiesPanel, EditTable, GridTable, OneToOneChild, ReferenceEditTable, AttachmentsTable, UnknownField }
})
export default class ModelPaneComponent extends Vue {

    @Prop
    modelpane: ModelPane;

    @Prop
    name: string;

    @Prop
    input: any;

    groupInput: any = undefined;

    selectedTab: ModelPane | any = undefined;

    @Lifecycle
    created() {
        this.groupInput = { value: this.input.value, entity: this.input.entity, isEdit: this.input.isEdit }
        if (this.modelpane.tabs.length > 0) {
            this.selectedTab = this.modelpane.tabs[0]
        }
    }
    
    private getComponent(fieldName: string): string {
        if (!fieldName) {
            return "PropertiesPanel"
        }
        let field = this.input.entity.getField(fieldName);
        if (field == null) {
            return 'UnknownField'
        }
        if (field.attachmentType) {
            return 'AttachmentsTable'
        }

        let releation = this.getPropertyRelation(field);
        if (releation === null) {
            return "PropertiesPanel";
        }
        switch (releation) {
            case "OneManyChildren":
                if (this.modelpane.collectionDisplayType) {
                    return this.modelpane.collectionDisplayType;
                } else {
                    return 'EditTable'
                }
            case "OneManyReference":
                return "ReferenceEditTable";
            case "OneOneChild":
                return "OneToOneChild";
            case "ManyOneReference":
                return 'PropertiesPanel'
        }
        return "UnknownField";
    }

    private getPropertyRelation(field: Field): string | null {
        if (field.type !== "REFERENCE") {
            return null
        }
        if (field.isCollection && field.isChild) {// OneManyChildren
            return "OneManyChildren";
        } else if (field.isCollection) {// OneManyReference
            return "OneManyReference";
        } else if (field.isChild || field.isEmbedded) {// OneOneChild
            return "OneOneChild";
        }
        return "ManyOneReference";
    }

    onTabClick(tab: ModelPane) {
        this.selectedTab = tab;
    }

    onPropertyChange(path: string) {
        this.modelpane.pp.onPropertyChange(path)
        this.$emit('propertyChange', path)
    }
}

