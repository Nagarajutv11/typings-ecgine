import { Vue, Component, Lifecycle } from 'av-ts'
import { $e } from '../Ecgine';
import { EcgineService } from '../EcgineService';

import * as treerow from '../table/treetable.vue'
import * as test from './test.vue'

@Component({
    components: { treerow, test }
})
export default class Login extends Vue {
    emailId: string = "";
    password: string = "";
    errormessage: string = "";
    columns: any[] = [];
    root: any = undefined;
    testVal = { name: undefined }

    @Lifecycle
    mounted() {
        this.columns = [{ id: 'type', name: 'Type', component: 'LabelField' },
        { id: 'amount', name: 'Amount', component: 'LabelField' }, { id: 'total', name: 'Total', component: 'LabelField' }]

        this.root = {
            name: 'root', subitems: [
                {
                    name: 'Level1', row: { type: 'Level1', amount: '10', total: '10' }, subitems: [
                        { name: 'Level1-1', row: { type: 'Level1-1', amount: '110', total: '110' } },
                        { name: 'Level1-2', row: { type: 'Level1-2', amount: '111', total: '111' } },
                        { name: 'Level1-3', row: { type: 'Level1-3', amount: '112', total: '112' } }
                    ]
                },
                {
                    name: 'Level2', row: { type: 'Level2', amount: '11', total: '11' }, subitems: [
                        { name: 'Level2-1', row: { type: 'Level2-1', amount: '120', total: '120' } },
                        { name: 'Level2-2', row: { type: 'Level2-2', amount: '121', total: '121' } },
                        { name: 'Level2-3', row: { type: 'Level2-3', amount: '122', total: '122' } }
                    ]
                },
                { name: 'Level3', row: { type: 'Level3', amount: '12', total: '12' } }
            ]
        }
    }

    login() {
        let es: EcgineService = $e.service('EcgineService');
        es.doLogin({
            email: this.emailId,
            password: this.password,
            client_id: 'ecgine-web',
            client_secret: '',
            device_id: '0123456789',
            loginfromweb: true
        }, () => {
            if (this.$route.query['target']) {
                this.$router.push(this.$route.query['target'])
            } else {
                this.$router.push('/apps');
            }
        }, (reason: any) => {
            alert("Login failed :" + reason.status)
        });
    }
}
