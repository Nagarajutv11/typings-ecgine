import { SearchExecutionInput, MapOfObjects } from '../SavedSearch'
import { Serialization, Serializer, SerializationContext } from '../Serialization';

export class SearchExecutionInputSerializer implements Serializer {

    private serialization: Serialization;

    constructor(serializer: Serialization) {
        this.serialization = serializer;
    }

    toJson(obj: SearchExecutionInput, context: SerializationContext): any {
        let filterValues = this.serialization.toJson(obj.filterValues, 'org.ecgine.db.service.MapOfObjects', context)
        return { filterValues, isSummary: obj.isSummary, searchBuilder: obj.searchBuilder, search: obj.search };
    }

    fromJson(json: any, context: SerializationContext): any {
        return json;
    }
}