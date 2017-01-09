
import {Vue, Component, Prop} from 'av-ts'
import * as IPAddressField from '../../formcontrol/components/IPAddressField.vue';



@Component({
    components:{IPAddressField}
})
export default class IPAddressFieldTableColumn extends Vue {
    @Prop
	value:string = '';
    @Prop
    disable:boolean = false;

}