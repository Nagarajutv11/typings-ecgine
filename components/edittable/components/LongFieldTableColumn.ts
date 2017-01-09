
import {Vue, Component, Prop} from 'av-ts'
import * as LongField from '../../formcontrol/components/LongField.vue';



@Component({
	components:{LongField}
})
export default class LongFieldTableColumn extends Vue {
    @Prop
	value:number = 0;
    @Prop
    value2:Object;
    @Prop
    disable:boolean = false;
}