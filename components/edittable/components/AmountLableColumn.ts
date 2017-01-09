import { Vue, Component, Prop } from 'av-ts'
import * as AmountLabel from '../../formcontrol/components/AmountLabel.vue';

@Component({
	components: { AmountLabel }
})
export default class AmountLableColumn extends Vue  {
	@Prop
	value: string = '';
	@Prop
	value2: Object;
}