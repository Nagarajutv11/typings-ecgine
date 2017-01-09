import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { $e, AppLifeCycleHandler } from '../Ecgine';
import { ViewManager } from '../ViewManager';
import { IViewInput } from '../IViewInput'
import { RemoteServiceSyncProxy, RpcConfiguration } from '../RemoteServiceSyncProxy';

import * as eview from './eview.vue'

@Component({
    components: {
        eview
    }
})
export default class einit extends Vue {

    input: IViewInput={};

    @Lifecycle
    mounted() {
        let _this1 = this;
        $e.$http = this.$http;
        $e.appName = this.$route.params['appid']
        $e.loadScripts();        
        let vm = $e.service('ViewManager') as ViewManager;

        $e.ready(() => {
            let lc = $e.getApplication()
            if (lc) {
                if (lc.initialView) {
                    lc.initialView.beforeOpen({
                        openView: (input: IViewInput) => {
                            _this1.input = input;
                        },
                        proceed: () => {
                            vm.runCommand();
                        }
                    })
                } else {
                    vm.runCommand();
                }
            } else {
                vm.runCommand();
            }
        });
    }
}