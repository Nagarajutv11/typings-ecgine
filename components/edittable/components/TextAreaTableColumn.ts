
import {Vue, Component, Prop} from 'av-ts'
import * as TextAreaField from '../../formcontrol/components/TextAreaField.vue';



@Component({
    components:{TextAreaField}
})
export default class TextAreaTableColumn extends Vue {
    @Prop
	value:string = '';
    @Prop
    disable:boolean = false;

}