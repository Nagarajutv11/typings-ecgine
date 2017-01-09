import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { PortletInput } from './PortletInput'
import { ListViewInput } from '../ListViewInput';

@Component()
export default class ListPortletViewControl extends Vue {

    @Prop
    input: any;

    listInput: ListViewInput | undefined = undefined;

    @Lifecycle
    mounted() {
        let lvi: ListViewInput;
        let ins = this.input.portlet.input;
        if (ins.savedSearch) {
            lvi = { isSummary: ins.isSummary, isPortlet: true, isPreview: false, filterValues: {}, cls: '', dontShowHeader: true }
        } else {
            lvi = { limit: ins.limit, isSummary: ins.isSummary, isPortlet: true, isPreview: false, filterValues: {}, cls: ins.searchBuilder, dontShowHeader: true }
        }
        this.listInput = lvi;
    }
}