import { Callback, Supplier } from './Models';
import { Observable } from 'rx'
import { FormHelper } from './FormHelper';
import { RemoteServiceSyncProxy, RpcRequest, RpcResponse, RpcType, RpcConfiguration } from './RemoteServiceSyncProxy';
import { ViewManager } from './ViewManager'
import { HttpService } from './HttpService'
import { EntityRegistry } from './EntityRegistry'
import { Serialization } from './Serialization'
import { DesktopInitService } from './DesktopInitService'
import { IViewInput } from './IViewInput'
import { EcgineService } from './EcgineService'
import { SavedSearch } from './SavedSearch'
import { SavedSearchRegistryService } from './SavedSearchRegistryService'
import { ReportRegistryService } from './ReportRegistryService';
import { FormRegistryService } from './FormRegistryService';
import { Subject } from './Subject'
import { FormHandler } from './formcontrol/FormHandler'

import { AnySerializer } from './serializers/AnySerializer';
import { BigDecimalSerializer } from './serializers/BigDecimalSerializer';
import { ByteArraySerializer } from './serializers/ByteArraySerializer';
import { EntitySerializer } from './serializers/EntitySerializer';
import { EnumSerializer } from './serializers/EnumSerializer';
import { ListOfMapOfObjectsSerializer } from './serializers/ListOfMapOfObjectsSerializer';
import { LocalDateSerializer } from './serializers/LocalDateSerializer';
import { LocalDateTimeSerializer } from './serializers/LocalDateTimeSerializer';
import { LocalTimeSerializer } from './serializers/LocalTimeSerializer';
import { MapOfObjectsSerializer } from './serializers/MapOfObjectsSerializer';
import { RpcRequestSerializer } from './serializers/RpcRequestSerializer';
import { RpcResponseSerializer } from './serializers/RpcResponseSerializer';
import { LiteralSerializer } from './serializers/LiteralSerializer';
import { FieldValueSerializer } from './serializers/FieldValueSerializer';
import { AnyObjectSerializer } from './serializers/AnyObjectSerializer';
import { SavedSearchResultSerializer } from './serializers/SavedSearchResultSerializer';
import { SearchExecutionInputSerializer } from './serializers/SearchExecutionInputSerializer';
import { ReportResultSerializer } from './serializers/ReportResultSerializer';
import { ReportExecutionInputSerializer } from './serializers/ReportExecutionInputSerializer';
import { DesktopAppInitInfoSerializer } from './serializers/DesktopAppInitInfoSerializer';
import { WithResponseSerializer } from './serializers/WithResponseSerializer';

export class Ecgine {

    private static $e: Ecgine;

    private pendingScripts: string[] = []
    private waitForMes: (() => string)[] = [];
    private pendingActions: string[] = []
    private onloads: Callback[] = [];

    private extPoints: { [name: string]: any[] } = {};

    private services: { [name: string]: any } = {};

    public appName: string;

    private requiredServices: string[] = [];

    private allHelpers: { [name: string]: FormHelper<any>; } = {};

    private formHandlers: { [name: string]: FormHandler; } = {};

    private singletons: { [key: string]: any };
    private user: any;
    private userDetails: any;
    private userMemberships: { [id: number]: any; };
    private ecgineLoaded: boolean = false;
    private servicesLoaded: boolean = false;
    private entitiesLoaded: boolean = false;
    private sendSingletonLoadRequest: boolean = false;

    public $http: any;
    public $router: any;
    public component: any;


    constructor() {
        if (Ecgine.$e) {
            throw new Error("Error: Do not create another object. This is singleton");
        }
        Ecgine.$e = this;
        Ecgine.$e.pendingScripts.push('ecgine')
        Ecgine.$e.waitForMe(Ecgine.$e.loadServices)
    }

    static get(): Ecgine {
        if (Ecgine.$e == null) {
            Ecgine.$e = new Ecgine();
        }
        return Ecgine.$e;
    }

