
import { Vue, Component, Prop } from 'av-ts'
import * as CheckBoxField from '../../formcontrol/components/CheckBoxField.vue';

@Component({
    components: { CheckBoxField }
})
export default class CheckBoxTableColumn extends Vue  {
    
    @Prop
    value: boolean;

    @Prop
    disable: boolean;
}