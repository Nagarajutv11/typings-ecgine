import { ModelField } from './formcontrol/ModelField';
import { DatabaseObject } from './DatabaseObject'
import { FieldType } from './Field'
import { EComponent } from './controls/EComponent'
import { $e } from './Ecgine';
import { EntityRegistry } from './EntityRegistry';
import { MapOfObjects, ListOfMapOfObjects } from './SavedSearch';
import { Filter } from './Filter';

export class ControlUtils {

    static isStringTypeProperty(type: string): boolean {
        switch (type) {
            case 'EMAIL':
            case 'IPADDRESS':
            case 'PHONE':
            case 'TEXT':
            case 'TEXTAREA':
            case 'RICHTEXT':
            case 'URL':
            case 'PICKLIST':
                return true;
            default:
                break;
        }
        return false;
    }

    static canCreatePropertyControl(mf: ModelField, instance: any, isEdit: boolean): boolean {
        let show = mf.show
        if (!show) {
            return true;
        }

        let isNew = instance.id == 0;
        switch (show) {
            case 'All':
                return true;
            case 'View':
                return !isEdit;
            case 'New':
                return isNew;
            case 'Edit':
                return isEdit && !isNew;
            case 'Edit_And_View':
                return !isNew;
            case 'Never':
            default:
                return false;
        }
    }

    public static createControl(field: FieldType, isEdit: boolean, disableAddNew: boolean, needReferenceLink?: boolean): EComponent {
        let res: EComponent = { component: 'UnknownField' }
        if (isEdit) {
            ControlUtils.getReadWriteCompnent(field, disableAddNew, res);
        } else {
            ControlUtils.getReadOnlyComponent(field, res, needReferenceLink);
        }
        return res;
    }

    private static getReadWriteCompnent(field: FieldType, disableAddNew: boolean, res: EComponent): void {
        switch (field.type) {
            case "BOOLEAN":
                res.component = "CheckBoxField";
                break;
            case "AUTOINCREMENT":
                if (!field.allowPrefix) {
                    res.component = "LongField"
                } else {
                    res.component = "TextField";
                }
                break;
            case "TEXT":
                res.component = "TextField";
                break;
            case "LONG":
                res.value2 = {};
                //res.value2.localFormats = this.formats;
                res.component = "LongField";
                break;
            case "DOUBLE":
                res.value2 = {};
                //res.value2.localFormats = this.formats;
                res.component = "DoubleField";
                break;
            case "INT":
                res.value2 = {};
                //res.value2.localFormats = this.formats;
                res.component = "IntegerField";
                break;
            case "DATE":
                res.component = "DateField";
                break;
            case "DATETIME":
                res.component = "DateFieldField";
                break;
            case "TIME":
                res.component = "TimeField";
                break;
            case "EMAIL":
                res.component = "EmailField";
                break;
            case "PERCENT":
                res.value2 = {};
                //this.value2.localFormats = this.formats;
                res.component = "PercentageField";
                break;
            case "TEXTAREA":
                res.component = "TextAreaField";
                break;
            case "RICHTEXT":
                res.component = "RichTextField";
                break;
            case "IPADDRESS":
                res.component = "IPAddressField";
                break;
            case "PHONE":
                res.component = "PhoneField";
                break;
            case "AGE":
                res.component = "LabelField";
                break;
            case "PASSWORD":
                res.component = "PasswordField";
                break;
            case "REFERENCE":
                res.value1 = field.name + '_referenceFrom';
                res.value2 = {};
                ControlUtils.getReferenceTypeComponent(field, disableAddNew, res);
                break;
            case "PICKLIST":
                res.value1 = field.name + '_referenceFrom';
                res.component = "CustomComboBox";
                break;
            case "AMOUNT":
                res.value1 = field.currency;
                res.value2 = {};
                //TODO res.value2.localFormats = this.formats;
                res.value2.scale = field.scale;
                res.value2.roundingMode = field.roundingMode;
                res.component = "AmountField";
                break;
            case "BIG_DEC_PERCENT":
                res.value2 = {};
                //TODO res.value2.localFormats = this.formats;
                res.value2.scale = field.scale;
                res.value2.roundingMode = field.roundingMode;
                res.component = "BigDecimalPercentagField";
                break;
            case "BIG_DECIMAL":
                res.value2 = {};
                //TODO res.value2.localFormats = this.formats;
                res.value2.scale = field.scale;
                res.value2.roundingMode = field.roundingMode;
                res.component = "BigDecimalInputField";
                break;
        }
    }

