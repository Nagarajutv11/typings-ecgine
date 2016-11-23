import * as E from "./ecgine";

declare namespace Ecgine {
    export var $e: E.Ecgine;
    export type Callback = E.Callback;
    export type Supplier<T> = E.Supplier<T>;
    export type Consumer<T> = E.Consumer<T>;
    export type FormHelper<T> = E.FormHelper<T>;
    export type Computation<T, R> = E.Computation<T, R>;
    export type ViewManager = E.ViewManager;
    export type IViewInput = E.IViewInput;
    export type IView = E.IView;
    export type Menu = E.Menu;
    export type UIBaseDatabaseService = E.UIBaseDatabaseService;
    export type DashboardService = E.DashboardService;
    export type SavedSearch = E.SavedSearch;
    export type SavedSearchService = E.SavedSearchService;
    export type EntityRegistry = E.EntityRegistry;
    export type Entity = E.Entity;
    export type DatabaseObject = E.DatabaseObject;
    export type FormInput = E.FormInput;
    export type DashboardInput = E.DashboardInput;
    export type ListViewInput = E.ListViewInput;
    export type CalendarListViewInput = E.CalendarListViewInput;
    export type AbstractListViewInput = E.AbstractListViewInput;
    export type Portlet = E.Portlet;
    export type ListPortletInput = E.ListPortletInput;
    export type PortletInput = E.PortletInput;
    export type PortletLayout = E.PortletLayout;

    //Form
    export type Form = E.Form;
    export type FormAction = E.FormAction;
    export type PropertyFieldGroup = E.PropertyFieldGroup;
    export type PropertyField = E.PropertyField;
    export type ModelField = E.ModelField;
    export type ModelFieldGroup = E.ModelFieldGroup;
    export type PropertySubTab = E.PropertySubTab;
    export type ModelSubTab = E.ModelSubTab;
}

export = Ecgine;