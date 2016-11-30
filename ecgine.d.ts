// Generated by typings
// Source: https://raw.githubusercontent.com/nagarajutv11/typings-ecgine/master/ecgine.d.ts

// Generated by typings
// Source: ../ecgine/index.d.ts

export interface Ecgine {

    //Need to call when ecgine obj is ready
    ready(onload: Callback): void;

    addCommand(id: string, command: () => IViewInput): void;

    getCommand(id: string): () => IViewInput;

    addExtPoint(appName: string, points: Supplier<{ [name: string]: any[]; }>): void;

    //Return all values of given extPoint
    extPoint(extPoint: string): any[];

    service(serviceName: string): any;

    register(serviceName: string, service: any): void;

    required(serviceName: string): void;

    addHelper(fullName: string, helper: FormHelper<any>): void;

    singleton(fullName: string): any;

    scriptDone(scriptName: string): void;
}

export declare interface Command {
    id: string
    command: () => void
}

export declare interface Callback {
    (): void;
}

export declare interface Supplier<T> {
    (): T;
}

export declare interface Consumer<T> {
    (val: T): void;
}

export declare interface FormHelper<T> {
    getDefaultValues(): { [prop: string]: Computation<T, any> };
    getComputations(): { [prop: string]: Computation<T, any> };
    getExistancyConditions(): { [prop: string]: Computation<T, boolean> };
    getCustomWriteControls(): { [prop: string]: Computation<T, boolean> };
    getReferenceFroms(): { [prop: string]: Computation<T, any[]> };
}

export declare interface Computation<T, R> {
    compute($e: any, instance: T, callback: { new (val: R): void }): void;
}

export declare interface ViewManager {
    runCommand(id: string, params?: { [key: string]: string }): void;
    openView(input: IViewInput): void;
}

export declare interface IViewInput {
    viewName: string;
}

export declare interface IView {

}

export declare interface Menu {
    name: string
    id?: string
    command?: string;
    submenus?: Menu[]
}

export declare interface UIBaseDatabaseService {

}

export declare interface DashboardService {

}
export declare interface SavedSearch {

}
export declare interface SavedSearchService {

}
export declare interface DatabaseObject {
    _type: string;
}
export declare interface EntityRegistry {
    entity(fullName: string): Entity;
}

export declare interface Entity {
    newInstance(): DatabaseObject;
}

export declare interface FormInput extends IViewInput {
    instance: DatabaseObject;
    isEdit: boolean;
    databaseService?: UIBaseDatabaseService;
    openedFromViewMode?: boolean;
    preAddNew?: Consumer<any>;
}

export declare interface DashboardInput extends IViewInput {
    dashboardId: string;
    databaseService?: UIBaseDatabaseService;
    dashboardService?: DashboardService;
}

export declare interface ListViewInput extends AbstractListViewInput {
    isSummary?: boolean;
    isPortlet?: boolean;
}

export declare interface CalendarListViewInput extends AbstractListViewInput {
    displayColumn: string;
    startDateColumn: string;
    endDateColumn: string;
    groupBy: string;
}
export interface AbstractListViewInput extends IViewInput {
    cls: string;
    savedSearch?: SavedSearch;
    filterValues?: { [name: string]: any };
    dbService?: UIBaseDatabaseService;
    savedSearchService?: SavedSearchService;
    isPreview?: boolean;
}

export interface ReportInput extends IViewInput {
    reportBuilder: string
    isPortlet?: boolean
}

export declare interface Portlet {
    id?: string
    name: string;
    portletType: string;
    input: PortletInput;
    portletInputProvider?: Supplier<PortletInput>;
}

export declare interface ListPortletInput extends PortletInput {
    searchBuilder: string;
    savedSearch?: string;
    limit?: number;
    isSummary?: boolean;
    dbService?: UIBaseDatabaseService;
    savedSearchService?: SavedSearchService;
}

export declare interface ChartPortletInput extends PortletInput {
    reportBuilder: string
    chartType: string
    xAxis: string
    yAxis: string
    groupBy: string
    legendPosition?: string
}

export declare interface ReportPortletInput extends PortletInput {
    reportBuilder: string
    limit?: number
}

export declare interface QuickLinkInput extends PortletInput {
}

export interface PortletInput {
    name: string;
}

export declare interface PortletLayout {
    id?: string
    dashboard: string;
    portlet: string;
    position: string;
    expanded?: boolean;
    isDisabled?: boolean;
    isSticky?: boolean;
}

export declare interface AppLifeCycleHandler {

    /**
     * Will be called before opening the application.
     * 
     * @param parent
     *            for showing controls in the stage
     * @param context
     *            for proceeding the task
     */
    beforeOpen(context: AppLifeCycleContext): void;

    /**
     * Will be called before showing the default view.
     */
    beforeOpenDefaultView(): void;

    /**
     * Will be called after opening the default view.
     */
    afterOpenDefaultView(): void;

    /**
     * Will be called before close.
     */
    onCloseRequest(context: AppLifeCycleContext): void;

    /**
     * Will be called after closing the application.
     */
    afterClose(): void;
}

export declare interface AppLifeCycleContext {
    proceed(): void
}

export declare interface RelatedList {
    name: string
    model: string
    savedSearch: string
    showHeader?: boolean
    mapings?: { [key: string]: string }
}