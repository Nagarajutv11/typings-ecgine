import { Ecgine } from '../Ecgine'
import { Serializer, Serialization, SerializationContext } from '../Serialization';

export class AnySerializer implements Serializer {

    private serialization: Serialization;


    constructor(serializer: Serialization) {
        this.serialization = serializer;
    }


    toJson(obj: any, context: SerializationContext): any {
        if (!obj) {
            return obj;
        }
        if (typeof obj !== 'object') {
            return obj;
        }
        let res: any = {};
        if (obj['@_lid']) {
            res['@_lid'] = obj['@_lid']
            return res;
        }
        context.writeAny(obj, res);
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                let val = obj[property];
                let isArray = Array.isArray(val);
                if (val && val._type) {
                    val = this.serialization.toJson(val, 'org.ecgine.db.api.DatabaseObject', context)
                } else if (isArray) {
                    val = this.serialization.toJson(val, '[ ', context)
                }
                res[property] = val;
            }
        }
        return res;
    }

    fromJson(json: any, context: SerializationContext): any {
        if (!json) {
            return json;
        }
        let res = context.readAny(json);
        for (var property in json) {
            if (json.hasOwnProperty(property)) {
                let val = json[property];
                let isArray = Array.isArray(val);
                if (val && val._type) {
                    val = this.serialization.fromJson(val, 'org.ecgine.db.api.DatabaseObject', context)
                } else if (isArray) {
                    val = this.serialization.fromJson(val, '[ ', context)
                }
                res[property] = val
            }
        }
        res['@_lid'] = undefined
        return res;
    }
}