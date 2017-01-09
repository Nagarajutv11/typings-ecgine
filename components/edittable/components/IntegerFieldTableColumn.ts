
import {Vue, Component, Prop} from 'av-ts'
import * as IntegerField from '../../formcontrol/components/IntegerField.vue';



@Component({
    components:{IntegerField}
})
export default class IntegerFieldTableColumn extends Vue {
    @Prop
	value:number = 0;
    @Prop
	value2:Object;
    @Prop
	disable:boolean = false;
}