
import {Vue, Component, Prop} from 'av-ts'



@Component
export default class AttachmentField extends Vue {
	@Prop
    value:string;
    @Prop
    disable:boolean;
}