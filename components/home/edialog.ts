import { Vue, Component, Lifecycle, Watch } from 'av-ts'
import { ViewManager } from '../ViewManager'
import { $e } from '../Ecgine'
import { IViewInput } from '../IViewInput'
import * as eview from './eview.vue'

@Component({
    name: 'edialog',
    components: { eview }
})
export default class Edialog extends Vue {

    show: boolean = false;

    title: string = ''

    id: string = 'modelId0'

    input: IViewInput | undefined = undefined

    closeListener: ((close: (can: boolean) => void) => void) | undefined = undefined

    @Lifecycle
    created() {
        let vm = $e.service('ViewManager') as ViewManager;
        this.id = 'modelId' + vm.dialogsSize()
        let _this1 = this as any;
        var $: any = (window as any).$
        vm.addDialogListener((title: string, input: IViewInput) => {
            _this1.title = title;
            _this1.input = input;
            _this1.show = true;
            $('#' + _this1.id).modal();
        }, () => {
            if (this.closeListener) {
                this.closeListener((v: boolean) => {
                    if (v) {
                        $('#' + _this1.id).modal("hide");
                    }
                })
            } else {
                $('#' + _this1.id).modal("hide");
            }
        });
    }

    addCloseListener(listener: (close: (can: boolean) => void) => void) {
        this.closeListener = listener;
    }

    onClose() {
        this.input = undefined;
        this.closeListener = undefined;
        if (this.show) {
            let vm = $e.service('ViewManager') as ViewManager;
            vm.dialogClosed();
        }
        this.show = false;
    }
}