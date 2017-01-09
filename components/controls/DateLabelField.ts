
import { Vue, Component, Prop, Lifecycle } from 'av-ts'



@Component
export default class DateLabelField extends Vue {

    @Prop
    value: any;

    @Prop
    disable: boolean;
    
    get displayValue() {
        if (!this.value) {
            return '';
        }       
        return this.value.toLocaleDateString();
    }
}