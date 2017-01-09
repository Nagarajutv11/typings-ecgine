
import { Vue, Component, Prop, Lifecycle } from 'av-ts'



@Component
export default class LabelField extends Vue {

    @Prop
    value: any;

    @Prop
    disable: boolean;
    
    get displayValue() {
        if (!this.value) {
            return '';
        }
        if (typeof this.value === 'object') {
            return this.value.displayName;
        }
        return this.value;
    }
}