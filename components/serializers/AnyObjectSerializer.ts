import { $e } from '../Ecgine'
import { EntityRegistry } from '../EntityRegistry'
import { Serializer, Serialization, SerializationContext } from '../Serialization';

export class AnyObjectSerializer implements Serializer {
    private static NULL = 0;
    private static STRING = 1;
    private static BOOLEAN = 2;
    private static INTEGER = 3;
    private static LONG = 4;
    private static DOUBLE = 5;
    private static BIG_DECIMAL = 6;
    private static BYTE_ARRAY = 7;
    private static DATE = 8;
    private static DATETIME = 9;
    private static TIME = 10;
    private static PICKLIST = 11;
    private static REFERENCE = 12;
    private static LIST = 13;
    private static SET = 14;

    private serialization: Serialization;

    constructor(serializer: Serialization) {
        this.serialization = serializer;
    }

    toJson(json: any, context: SerializationContext): any {
        let out: any = {};
        let obj = json.v;
        if (obj==undefined || obj == null) {
            out.type = AnyObjectSerializer.NULL;
            return out;
        }
        switch (json.type.type) {
            case 'TEXT':
            case 'TEXTAREA':
            case 'RICHTEXT':
            case 'EMAIL':
            case 'URL':
            case 'PHONE':
            case 'PASSWORD':
            case 'IPADDRESS':
                out.type = AnyObjectSerializer.STRING;
                out.value = obj;
                break;
            case 'INT':
                out.type = AnyObjectSerializer.INTEGER;
                out.value = obj;
                break;
            case 'AGE':
            case 'LONG':
                out.type = AnyObjectSerializer.LONG;
                out.value = obj;
                break;
            case 'AMOUNT':
            case 'PERCENT':
            case 'DOUBLE':
                out.type = AnyObjectSerializer.DOUBLE;
                out.value = obj;
                break;
            case 'BOOLEAN':
                out.type = AnyObjectSerializer.BOOLEAN;
                out.value = obj;
                break;
            case 'AUTOINCREMENT':
                if (json.type.allowPrefix) {
                    out.type = AnyObjectSerializer.STRING;
                } else {
                    out.type = AnyObjectSerializer.LONG;
                }
                out.value = obj;
                break
            case 'BIG_DECIMAL':
            case 'BIG_DEC_PERCENT':
                out.type = AnyObjectSerializer.BIG_DECIMAL;
                out.value = obj;
                break;
            case 'PICKLIST':
                out.type = AnyObjectSerializer.PICKLIST;
                out.value = json.type.enumCls;
                out.name = obj;
                break;
            case 'DATE':
                out.type = AnyObjectSerializer.DATE;
                out.value = this.serialization.toJson(obj, 'java.time.LocalDate', context);
                break;
            case 'TIME':
                out.type = AnyObjectSerializer.TIME;
                out.value = this.serialization.toJson(obj, 'java.time.LocalTime', context);
                break;
            case 'DATETIME':
                out.type = AnyObjectSerializer.DATETIME;
                out.value = this.serialization.toJson(obj, 'java.time.LocalDateTime', context);
                break;
            case 'ANYREFERENCE':
            case 'REFERENCE':
                out.type = AnyObjectSerializer.REFERENCE;
                out.value = obj.id;
                out.displayName = obj.displayName;
                out.cls = obj._type;
                break;
        }
        return out;
    }

    fromJson(json: any, context: SerializationContext): any {
        let obj: any;
        let type = json.type;
        switch (type) {
            case AnyObjectSerializer.NULL:
                obj = undefined;
                break;
            case AnyObjectSerializer.STRING:
            case AnyObjectSerializer.BOOLEAN:
            case AnyObjectSerializer.INTEGER:
            case AnyObjectSerializer.LONG:
            case AnyObjectSerializer.DOUBLE:
            case AnyObjectSerializer.BIG_DECIMAL:
                obj = json.value;
                break;
            case AnyObjectSerializer.BYTE_ARRAY:
                obj = json.value;
                break;
            case AnyObjectSerializer.DATE:
            case AnyObjectSerializer.DATETIME:
            case AnyObjectSerializer.TIME:
                obj = json.value;//Don't know
                break;
            case AnyObjectSerializer.REFERENCE:
                let id = json.value as number
                let cls = json.cls as string
                let disp = json.displayName as string;
                obj = { _type: cls, id: id, displayName: disp }
                break;
            case AnyObjectSerializer.PICKLIST:
                let clsName = json.value as string
                let ordinal = json.ordinal as number;
                let er = $e.service('EntityRegistry') as EntityRegistry;
                obj = er.enumValues(clsName)[ordinal]
                break;
            case AnyObjectSerializer.LIST:
            case AnyObjectSerializer.SET:
                obj = this.readList(json.value, context);
                break;

        }
        return obj;
    }

    readList(json: any, context: SerializationContext): any[] {
        let result: any[] = []
        let et = json.et;
        let value = json.value as any[];
        let _this1 = this
        value.forEach(v => {
            result.push(_this1.fromJson({ type: et, value: v }, context));
        })
        return result;
    }
}