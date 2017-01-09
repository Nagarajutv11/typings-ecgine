import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { PortletInput } from './PortletInput'
import { ReportInput } from '../ReportInput';

@Component()
export default class ReportPortletViewControl extends Vue {

    @Prop
    input: any;

    reportInput: ReportInput | undefined = undefined;

    @Lifecycle
    mounted() {
        let rvi: ReportInput;
        let ins = this.input.portlet.input;
        if (ins.reportBuilder) {
            rvi = { isPortlet: true, filterValues: {}, reportBuilder: '' }
        } else {
            rvi = { isPortlet: true, filterValues: {}, reportBuilder: ins.searchBuilder }
        }
        this.reportInput = rvi;
    }
}