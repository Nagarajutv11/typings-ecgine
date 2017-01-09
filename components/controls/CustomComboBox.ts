import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { $e } from '../Ecgine';
import { ViewManager } from '../ViewManager';

@Component
export default class CustomComboBox extends Vue {

    @Prop
    value: any;

    @Prop
    value1: any[];

    @Prop
    value2: any;

    @Prop
    disable: boolean

    @Prop
    name: string

    selectedValue: any = null

    list: any[] = []

    @Lifecycle
    mounted() {
        this.selectedValue = this.value;
        this.list = this.value1;
        if (!this.list) {
            this.list = [];
        }
        let this1 = this;
        this.$watch('value', (v) => {
            this1.selectedValue = v;
        })
        this.$watch('value1', (v) => {
            this1.list = v;
        })
    }

    onAddNew() {
        this.$emit('click', 'addNew');
    }

    get selectedIndex() {
        if (this.selectedValue == null) {
            return -1;
        }
        for (var i = 0; i < this.value1.length; i++) {
            let v = this.value1[i];
            if (v._type) {
                if (v.id) {
                    if (v.id == this.selectedValue.id) {
                        return i;
                    }
                }
            }
        }
        let ind = this.value1.indexOf(this.selectedValue);
        if (ind != -1) {
            return ind;
        }
        for (var i = 0; i < this.value1.length; i++) {
            let v = this.value1[i];
            if (v.displayName == this.selectedValue.displayName) {
                this.selectedValue = v;
                return i;
            }
        }
        return -1;
    }

    onChange(e: any) {
        let i = parseInt(e.target.value) + 1;
        let v;
        if (i == 0) {
            v = null;
        } else {
            v = this.value1[i - 1];
        }
        this.selectedValue = v;
        this.$emit('change', v)
    }
}