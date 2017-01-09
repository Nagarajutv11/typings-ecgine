
// import {requirejs} from 'requirejs';
import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { $e } from '../Ecgine';
import { Menu } from '../Models';
import * as TopBarComponent from './TopBarComponent.vue';
import * as emenu from './emenu.vue';
import * as homeview from './homeview.vue';
import * as BottomBarComponent from './BottomBarComponent.vue';
import * as edialog from './edialog.vue';

@Component({
    components: { TopBarComponent, homeview, emenu, BottomBarComponent, edialog }
})
export default class Home extends Vue {


    menus: Menu[] = [];

    @Lifecycle
    mounted() {
        $e.$http = this.$http;
        $e.appName = this.$route.params['appid']
        $e.loadScripts(); 
        this.menus = $e.extPoint('org.ecgine.client.menu');
    }
}