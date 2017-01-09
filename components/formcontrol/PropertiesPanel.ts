import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { FormAction } from './FormAction';
import { ModelField } from './ModelField';
import { Entity } from '../Entity';
import { ModelPaneGroup } from './ModelPaneGroup';
import { PropertyProvider } from '../PropertyProvider';
import * as FormItem from './FormItem.vue';



@Component({
    components: { FormItem }
})
export default class PropertiesPanel extends Vue {

    @Prop
    group: ModelPaneGroup;

    @Prop
    input: any

    @Prop
    property: string;

    @Prop
    pp: PropertyProvider

    onPropertyChange(path: string) {
        this.pp.pp.onPropertyChange(path);
    }
}