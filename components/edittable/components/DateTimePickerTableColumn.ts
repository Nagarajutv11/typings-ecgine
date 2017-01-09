
import {Vue, Component, Prop} from 'av-ts'
import * as DateTimeField from '../../formcontrol/components/DateTimeField.vue';


@Component({
	components:{DateTimeField}
})
export default class DateTimePickerTableColumn extends Vue  {
	@Prop
	value:Date;
	@Prop
    disable:boolean = false;
}