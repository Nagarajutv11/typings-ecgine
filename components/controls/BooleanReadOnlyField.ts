
import { Vue, Component, Prop, Lifecycle } from 'av-ts'

@Component
export default class BooleanReadOnlyField extends Vue {

    @Prop
    value: boolean;
}