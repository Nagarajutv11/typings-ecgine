
import { Vue, Component, Prop, Lifecycle } from 'av-ts'



@Component
export default class CheckBoxField extends Vue {

    @Prop
    value: boolean;

    @Prop
    disable: boolean;

    onChange(e: any) {
        this.$emit('change', e.target.checked)
    }
}