import { SavedSearchResult, ListOfMapOfObjects } from '../SavedSearch'
import { Serializer, SerializationContext } from '../Serialization';
import { Serialization } from '../Serialization';

export class SavedSearchResultSerializer implements Serializer {

    private serialization: Serialization;

    constructor(serializer: Serialization) {
        this.serialization = serializer;
    }

    toJson(obj: any, context: SerializationContext): any {
        return obj;
    }

    fromJson(json: any, context: SerializationContext): any {
        let list = this.serialization.fromJson(json.list, 'org.ecgine.db.service.ListOfMapOfObjects', context) as ListOfMapOfObjects
        let res: SavedSearchResult = { start: json.start, totalCount: json.totalCount, list }
        return res;
    }
}