    private static getReadOnlyComponent(field: FieldType, res: EComponent, needReferenceLink?: boolean): void {
        let fieldType = field.type;
        switch (fieldType) {
            case 'BOOLEAN':
                res.component = "BooleanReadOnlyField";
                break;
            case 'AMOUNT':
                res.component = "AmountLabel"
                break;
            case 'PERCENT':
            case 'BIG_DEC_PERCENT':
                res.component = "PercentageLabel"
                break;
            case 'RICHTEXT':
                res.component = "RichTextReadOnlyField";
                break;
            case "REFERENCE":
                if (needReferenceLink) {
                    res.component = "ReferenceLink";
                } else {
                    res.component = "LabelField";
                }
                break;
            case "TIME":
            case "DATETIME":
            case "DATE":
                res.component = "DateLabelField";
                break;
            default:
                res.component = "LabelField";
        }
    }

    private static getReferenceTypeComponent(field: FieldType, disableAddNew: boolean, res: EComponent): void {
        var attachmentType = field.attachmentType;
        if (attachmentType == null) {
            res.value1 = field.name + '_referenceFrom'
            res.value2.showAddNew = !disableAddNew;
            res.component = "CustomComboBox";
            return;
        }
        switch (field.attachmentType) {
            case "AUDIO":
                res.component = "AudioField";
                break;
            case "FILE":
                res.component = "AttachmentField";
                break;
            case "IMAGE":
                res.component = "ImageField";
                break;
            case "VIDEO":
                res.component = "VideoField";
                break;

        }
    }

    public static addDefaultValues(mapOfObjects: MapOfObjects, filters: Filter[]) {
        let values = mapOfObjects.values
        filters.forEach(f => {
            if (f.value) {
                let dv = f.value as any
                if (f.type.type == 'DATE' || f.type.type == 'DATETIME') {
                    dv = { name: dv }
                }
                if (f.isNamedCondition) {
                    dv = { displayName: dv, name: dv }
                }
                let v = values[f.identity];
                if (!v) {
                    values[f.identity] = dv;
                }
            }
        });
    }

    public static prepareMapOfObjects(mapOfObjects: MapOfObjects, filters: Filter[]): MapOfObjects {
        let values = mapOfObjects.values
        let fv: MapOfObjects = { values: {} }
        filters.forEach(f => {
            if (!f.useAsDataSet) {
                if (f.type.type == 'DATE' || f.type.type == 'DATETIME') {
                    let range = values[f.identity];
                    if (range) {
                        fv.values[f.identity] = { v: range.name, type: { type: 'PICKLIST', enumCls: 'org.ecgine.core.shared.DateRange' } }
                        if (range.name == 'Custom') {
                            fv.values[f.identity + '_Start'] = { v: range.start, type: f.type }
                            fv.values[f.identity + '_End'] = { v: range.end, type: f.type }
                        }
                    }
                } else if (f.isNamedCondition) {
                    if (values[f.identity]) {
                        fv.values[f.identity] = { v: values[f.identity].name, type: f.type }
                    }
                } else {
                    fv.values[f.identity] = { v: values[f.identity], type: f.type }
                }
                if (f.type.type == 'REFERENCE' || f.type.type == 'PICKLIST') {
                    fv.values['_ignore' + f.identity] = { v: values['_ignore' + f.identity], type: { type: 'BOOLEAN' } }
                }
            }
        });
        return fv;
    }
}