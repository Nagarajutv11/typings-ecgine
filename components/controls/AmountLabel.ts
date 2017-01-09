
import { Vue, Component, Prop } from 'av-ts'
import LocalFormats from '../LocalFormats';

@Component
export default class AmountLabel extends Vue {
    @Prop
    value: string;
    @Prop
    value1: String;
    @Prop
    value2: Input;
}

class Input {

    localFormats: LocalFormats;
}