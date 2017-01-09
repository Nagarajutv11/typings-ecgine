import { Vue, Component, Prop, Lifecycle } from 'av-ts';
import { $e } from '../Ecgine';
import { Menu } from '../Models';
import * as esubmenu from './esubmenu.vue';

@Component({ components: { esubmenu } })
export default class emenu extends Vue {
    @Prop
    menus: any[]

    appid: string = ''

    @Lifecycle
    created() {
        this.appid = this.$route.params['appid'];
    }

    handleSelect(key:string,path:string){}
}