    waitForMe(onload: () => string) {
        this.waitForMes.push(onload);
        if (this.pendingScripts.length == 0) {
            let action = onload();
            $e.pendingActions.push(action);
            console.log("Action started:" + action)
        }
    }

    waitingScripts(scripts: string[]) {
        this.pendingScripts = scripts;
    }

    scriptDone(scriptName: string) {
        let i = $e.pendingScripts.indexOf(scriptName);
        if (i < 0) {
            return;
        }
        $e.pendingScripts.splice(i, 1);
        if ($e.pendingScripts.length == 0) {
            $e.waitForMes.forEach(function (e: () => string) {
                let action = e();
                $e.pendingActions.push(action);
                console.log("Action started:" + action)
            });
        }
    }

    actionCompleted(action: string) {
        console.log("Action completed:" + action)
        if (action == 'loading entities') {
            this.entitiesLoaded = true;
        }
        if (this.entitiesLoaded && this.servicesLoaded && !this.sendSingletonLoadRequest) {
            this.sendSingletonLoadRequest = true;
            this.waitForMe(this.downloadSingletons);
        }

        let i = $e.pendingActions.indexOf(action);
        if (i < 0) {
            return;
        }
        $e.pendingActions.splice(i, 1);
        if ($e.pendingActions.length == 0) {
            $e.onloads.forEach(function (e: Callback) {
                e();
            });
            this.ecgineLoaded = true;
        }
    }
    downloadSingletons() {
        let action = 'loading singletons'
        let initService = $e.service('org.ecgine.core.shared.api.DesktopInitService') as DesktopInitService;
        initService.initializeApp('*').subscribe(info => {
            $e.singletons = {}
            info.singletons.forEach(s => {
                $e.singletons[s._type] = s
            })
            $e.user = info.user;
            $e.userMemberships = info.userMemberships;
            $e.actionCompleted(action)
        });
        return action;
    }
    //Need to call when ecgine obj is ready
    ready(onload: Callback) {
        if (!this.ecgineLoaded) {
            this.onloads.push(onload);
        } else {
            onload();
        }
    }

    loadScripts() {
        if ($e.pendingScripts.length != 0) {
            var proxy = $e.service("RemoteServiceSyncProxy") as RemoteServiceSyncProxy;
            proxy.sendEcgineRequest("/org.ecgine.webui/u/bundles", { 'appId': $e.appName },
                function (res: any) {
                    let rpc: RpcConfiguration = $e.service("EcgineRpcConfiguration");
                    // require(res,function(...modules:any[]){
                    //  alert("Modules are loaded");
                    // });
                    for (var property in res) {
                        if (res.hasOwnProperty(property)) {
                            let src = res[property]
                            $e.pendingScripts.push(property)
                            var fileref = document.createElement('script')
                            fileref.setAttribute("type", "text/javascript")
                            fileref.setAttribute("src", rpc.baseUrl + src);
                            document.getElementsByTagName("head")[0].appendChild(fileref);
                        }
                    }
                    $e.scriptDone('ecgine')
                });
        }

    }

    addExtPoint(appName: string, points: Supplier<{ [name: string]: any[]; }>) {
        if (appName && this.appName != appName) {
            return;
        }
        let newPoints = points();
        for (var property in newPoints) {
            if (newPoints.hasOwnProperty(property)) {
                if (!$e.extPoints[property]) {
                    $e.extPoints[property] = [];
                }
                let ps = newPoints[property];
                if (property == 'org.ecgine.client.view') {
                    ps.forEach(function (a: any) {
                        $e.component(a.id, a.view);
                    });
                } else {
                    ps.forEach(function (a: any) {
                        $e.extPoints[property].push(a);
                    });
                }
            }
        }
    }

    //Return all values of given extPoint
    extPoint(extPoint: string): any {
        if (!$e.extPoints[extPoint]) {
            $e.extPoints[extPoint] = [];
        }
        return $e.extPoints[extPoint];
    }

