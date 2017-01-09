import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { PortletInput } from './PortletInput'
import { $e } from '../Ecgine'

import * as eview from '../home/eview.vue'

@Component({
    components: {
        eview
    }
})
export default class PortletView extends Vue {

    @Prop
    layout: any;

    input: PortletInput | undefined = undefined

    @Lifecycle
    mounted() {
        let type = $e.singleExtPoint('org.ecgine.client.portletType', 'id', this.layout.portlet.portletType);
        if (!this.layout.portlet.input) {
            let portlet = $e.singleExtPoint('org.ecgine.client.portlet', 'id', this.layout.portlet.portletInputProvider)
            this.layout.portlet.input = portlet.input;
        }
        this.input = {
            viewName: type.view,
            portlet: this.layout.portlet,
            context: {
                
            }
        }
    }
    
    onRefresh() {

    }
    
    onClose() {

    }

    onTitleChange(title: string) {

    }
}