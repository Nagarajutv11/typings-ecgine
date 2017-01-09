
import {Vue, Component, Prop} from 'av-ts'
import * as UrlField from '../../formcontrol/components/UrlField.vue';



@Component({
    components:{UrlField}
})
export default class UrlFieldTableColumn extends Vue {
    @Prop
	value:string = '';
    @Prop
    disable:boolean = false;
}