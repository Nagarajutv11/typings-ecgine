
import { Vue, Component, Prop } from 'av-ts'
import * as DoubleField from '../../formcontrol/components/DoubleField.vue';

@Component({
    components: { DoubleField }
})
export default class DoubleFieldTableColumn extends Vue  {
    @Prop
    value: number = 0;
    @Prop
    value2: Object;
    @Prop
    disable: boolean = false;
}