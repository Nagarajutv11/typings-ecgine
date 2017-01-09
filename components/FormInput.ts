import { IViewInput } from './IViewInput'
import { DatabaseObject } from './DatabaseObject'
import { UIBaseDatabaseService } from './UIBaseDatabaseService'

export class FormInput implements IViewInput {
    instance: DatabaseObject;
    isEdit: boolean;
    databaseService?: UIBaseDatabaseService;
    openedFromViewMode?: boolean;
    callback?: (v?: DatabaseObject) => void;
    viewName: 'FormView';
}