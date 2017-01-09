import {Ecgine} from '../Ecgine'
import {Serialization} from '../Serialization';
import {Serializer, SerializationContext} from '../Serialization';

export class ByteArraySerializer implements Serializer{

	toJson(obj: any, context:SerializationContext): any{
		throw "Not supported";
		
	}

	fromJson(json: any, context: SerializationContext): any{
		throw "Not supported";
	}
}