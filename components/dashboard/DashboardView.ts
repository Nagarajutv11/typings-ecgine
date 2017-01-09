import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { DashboardInput } from './DashboardInput'
import { Dashboard } from './Dashboard'
import { $e } from '../Ecgine'
import { EntityRegistry } from '../EntityRegistry'
import { DatabaseObject } from '../DatabaseObject'
import { Portlet } from './Portlet'
import { DashboardService } from './DashboardService'
import * as portlet from './PortletView.vue'

@Component({ components: { portlet } })
export default class DashboardView extends Vue {

    @Prop
    input: DashboardInput

    leftportlets: any[] = []
    centerportlets: any[] = []
    rightportlets: any[] = []

    config: any = {};

    dashboard: Dashboard = { id: '', layout: '', personalize: true }

    @Lifecycle
    mounted() {
        this.$emit('title', 'Dashboard')
        let _this1 = this;
        this.dashboard = $e.singleExtPoint('org.ecgine.client.dashboard', 'id', this.input.dashboardId) as Dashboard;
        if (this.dashboard.personalize) {
            let ds = $e.service('org.ecgine.dashboard.service.DashboardService') as DashboardService
            ds.getDashboardConfigationByUser(_this1.dashboard.id, $e.appName).subscribe(c => {
                if (c == null) {
                    _this1.createConfig();
                } else {
                    _this1.config = c;
                }
                this.createDashboard()
            });
        } else {
            this.createConfig();
            this.createDashboard()
        }
    }

    createConfig() {
        let er = $e.service('EntityRegistry') as EntityRegistry
        let configEntity = er.entity('org.ecgine.dashboard.api.DashboardConfiguration')
        let dc = configEntity.newInstance() as any
        dc.dashboard = this.dashboard.id;
        dc.layout = this.dashboard.layout;

        let layouts: any[] = [];
        let layoutEntity = er.entity('org.ecgine.dashboard.api.PortletLayout')
        let portletEntity = er.entity('org.ecgine.dashboard.api.Portlet')
        $e.multiExtPoint('org.ecgine.client.portletLayout', 'dashboard', dc.dashboard, p => {
            let l = layoutEntity.newInstance() as any;
            l.position = p.position;
            l.expanded = p.expanded
            l.isDisabled = p.isDisabled
            l.isSticky = p.isSticky
            let portlet = $e.singleExtPoint('org.ecgine.client.portlet', 'id', p.portlet)
            let port = portletEntity.newInstance() as any;
            port.portletInputProvider = portlet.portletInputProvider;
            port.portletType = portlet.portletType;
            port.input = portlet.input;
            l.portlet = port;
            layouts.push(l)
        });
        dc.portletLayouts = layouts;

        this.config = dc;
    }

    createDashboard() {
        if (this.dashboard.layout == 'Left') {
            this.leftportlets = this.createPortlets('Left')
        }
        if (this.dashboard.layout == 'Right') {
            this.rightportlets = this.createPortlets('Right')
        }
        if (this.dashboard.layout == 'Both') {
            this.leftportlets = this.createPortlets('Left')
            this.rightportlets = this.createPortlets('Right')
        }
        this.centerportlets = this.createPortlets('Center')
    }

    createPortlets(layout: string): any[] {
        let layouts = this.config.portletLayouts as any[];
        return layouts.filter(l => { return l.position == layout });
    }
}