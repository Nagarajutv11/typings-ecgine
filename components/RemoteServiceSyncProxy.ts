import { EntityRegistry } from './EntityRegistry';
import { Serialization } from './Serialization';
import { SerializationContext } from './Serialization';
import { HttpService } from './HttpService';
import { $e } from './Ecgine';

export class RemoteServiceSyncProxy {

    private static _instance: RemoteServiceSyncProxy;

    private _score: number = 0;

    constructor() {
        if (RemoteServiceSyncProxy._instance) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }
        RemoteServiceSyncProxy._instance = this;
        $e.register('RemoteServiceSyncProxy', this);
    }

    sendEcgineRequest(url: string, data: { [name: string]: string }, callback: (result: any) => void): void {
        this.sendRequest(url, $e.service('EcgineRpcConfiguration') as RpcConfiguration, data, callback);
    }

    sendRequest(url: string, config: RpcConfiguration, data: { [name: string]: string }, callback: (result: any) => void): void {
        var fullURL = config.baseUrl + url;
        var hs = $e.service('HttpService') as HttpService;
        let options: { [header: string]: string } = {};
        config.authProvider(options);
        hs.startRequest();
        $e.$http.post(fullURL, data, options).then(function (resp: any) {
            hs.successRequest();
            callback(resp.data);
        }, function (error: any) {
            hs.failRequest(error);
        });
    }

    callRpc(bundleName: string, serviceName: string, request: RpcRequest, config: RpcConfiguration, callback: (result: any) => void) {
        var s = $e.service('Serialization') as Serialization;
        let context = new RpcSerializationContext();
        var json = s.toJson(request, "RpcRequest", context);
        context.writeCompleted();
        //Sending request
        var fullURL = bundleName + '/' + serviceName.replace(/\./g, "/");
        this.sendRequest(fullURL, config, json, function (resp: any): void {
            //console.log(request.methodName);
            var result = s.fromJson(eval('(' + resp + ')'), "RpcResponse", context);
            callback(result);
        });
    }
}

class RpcSerializationContext implements SerializationContext {

    private readLocalIdCache: { [id: number]: any; } = {};
    private fullyWrittenObjects: any[] = [];

    private currentLocalId: number = 0;
    private wrPnt: boolean = false;

    write(type: string, obj: any, result: { [key: string]: any }): void {
        this.writeAny(obj, result)

        if (!obj._type || obj._type != type) {
            result['_type'] = obj._type;
        }

        if (obj['id']) {
            result['@_oid'] = obj['id'];
        } else {
            result['@_oid'] = 0;
        }
    }

    writeParent(isWriteParent: boolean): void {
        this.wrPnt = isWriteParent;
    }

    isWriteParent(): boolean {
        return this.wrPnt;
    }

    writeAny(obj: any, result: { [key: string]: any }): void {
        let localId = obj['@_lid']
        if (!localId) {
            localId = this.nextLocalId();
            obj['@_lid'] = localId;
            this.readLocalIdCache[localId] = obj;
        }
        result['@_lid'] = localId;
    }

    writeCompleted(): void {
        let all = this.readLocalIdCache as any;
        for (var property in all) {
            if (all.hasOwnProperty(property)) {
                all[property]['@_lid'] = undefined;
            }
        }
    }

    nextLocalId(): number {
        return this.currentLocalId = this.currentLocalId + 2;
    }

    read(type: string, obj: any): any {
        if (obj['_type']) {
            type = obj['_type'];
        }
        let id = obj['@_oid'];

        let localId = obj['@_lid'];
        let inst = this.readLocalIdCache[localId];
        if (!inst) {
            // Instance with localId does not exist in cache. So, create new
            // instance
            inst = {};
            inst['_type'] = type;
            this.readLocalIdCache[localId] = inst;
        }
        // Find maximum local id when reading json. So that when writing
        // response on server, this context will allocate next ids after max
        // local id
        if (localId > this.currentLocalId) {
            this.currentLocalId = localId;
        }

        return inst;
    }

    readAny(obj: any): any {
        let localId = obj['@_lid'];
        let inst = this.readLocalIdCache[localId];
        if (!inst) {
            inst = {};
            this.readLocalIdCache[localId] = inst;
        }
        if (localId > this.currentLocalId) {
            this.currentLocalId = localId;
        }
        return inst;
    }
    isWrittenFully(obj: any): boolean {
        return this.fullyWrittenObjects.indexOf(obj) != -1;
    }

    writingFully(obj: any): void {
        this.fullyWrittenObjects.push(obj);
    }

    startWrite(): void {
        this.currentLocalId = 0;
    }

    startRead(): void {
        let reads = this.readLocalIdCache as any;
        reads.forEach(function (id: number, val: any) {
            delete val['@_lid'];
        });
    }
}

export class RpcRequest {
    methodName: string;
    paramTypes: RpcType[];
    arguments: Object[];
    rpcUrl: string;
}
export class RpcResponse {
    status: boolean
    error: string
    returnType: RpcType
    result: any
}
export class RpcType {
    type: string
    isArray: boolean
    isList: boolean
    writeParent: boolean
}

export class RpcConfiguration {
    baseUrl: string;
    attachmentDownloadUrl: string;
    attachmentUploadUrl: string;
    dowanloadAnonymousUrl: string;
    authProvider: AuthProvider;
}

export interface AuthProvider {
    (req: any): void
}

export interface IResponseReciever<T> {
    onResult(result: T): void;
    onFailure(ex: Error): void;
}