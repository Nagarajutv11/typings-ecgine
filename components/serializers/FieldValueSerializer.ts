import { Ecgine } from '../Ecgine'
import { Serialization, Serializer, SerializationContext } from '../Serialization';
import { RpcResponse, RpcType } from '../RemoteServiceSyncProxy';
import { FieldValue } from '../FieldValue';

export class FieldValueSerializer implements Serializer {

    private serialization: Serialization;

    constructor(serializer: Serialization) {
        this.serialization = serializer;
    }

    toJson(obj: FieldValue, context: SerializationContext): any {
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
        // returnType: RpcType

        res.type = this.serialization.fromJson(json.type, 'RpcType', context);

        // result: any
        if (res.type.type) {
            res.value = this.serialization.fromJson(json.value, this.fullType(res.type), context);
        }
        return res;
    }
}