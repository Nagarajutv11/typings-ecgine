import { $e } from '../Ecgine'
import { EntityRegistry } from '../EntityRegistry'
import { Serialization } from '../Serialization';
import { Serializer, SerializationContext } from '../Serialization';
import { ListOfMapOfObjects } from '../SavedSearch'

export class ListOfMapOfObjectsSerializer implements Serializer {

	private static NULL = 0
	private static BYTE_ARRAY = 1
	private static ENUM = 2
	private static STRING = 3
	private static BOOLEAN = 4
	private static INT = 5
	private static LONG = 6
	private static DOUBLE = 7
	private static FLOAT = 8
	private static BIG_DECIMAL = 9
	private static ATTACHMENT = 10
	private static ANY_REFERENCE = 11
	private static LOCAL_DATE = 12
	private static LOCAL_TIME = 13
	private static LOCAL_DATE_TIME = 14

	private serialization: Serialization;

	constructor(serializer: Serialization) {
		this.serialization = serializer;
	}

	toJson(obj: any, context: SerializationContext): any {
		return obj;
	}

	fromJson(rows: string[][], context: SerializationContext): any {
		let result: ({ [key: string]: any })[] = []
		let columns = rows[0];
		rows.splice(0, 1);
		rows.forEach(values => {
			let row: { [key: string]: any } = {}
			values.forEach(v => {
				let split = v.split(":");
				let val = this.convertFromString(split, context);
				row[columns[parseInt(split[0])]] = val;
			})
			result.push(row);
		})
		return { value: result };
	}

	convertFromString(split: string[], context: SerializationContext): any {
		let type = parseInt(split[1]);
		switch (type) {
			case ListOfMapOfObjectsSerializer.ANY_REFERENCE:
				return { type: split[2], id: parseInt(split[3]), displayName: this.remaining(split, 4) }

			case ListOfMapOfObjectsSerializer.ATTACHMENT:
				return { type: split[2], id: parseInt(split[3]), displayName: this.remaining(split, 5), attId: split[4] }
			case ListOfMapOfObjectsSerializer.BIG_DECIMAL:
				return parseFloat(split[2]);
			case ListOfMapOfObjectsSerializer.BOOLEAN:
				return split[2] == 'true';
			case ListOfMapOfObjectsSerializer.BYTE_ARRAY:
				return
			case ListOfMapOfObjectsSerializer.DOUBLE:
				return parseFloat(split[2]);
			case ListOfMapOfObjectsSerializer.ENUM:
				let clsName = split[2]
				let ordinal = parseInt(split[3]);
				let er = $e.service('EntityRegistry') as EntityRegistry;
				return er.enumValues(clsName)[ordinal]
			case ListOfMapOfObjectsSerializer.FLOAT:
				return parseFloat(split[2]);
			case ListOfMapOfObjectsSerializer.INT:
				return parseInt(split[2]);
			case ListOfMapOfObjectsSerializer.LOCAL_DATE:
				return this.serialization.fromJson(parseInt(split[2]), 'java.time.LocalDate', context)
			case ListOfMapOfObjectsSerializer.LOCAL_DATE_TIME:
				return this.serialization.fromJson(parseInt(split[2]), 'java.time.LocalDateTime', context)
			case ListOfMapOfObjectsSerializer.LOCAL_TIME:
				return this.serialization.fromJson(parseInt(split[2]), 'java.time.LocalTime', context)
			case ListOfMapOfObjectsSerializer.LONG:
				return parseInt(split[2]);
			case ListOfMapOfObjectsSerializer.STRING:
				return this.remaining(split, 2);
			case ListOfMapOfObjectsSerializer.NULL:
				return null;
		}
	}

	remaining(split: string[], i: number): any {
		return split[i]
	}
}