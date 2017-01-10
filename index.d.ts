import * as E from "./ecgine";
import {Vue,Component, Prop, Lifecycle} from 'av-ts'
//declare namespace Ecgine {
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
    export type ReportInput = E.ReportInput;
    export type CalendarListViewInput = E.CalendarListViewInput;
    export type AbstractListViewInput = E.AbstractListViewInput;
    export type Portlet = E.Portlet;
    export type ListPortletInput = E.ListPortletInput;
    export type PortletInput = E.PortletInput;
    export type PortletLayout = E.PortletLayout;
    export type AppLifeCycleHandler = E.AppLifeCycleHandler;
    export type AppLifeCycleContext = E.AppLifeCycleContext;
    export type Command = E.Command;
    export type RelatedList = E.RelatedList;
    export type ChartPortletInput = E.ChartPortletInput;
    export type ReportPortletInput = E.ReportPortletInput;
    export type QuickLinkInput = E.QuickLinkInput;
    export type ValidationResult = E.ValidationResult;
    export type FormHandlerContext = E.FormHandlerContext;
    export type FormHandler = E.FormHandler;
    export type LinkColumn = E.LinkColumn;
    
//}
export {Vue}
export {Component}
export {Prop}
export {Lifecycle}
//export = Ecgine;