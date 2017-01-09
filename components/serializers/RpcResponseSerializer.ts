import { Ecgine } from '../Ecgine'
import { Serialization, Serializer, SerializationContext } from '../Serialization';
import { RpcResponse, RpcType } from '../RemoteServiceSyncProxy';

export class RpcResponseSerializer implements Serializer {

    private serialization: Serialization;

    constructor(serializer: Serialization) {
        this.serialization = serializer;
    }

    toJson(obj: RpcResponse, context: SerializationContext): any {
        //TODO No need
        return obj;
    }

    fullType(type: RpcType): string {
        if (type.isArray || type.isList) {
            return '[' + type.type;
        }
        return type.type;
    }

    fromJson(json: any, context: SerializationContext): any {
        let res: any = {}
        // status: boolean
        res.status = json.status;

        // error: string
        res.error = json.error;

        // returnType: RpcType
        res.returnType = this.serialization.fromJson(json.returnType, 'RpcType', context);

        // result: any
        if (res.returnType) {
            res.result = this.serialization.fromJson(json.result, this.fullType(res.returnType), context);
        }
        return res;
    }
}