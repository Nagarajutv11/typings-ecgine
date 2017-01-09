import {Vue, Component, Prop, Lifecycle} from 'av-ts';
import {$e} from '../Ecgine';
import {Menu} from '../Models';

@Component({name:'esubmenu'})
export default class esubmenu extends Vue {

    @Prop
    menu:Menu

    appid:string=''

    @Lifecycle
    mounted(){
        this.appid=$e.appName;
    }
}