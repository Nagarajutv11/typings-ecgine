
import {Vue, Component, Prop} from 'av-ts'
import * as PhoneField from '../../formcontrol/components/PhoneField.vue';



@Component({
    components:{PhoneField}
})
export default class PhoneFieldTableColumn extends Vue {
    @Prop
	value:number = 0;
    @Prop
	disable:boolean = false;
}