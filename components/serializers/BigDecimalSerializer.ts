import {Ecgine} from '../Ecgine'
import {Serialization} from '../Serialization';
import {Serializer, SerializationContext} from '../Serialization';

export class BigDecimalSerializer implements Serializer{

	toJson(obj: any, context:SerializationContext): any{
		return obj.toString();
	}

	fromJson(json: any, context: SerializationContext): any{
		return Number(json);
	}
}