import { Vue, Prop, Component, Lifecycle } from 'av-ts'
@Component
export default class test extends Vue {

    @Prop
    value: any;


    changeText() {
        this.value.name = 'Changed'
    }
}