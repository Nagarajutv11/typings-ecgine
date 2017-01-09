
import {Vue, Component, Prop} from 'av-ts'



@Component
export class AudioField extends Vue{
	@Prop
    value:string;
    @Prop
    disable:boolean;
}