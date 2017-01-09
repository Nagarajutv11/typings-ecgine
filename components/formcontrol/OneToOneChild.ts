import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { Entity } from '../Entity';
import { ModelPaneGroup } from './ModelPaneGroup';
import { PropertyProvider } from '../PropertyProvider';
import { EntityRegistry } from '../EntityRegistry';
import { $e } from '../Ecgine';
import * as PropertiesPanel from './PropertiesPanel.vue';

@Component({
    components: { PropertiesPanel }
})
export default class OneToOneChild extends Vue {

    @Prop
    group: ModelPaneGroup;

    @Prop
    name: string;

    @Prop
    input:any

    @Prop
    property: string;

    @Prop
    pp: PropertyProvider

    childValue: any = {}
    childEntity: any = {}

    required = false;
    hasValue = false;

    @Lifecycle
    mounted() {
        this.hasValue = false;
        let field = this.input.entity.getField(this.property);
        let entity = field.referenceType;
        let es = $e.service("EntityRegistry") as EntityRegistry;
        this.childEntity = es.entity(entity);
    }
    
    onHasValueChange(e: any) {
        this.hasValue = e.target.checked
        //this.pp.value = this.childValue;
        if (this.hasValue) {

        } else {
            //TODO
        }
    }
}