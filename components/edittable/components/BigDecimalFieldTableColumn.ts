
import { Vue, Component, Prop } from 'av-ts'
import * as BigDecimalInputField from '../../formcontrol/components/BigDecimalInputField.vue';

@Component({
    components: { BigDecimalInputField }
})
export default class BigDecimalFieldTableColumn extends Vue  {
    @Prop
    value: number = 0;
    @Prop
    value1: string = '';
    @Prop
    value2: Object;
    @Prop
    disable: boolean = false;
}