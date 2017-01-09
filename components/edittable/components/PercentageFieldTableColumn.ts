
import {Vue, Component, Prop} from 'av-ts'
import * as PercentageField from '../../formcontrol/components/PercentageField.vue';



@Component({
    components:{PercentageField}
})
export default class PercentageFieldTableColumn extends Vue {
    @Prop
	value:number = 0;
    @Prop
    value2:Object;
    @Prop
    disable:boolean = false;
}