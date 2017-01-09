import { Vue, Component, Prop, Lifecycle } from 'av-ts'

@Component
export default class LinkField extends Vue {

    @Prop
    value: any;

    @Prop
    disable: boolean;
    
    get displayValue() {        
        return this.value;
    }
}