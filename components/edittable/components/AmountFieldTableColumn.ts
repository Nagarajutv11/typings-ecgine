
import { Vue, Component, Prop } from 'av-ts'
import * as AmountField from '../../formcontrol/components/AmountField.vue';

@Component({
    components: { AmountField }
})
export default class AmountFieldTableColumn extends Vue  {
    @Prop
    value: number = 0;
    @Prop
    value1: string = '';
    @Prop
    value2: Object;
    @Prop
    disable: boolean = false;
}