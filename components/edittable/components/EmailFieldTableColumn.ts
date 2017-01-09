
import { Vue, Component, Prop } from 'av-ts'
import * as EmailField from '../../formcontrol/components/EmailField.vue';


@Component({
	components: { EmailField }
})
export default class EmailFieldTableColumn extends Vue  {
	@Prop
	value: string = '';
	@Prop
	disable: boolean = false;
}