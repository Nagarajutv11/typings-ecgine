//import * as requirejs from 'requirejs';
import { Vue, Component, Prop, Watch, Lifecycle } from 'av-ts'
import { $e } from '../Ecgine';
import { IViewInput } from '../IViewInput'
import * as eview from './eview.vue'


@Component({
    components: { eview }
})
export default class Homeview extends Vue {

    @Prop
    viewid: string

    tabs: Tab[] = []
    selectedTab: Tab | undefined = undefined

    viewnotfound: boolean = true;

    @Lifecycle
    created() {
        this.tabs = []
        this.$watch('viewid', this.viewIdChanged);
        if (this.viewnotfound) {
            this.viewIdChanged();
        }
    }

    viewIdChanged() {
        $e.ready(() => {
            if (!this.viewid) {
                return;
            }

            let tabId = this.prepareTabId(this.viewid);

            for (let i in this.tabs) {
                if (this.tabs[i].id == tabId) {
                    this.selectedTab = this.tabs[i];
                    return;
                }
            }
            let command = $e.getCommand(this.viewid)
            if (command) {
                let input = command(this.$route.query, (i: any) => {
                    let tab = { viewid: this.viewid, input: i, label: 'NoTitle' + this.tabs.length, id: tabId, query: this.$route.query };
                    this.openTab(tab);
                });
                if (input) {
                    let tab = { viewid: this.viewid, input: input, label: 'NoTitle' + this.tabs.length, id: tabId, query: this.$route.query };
                    this.openTab(tab);
                }
            } else {
                this.viewnotfound = true
                let input = { viewName: 'unknownview', name: this.viewid } as any
                let tab = { viewid: this.viewid, input: input, label: 'Not Found', id: tabId }
                this.openTab(tab);
            }
        });
    }

    prepareTabId(viewId: string): string {
        return this.$route.fullPath;
    }

    onTabClick(tab: Tab) {
        this.$router.push({ name: 'home', params: { appid: $e.appName, viewid: tab.viewid }, query: tab.query })
    }

    openTab(tab: Tab) {
        this.tabs.push(tab)
        this.selectedTab = tab;
    }

    addCloseListener(tab: Tab, listener: (close: (can: boolean) => void) => void) {
        tab.closeListener = listener;
    }

    onCloseTab(tab: Tab): void {
        if (tab.closeListener) {
            tab.closeListener((v: boolean) => {
                if (v) {
                    this.closeTab(tab);
                }
            })
        } else {
            this.closeTab(tab);
        }
    }

    closeTab(tab: Tab) {
        this.tabs.splice(this.tabs.indexOf(tab), 1);
        if (this.tabs.length != 0) {
            this.onTabClick(this.tabs[this.tabs.length - 1])
        } else {
            this.$router.push({ name: 'home', params: { appid: $e.appName } })
        }
    }
}

export class Tab {
    label: string
    id: string
    viewid: string
    query?: any
    input?: IViewInput
    closeListener?: ((close: (can: boolean) => void) => void)
}