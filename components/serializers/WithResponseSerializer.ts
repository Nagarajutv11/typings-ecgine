import { Serialization, Serializer, SerializationContext } from '../Serialization';

export class WithResponseSerializer implements Serializer {

    private serialization: Serialization;

    constructor(serializer: Serialization) {
        this.serialization = serializer;
    }


    toJson(obj: any[], context: SerializationContext): any {
        return obj;
    }

    fromJson(json: any[], context: SerializationContext): any {
        if (json == null) {
            return null;
        }
        let ins = this.serialization.fromJson(json, 'org.ecgine.db.api.DatabaseObject', context)
        return { instance: ins };
    }
}