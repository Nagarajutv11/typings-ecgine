import { RemoteServiceSyncProxy, RpcConfiguration } from './RemoteServiceSyncProxy';
import { $e } from './Ecgine';
import { Report } from './Report'
import { Form } from './formcontrol/Form'

export class FormRegistryService {

    private static _instance: FormRegistryService;

    private allForms: { [name: string]: { [key: string]: Form } } = {};

    constructor() {
        if (FormRegistryService._instance) {
            throw new Error("Error: Do not create another object. This is singleton");
        }
        FormRegistryService._instance = this;
    }

    public form(entityName: string, formid: string | null, callback: (search: Form) => void) {
        let forms = this.allForms[entityName];
        if (!forms) {
            this.downloadDefinition(entityName, formid == null ? '' : formid, callback);
            return;
        }
        if (formid) {
            let form = forms[formid];
            if (form) {
                callback(form)
            } else {
                this.downloadDefinition(entityName, formid == null ? '' : formid, callback);
            }
        } else {
            for (var property in forms) {
                if (forms.hasOwnProperty(property)) {
                    callback(forms[property])
                }
            }
            this.downloadDefinition(entityName, formid == null ? '' : formid, callback);
        }
    }

    downloadDefinition(entityName: string, formid: string, callback: (search: Form) => void) {
        let _this = this
        let proxy = $e.service('RemoteServiceSyncProxy') as RemoteServiceSyncProxy;
        proxy.sendEcgineRequest("/org.ecgine.webui/u/forms", { entityName: entityName, formid: formid }, function (res: any): void {
            var form = res as Form
            let forms = _this.allForms[entityName];
            if (!forms) {
                forms = {}
                _this.allForms[entityName] = forms;
            }
            forms[form.formid] = form;
            callback(form);
        });
    }
}