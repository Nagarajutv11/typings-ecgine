
import { Vue, Component, Prop } from 'av-ts'



@Component
export default class ImageField extends Vue {

    @Prop
    value: String

    @Prop
    disable: Boolean
}