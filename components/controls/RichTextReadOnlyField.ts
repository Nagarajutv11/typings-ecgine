
import { Vue, Component, Prop } from 'av-ts'



@Component
export default class RichTextReadOnlyField extends Vue {
    @Prop
    value: string;
}