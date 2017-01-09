import { Ecgine } from '../Ecgine'
import { Serializer, SerializationContext } from '../Serialization';

export class LiteralSerializer implements Serializer {

    toJson(obj: any, context: SerializationContext): any {       
        return obj;
    }

    fromJson(json: any, context: SerializationContext): any {     
        return json;
    }
}