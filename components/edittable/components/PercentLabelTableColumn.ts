
import {Vue, Component, Prop} from 'av-ts'
import * as PercentageLabel from '../../formcontrol/components/PercentageLabel.vue';



@Component({
 	components:{PercentageLabel}
})
export default class PercentLabelTableColumn extends Vue {
	@Prop
	value:string = '';
	@Prop
	value2:Object;
}