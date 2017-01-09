import { Vue, Component, Prop } from 'av-ts'
import * as AudioField from '../../formcontrol/components/AudioField.vue';

@Component({
    components: { AudioField }
})
export default class AudioEditTableColumn extends Vue  {
    @Prop
    value: string = '';
    @Prop
    disable: boolean = false;
}