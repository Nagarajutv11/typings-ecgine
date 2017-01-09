
import { Vue, Component, Prop } from 'av-ts'
import LocalFormats from '../LocalFormats';



@Component
export default class PercentageLabel extends Vue {
	
	@Prop
	value: string;
}

class Input {

	localFormats: LocalFormats;
}