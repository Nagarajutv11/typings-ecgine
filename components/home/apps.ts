import { Vue, Component, Lifecycle } from 'av-ts'
import { $e } from '../Ecgine';
import { RemoteServiceSyncProxy } from '../RemoteServiceSyncProxy';

@Component
export default class Apps extends Vue {
    apps: Object[] = [];

    @Lifecycle
    mounted() {
        $e.$http = this.$http;
        let _this = this;
        var proxy = $e.service("RemoteServiceSyncProxy") as RemoteServiceSyncProxy;
        proxy.sendEcgineRequest("/org.ecgine.webui/u/apps", {},
            function (appsresp: Object) {
                let asps = appsresp as Object[];
                _this.apps = [];
                asps.forEach(a => {
                    _this.apps.push(a);
                });
            })
    }

    openApp(appId: string) {
        $e.appName = appId;
        this.$router.push({
            name: 'init',
            params: { appid: appId }
        })
    }
}