import { Serialization, Serializer, SerializationContext } from '../Serialization';

export class ArraySerializer implements Serializer {

    private serialization: Serialization;
    private elementType: string;

    constructor(serializer: Serialization, elementType: string) {
        this.serialization = serializer;
        this.elementType = elementType;
    }


    toJson(obj: any[], context: SerializationContext): any {
        if (obj == null) {
            return null;
        }
        let result: any[] = []
        obj.forEach(e => {
            let et = this.getType(e)
            result.push(this.serialization.toJson(e, et, context));
        })
        return result;
    }
    getType(e: any): string {
        let et = this.elementType;
        if (!et || et == ' ') {
            et = e._type
        }
        if (!et) {
            et = typeof e;
        }
        return et;
    }
    fromJson(json: any[], context: SerializationContext): any {
        if (json == null) {
            return null;
        }
        let result: any[] = []
        json.forEach(e => {
            let et = this.getType(e)
            result.push(this.serialization.fromJson(e, et, context));
        })
        return result;
    }
}