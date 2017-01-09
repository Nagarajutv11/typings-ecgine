
import { Vue, Component, Prop } from 'av-ts'
import * as BigDecimalPercentagField from '../../formcontrol/components/BigDecimalPercentagField.vue';

@Component({
    components: { BigDecimalPercentagField }
})
export default class BigDecimalPercentagFieldTableColumn extends Vue  {
    @Prop
    value: number = 0;
    @Prop
    value1: string = '';
    @Prop
    value2: Object;
    @Prop
    disable: boolean = false;
}