import {Ecgine} from '../Ecgine'
import {Serialization} from '../Serialization';
import {Serializer, SerializationContext} from '../Serialization';

export class LocalTimeSerializer implements Serializer{

	toJson(obj: any, context:SerializationContext): any{
		if(!obj){
			return null;
		}
		return obj.getTime();
	}

	fromJson(json: any, context: SerializationContext): any{
		return new Date(json);
	}
}