    singleExtPoint(extPoint: string, prop: string, value: string): any {
        let points = $e.extPoint(extPoint);
        if (points) {
            for (var i in points) {
                if (points[i][prop] == value) {
                    return points[i];
                }
            }
        }
        return
    }

    multiExtPoint(extPoint: string, prop: string, value: string, callback: (val: any) => void): void {
        let points = $e.extPoint(extPoint);
        if (points) {
            for (var i in points) {
                if (points[i][prop] == value) {
                    callback(points[i]);
                }
            }
        }
        return
    }

    getCommand(id: string): ((params?:any, callback?:(input:any)=>void) => IViewInput) | undefined {
        let command = this.singleExtPoint('org.ecgine.client.command', 'id', id);
        if (command) {
            return command.command
        }
        return
    }

    getApplication(): Application | undefined {
        let points = $e.extPoint('org.ecgine.client.application');
        if (points) {
            return points[0];
        }
        return
    }
    public service(serviceName: string): any {
        return this.services[serviceName];
    }

    public register(serviceName: string, service: any) {
        this.services[serviceName] = service;
    }

    private loadServices(): string {
        let action = 'Loading Services'
        let proxy = $e.service('RemoteServiceSyncProxy') as RemoteServiceSyncProxy;
        proxy.sendEcgineRequest("/org.ecgine.webui/u/services", { services: $e.requiredServices.toString() }, function (res: any): void {
            let result = res as any[];
            result.forEach(function (e: Service) {
                let service = $e.createServiceProxy(e);
                $e.register(e.name, service);
            });
            $e.servicesLoaded = true;
            $e.actionCompleted(action)
        });
        return action
    }

    isUserDetailsExists(): boolean {
        return this.userDetails != undefined;
    }

    required(serviceName: string) {
        if (!this.servicesLoaded) {
            this.requiredServices.push(serviceName);
        } else {
            throw "Can't load service now. Load it before load all services";
        }
    }

    createServiceProxy(service: Service): any {
        let proxy: { [key: string]: any } = {};
        service.methods.forEach(function (m) {
            proxy[m.methodName] = function (...args: any[]) {
                let proxy = $e.service('RemoteServiceSyncProxy') as RemoteServiceSyncProxy;
                return Observable.create(s => {
                    let req = new RpcRequest();
                    req.arguments = args;
                    req.methodName = m.methodName;
                    req.paramTypes = m.paramTypes;
                    proxy.callRpc(service.path, service.name, req, Ecgine.get().service('EcgineRpcConfiguration') as RpcConfiguration,
                        function (res: RpcResponse): void {
                            if (res.status) {
                                s.onNext(res.result);
                                s.onCompleted();
                            } else {
                                s.onError(res.error);
                            }
                        }
                    );
                });
            };
        })
        return proxy;
    }

    addHelper(fullName: string, helper: FormHelper<any>) {
        this.allHelpers[fullName] = helper;
    }

    helper(fullName: string): FormHelper<any> {
        return this.allHelpers[fullName];
    }

    singleton(fullName: string): any {
        return $e.singletons[fullName];
    }

    setUserDetails(data: any) {
        this.userDetails = data;
        //Need to create ecgine rpc configuration

    }
    
    subject(): Subject {
        return new Subject()
    }

    addFormHandler(name: string, handler: FormHandler) {
        this.formHandlers[name] = handler;
    }

    formHandler(name: string): FormHandler {
        return this.formHandlers[name]
    }

    viewManager():ViewManager{
        return this.service('ViewManager');
    }
}
class Service {
    bundleName: string;
    name: string;
    methods: Method[];
    path: string;
}

class Method extends RpcRequest {
    returnType: RpcType
}

