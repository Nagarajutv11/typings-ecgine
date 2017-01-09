//import * as requirejs from 'requirejs';
import { Vue, Component, Prop, Watch, Lifecycle } from 'av-ts'
import { $e } from '../Ecgine';
import { IViewInput } from '../IViewInput'
import * as unknownview from './unknownview.vue'


@Component({
    components: { unknownview }
})
export default class EView extends Vue {

    @Prop
    input: IViewInput

    @Prop
    closeHandler: (listener: (close: (close: boolean) => void) => void) => void;

    closeListeners: ((close: (can: boolean) => void) => void)[] = []

    @Lifecycle
    created() {
        this.closeListeners = []
        if (this.closeHandler) {
            this.closeHandler(this.closeView)
        }
    }

    addCloseListener(listener: (close: (can: boolean) => void) => void) {
        this.closeListeners.push(listener);
    }

    closeView(close: (close: boolean) => void): void {
        let result: boolean;
        let size = this.closeListeners.length;
        if (size == 0) {
            close(true);
            return;
        }
        for (let i in this.closeListeners) {
            this.closeListeners[i]((v: boolean) => {
                size--;
                if (v) {
                    if (size == 0) {
                        close(true);
                    }
                } else {
                    close(false);
                }
            });
        }
    }

    onClose() {
        this.$emit('close')
    }
}