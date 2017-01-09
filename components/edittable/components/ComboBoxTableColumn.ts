
import {Vue, Component, Prop} from 'av-ts'
import * as CustomComboBox from '../../formcontrol/components/CustomComboBox.vue';

@Component({
	components:{CustomComboBox}
})
export default class ComboBoxTableColumn extends Vue  {
    @Prop
	value:Object;
    @Prop
    value1:String = '';
    @Prop
    value2:Object;
    @Prop
    disable:boolean =false;
}