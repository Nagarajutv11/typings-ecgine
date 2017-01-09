
import {Vue, Component, Prop} from 'av-ts'



@Component
export  default class TimePickerTableColumn  extends Vue{
	@Prop
	value:string = '';
	@Prop
    disable:boolean = false;
}