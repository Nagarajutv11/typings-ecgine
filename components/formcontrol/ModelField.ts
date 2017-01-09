import { CheckBoxDefault } from './CheckBoxDefault';
export class ModelField {

    property: string;

    path: string;

    show: string = 'All';

    mandatory: boolean;

    displayType: string = 'Normal';

    label: string;

    fieldGroup: string;

    columnBreak: boolean;

    spaceBefore: number;

    sameRowAsPrevious: boolean;

    checkBoxDefault: CheckBoxDefault = CheckBoxDefault.UseFieldDefault;

    disableAddNew: boolean;

    minWidth: number;

    maxWidth: number;

    width: number;

    controlProviderId: string;

    isDisabled: boolean;
}