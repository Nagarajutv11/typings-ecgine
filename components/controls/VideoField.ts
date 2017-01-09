
import {Vue, Component, Prop} from 'av-ts'



@Component
export default class VideoField extends Vue {
	@Prop
    value:String
    
    @Prop
    disable:Boolean
}