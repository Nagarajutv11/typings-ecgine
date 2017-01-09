import {PropertySubTab} from './PropertySubTab';
import {PropertyFieldGroup} from './PropertyFieldGroup';
import {PropertyField} from './PropertyField';
import {FormAction} from './FormAction';
import {ModelField} from './ModelField';
import {ModelFieldGroup} from './ModelFieldGroup';

export class Form {
    
    formid:string

    identity: string;

    name: string;

    handler: string;

    inActive: boolean;

    isPreferred: boolean;

    enableFieldEditingOnLists: boolean;
 
    useForPopups: boolean;

    popupOnly: boolean;

    subTabs: PropertySubTab[];

    fieldGroups: PropertyFieldGroup[];

    fields: PropertyField[];

    actions: FormAction[];

    modelFieldGroups:ModelFieldGroup[];

}