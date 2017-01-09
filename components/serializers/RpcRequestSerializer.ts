import { Ecgine } from '../Ecgine'
import { Serialization, Serializer, SerializationContext } from '../Serialization';
import { RpcRequest, RpcType } from '../RemoteServiceSyncProxy';

export class RpcRequestSerializer implements Serializer {

    private serialization: Serialization;

    constructor(serializer: Serialization) {
        this.serialization = serializer;
    }

    toJson(obj: RpcRequest, context: SerializationContext): any {
        let out: { [key: string]: any } = {}
        out['methodName'] = obj.methodName;

        out['paramTypes'] = this.serialization.toJson(obj.paramTypes, '[RpcType', context);

        let array: any[] = [];
        for (let i = 0; i < obj.paramTypes.length; i++) {
            let type = obj.paramTypes[i];
            let o = obj.arguments[i];
            if (o) {
                context.writeParent(type.writeParent)
                array.push(this.serialization.toJson(o, this.fullType(type), context));
                context.writeParent(false)
            }else{
                array.push(undefined)
            }
        }

        out['arguments'] = array;

        if (obj.rpcUrl) {
            out['rpcUrl'] = obj.rpcUrl
        }
        return out;
    }

    fullType(type: RpcType): string {
        if (type.isArray || type.isList) {
            return '[' + type.type;
        }
        return type.type;
    }

    fromJson(json: any, context: SerializationContext): any {
        //TODO No need
        return json;
    }
}