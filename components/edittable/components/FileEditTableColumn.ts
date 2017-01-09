
import {Vue, Component, Prop} from 'av-ts'
import * as AttachmentField from '../../formcontrol/components/AttachmentField.vue';



@Component({
    components:{AttachmentField}
})
export default class FileEditTableColumn extends Vue {
    @Prop
	value:string = '';
    @Prop
    disable:boolean = false;
}