
import { Vue, Component, Prop } from 'av-ts'
import LocalFormats from '../LocalFormats';



@Component
export default class DoubleField extends Vue {

	@Prop
	value: number;

	@Prop
	value2: Input;

	@Prop
	disable: boolean;

	onChange(e: any) {
		this.$emit('change', e.target.value)
	}
}
class Input {

	localFormats: LocalFormats;

}