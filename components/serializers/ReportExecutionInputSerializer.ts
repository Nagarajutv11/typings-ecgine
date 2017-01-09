import { MapOfObjects } from '../SavedSearch'
import { ReportExecutionInput } from '../Report'
import { Serialization, Serializer, SerializationContext } from '../Serialization';

export class ReportExecutionInputSerializer implements Serializer {

    private serialization: Serialization;

    constructor(serializer: Serialization) {
        this.serialization = serializer;
    }

    toJson(obj: any, context: SerializationContext): any {
        let filterValues = this.serialization.toJson(obj.filterValues, 'org.ecgine.db.service.MapOfObjects', context)
        return { filterValues, isChart: obj.isChart, reportBuilder: obj.reportBuilder, report: obj.report };
    }

    fromJson(json: any, context: SerializationContext): any {
        return json;
    }
}