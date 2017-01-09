import {Ecgine} from '../Ecgine'
import {Serialization} from '../Serialization';
import {Serializer, SerializationContext} from '../Serialization';

export class EnumSerializer implements Serializer{

	toJson(obj: any, context:SerializationContext): any{
		return obj.name;
	}

	fromJson(json: any, context: SerializationContext): any{
		return json;
	}
}