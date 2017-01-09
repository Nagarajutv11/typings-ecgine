
import {Vue, Component, Prop} from 'av-ts'
import * as TextField from '../../formcontrol/components/TextField.vue';



@Component({
    components:{TextField}
})
export  default class TextFieldTableColumn  extends Vue{
    
    @Prop
	value:string;

    @Prop
    disable:boolean;
}