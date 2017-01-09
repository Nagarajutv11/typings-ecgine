import { Ecgine } from '../Ecgine'
import { Serialization, Serializer, SerializationContext } from '../Serialization';
import { RpcResponse, RpcType } from '../RemoteServiceSyncProxy';

export class DesktopAppInitInfoSerializer implements Serializer {

    private serialization: Serialization;

    constructor(serializer: Serialization) {
        this.serialization = serializer;
    }

    toJson(obj: RpcResponse, context: SerializationContext): any {
        //TODO No need
        return obj;
    }

    fromJson(json: any, context: SerializationContext): any {
        let res: any = {}
        res.singletons = this.serialization.fromJson(json.singletons, '[org.ecgine.db.api.DatabaseObject', context)

        let userMemberships: { [key: number]: any } = {};
        res.userMemberships = userMemberships;
        json.userMemberships.forEach((obj: any) => {
            userMemberships[obj.k] = this.serialization.fromJson(obj.v, 'org.ecgine.core.shared.Role', context);
        });
        res.user = this.serialization.fromJson(json.user, 'org.ecgine.core.shared.User', context)
        return res;
    }
}