import { ListOfMapOfObjects } from '../SavedSearch'
import { Serializer, SerializationContext } from '../Serialization';
import { Serialization } from '../Serialization';
import { ReportResult, ReportColumnData } from '../Report'

export class ReportResultSerializer implements Serializer {

    private serialization: Serialization;

    constructor(serializer: Serialization) {
        this.serialization = serializer;
    }

    toJson(obj: any, context: SerializationContext): any {
        return obj;
    }

    fromJson(json: any, context: SerializationContext): any {
        let dataSetValues: ReportColumnData[] = []
        if (json.dataSetValues) {
            let datasets: any[] = json.dataSetValues;
            datasets.forEach(ds => {
                let name = ds.name;
                let object = this.serialization.fromJson(ds.object, 'AnyObject', context)
                dataSetValues.push({ name, object })
            })
        }

        let reportResult = this.serialization.fromJson(json.reportResult, 'org.ecgine.db.service.ListOfMapOfObjects', context) as ListOfMapOfObjects
        let res: ReportResult = { reportResult, dataSetValues }
        return res;
    }
}