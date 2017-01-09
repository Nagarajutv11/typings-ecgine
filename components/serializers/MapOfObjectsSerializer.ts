import { Ecgine } from '../Ecgine'
import { Serialization } from '../Serialization';
import { Serializer, SerializationContext } from '../Serialization';
import { MapOfObjects } from '../SavedSearch';

export class MapOfObjectsSerializer implements Serializer {

	private serialization: Serialization;

	constructor(serializer: Serialization) {
		this.serialization = serializer;
	}

	toJson(obj: MapOfObjects, context: SerializationContext): any {
		let json = {} as any
		for (var property in obj.values) {
			if (obj.values.hasOwnProperty(property)) {
				let v = obj.values[property]
				let res = this.serialization.toJson(v, 'AnyObject', context);
				json[property] = res;
			}
		}
		return json;
	}

	fromJson(json: any, context: SerializationContext): any {
		let result = {} as any
		for (var property in json.values) {
			if (json.values.hasOwnProperty(property)) {
				let v = json.values[property]
				let res = this.serialization.fromJson(v, 'AnyObject', context);
				result[property] = res;
			}
		}
		return result;
	}
}