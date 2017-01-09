import { RemoteServiceSyncProxy } from './RemoteServiceSyncProxy';
import { Entity } from './Entity';
import { $e } from './Ecgine';
import { ArraySerializer } from './serializers/ArraySerializer';
import { EntityRegistry } from './EntityRegistry'

export class Serialization {

    private static _instance: Serialization;

    private serializers: { [name: string]: Serializer; } = {};

    private er: EntityRegistry

    constructor() {
        if (Serialization._instance) {
            throw new Error("Error: Do not create another object. This is singleton");
        }
        Serialization._instance = this;
        this.er = $e.service('EntityRegistry') as EntityRegistry;

    }

    getSerializer(type: string): Serializer {
        if (!type) {
            console.log('Type not found')
        }
        if (type.charAt(0) == '[') {
            return new ArraySerializer(this, type.substring(1));
        }
        //Finding serializer for given type
        let serializer = this.serializers[type];
        if (!serializer) {
            let entity = this.er.entity(type);
            if (entity) {
                return this.getSerializer('org.ecgine.db.api.DatabaseObject');
            }
            serializer = this.serializers['any'];
        }
        return serializer;
    }

    toJsonArray(obj: any, type: string, context: SerializationContext): any {
        let ser = this.getSerializer(type);
        let arr = obj as any[];
        let res = new Array();
        arr.forEach(function (e: any) {
            res.push(ser.toJson(e, context, type));
        });
        return res;
    }

    fromJsonArray(json: any, type: string, context: SerializationContext): any {
        let ser = this.getSerializer(type);
        let arr = json as any[];
        let res = new Array();
        arr.forEach(function (e: any) {
            res.push(ser.fromJson(e, context, type));
        });
        return res;
    }

    toJson(obj: any, type: string, context: SerializationContext): any {
        //Do serialize
        return this.getSerializer(type).toJson(obj, context, type);
    }

    fromJson(json: any, type: string, context: SerializationContext): any {
        //Do serialize
        return this.getSerializer(type).fromJson(json, context, type);
    }

    register(type: string, serializer: Serializer) {
        this.serializers[type] = serializer;
    }

}

export interface Serializer {

    toJson(obj: any, context: SerializationContext, type: string): any;

    fromJson(json: any, context: SerializationContext, type: string): any;
}

export interface SerializationContext {

    writeAny(obj: any, result: { [key: string]: any }): void;

    write(type: string, obj: any, result: {}): void;

    writeParent(isWriteParent: boolean): void;

    isWriteParent(): boolean;

    read(type: string, obj: any): any;

    readAny(obj: any): any;

    isWrittenFully(obj: any): boolean;

    writingFully(obj: any): void;

    startWrite(): void;

    writeCompleted(): void;

    startRead(): void;
}