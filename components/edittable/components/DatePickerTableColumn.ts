
import {Vue, Component, Prop} from 'av-ts'
import * as DateField from '../../formcontrol/components/DateField.vue';

@Component({ 
 	components:{DateField}
})
export default class DatePickerTableColumn extends Vue  {
	@Prop
	value:Date;
	@Prop
    disable:boolean = false;
}