declare var window: any;
export var $e = Ecgine.get();
window.ecgine = $e;
let rpc = new RpcConfiguration();
rpc.baseUrl = window.location.origin;
rpc.authProvider = function (h) {
    //h.Authorization = 'Bearer ' + data.access_token;
};
$e.register('EcgineRpcConfiguration', rpc);
$e.register('RemoteServiceSyncProxy', new RemoteServiceSyncProxy());
$e.register('ViewManager', new ViewManager());
$e.register("HttpService", new HttpService());
$e.register('EntityRegistry', new EntityRegistry());
$e.register('EcgineService', new EcgineService());
$e.register('SavedSearchRegistryService', new SavedSearchRegistryService());
$e.register('ReportRegistryService', new ReportRegistryService());
$e.register('FormRegistryService', new FormRegistryService());

let s = new Serialization();
$e.register('Serialization', s);

s.register("any", new AnySerializer(s));
s.register("bigdecimal", new BigDecimalSerializer());
s.register("bytearray", new ByteArraySerializer());
s.register("org.ecgine.db.api.DatabaseObject", new EntitySerializer(s));
s.register("org.ecgine.db.service.ListOfMapOfObjects", new ListOfMapOfObjectsSerializer(s));
s.register("org.ecgine.db.service.MapOfObjects", new MapOfObjectsSerializer(s));
s.register("org.ecgine.search.shared.SavedSearchResult", new SavedSearchResultSerializer(s));
s.register("org.ecgine.search.shared.SearchExecutionInput", new SearchExecutionInputSerializer(s));
s.register("org.ecgine.report.shared.data.ReportResult", new ReportResultSerializer(s));
s.register("org.ecgine.report.shared.ReportExecutionInput", new ReportExecutionInputSerializer(s));
s.register("org.ecgine.webui.service.FieldValue", new FieldValueSerializer(s));
s.register("org.ecgine.core.shared.api.DesktopAppInitInfo", new DesktopAppInitInfoSerializer(s));
s.register("org.ecgine.core.shared.api.WithResponse", new WithResponseSerializer(s));

s.register("enum", new EnumSerializer());
s.register("java.time.LocalDate", new LocalDateSerializer());
s.register("java.time.LocalDateTime", new LocalDateTimeSerializer());
s.register("java.time.LocalTime", new LocalTimeSerializer());
s.register("RpcRequest", new RpcRequestSerializer(s));
s.register("RpcResponse", new RpcResponseSerializer(s));
s.register("AnyObject", new AnyObjectSerializer(s));
s.register("object", new AnyObjectSerializer(s));

s.register("java.lang.String", new LiteralSerializer());
s.register("java.lang.Boolean", new LiteralSerializer());
s.register("java.lang.Byte", new LiteralSerializer());
s.register("java.lang.Character", new LiteralSerializer());
s.register("java.lang.Double", new LiteralSerializer());
s.register("java.lang.Float", new LiteralSerializer());
s.register("java.lang.Integer", new LiteralSerializer());
s.register("java.lang.Long", new LiteralSerializer());
s.register("boolean", new LiteralSerializer());//boolean
s.register("string", new LiteralSerializer());
s.register("number", new LiteralSerializer());
s.register("Z", new LiteralSerializer());//boolean
s.register("byte", new LiteralSerializer());
s.register("B", new LiteralSerializer());//byte
s.register("char", new LiteralSerializer());
s.register("C", new LiteralSerializer());//char
s.register("double", new LiteralSerializer());
s.register("D", new LiteralSerializer());//double
s.register("float", new LiteralSerializer());
s.register("F", new LiteralSerializer());//float
s.register("int", new LiteralSerializer());
s.register("I", new LiteralSerializer());//int
s.register("long", new LiteralSerializer());
s.register("J", new LiteralSerializer());//long
s.register("short", new LiteralSerializer());
s.register("S", new LiteralSerializer());//short    

export declare class Application {
    initialView: AppLifeCycleHandler
    defaultView: string
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

    openView(input: IViewInput): void;

    proceed(): void;
}