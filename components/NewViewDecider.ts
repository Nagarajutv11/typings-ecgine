import { $e } from './Ecgine'
import { Entity } from './Entity'
import { DatabaseObject } from './DatabaseObject'
import { UIBaseDatabaseService } from './UIBaseDatabaseService'
import { EntityRegistry } from './EntityRegistry'
import { FormInput } from './FormInput'
import { ViewManager } from './ViewManager'


export class NewViewDecider {

    static showNewView(entity: Entity, property: string, callback: (val?: DatabaseObject) => void,
        isShowInDialog: boolean, db?: UIBaseDatabaseService): void {
        let field = entity.getField(property);
        let type = field.type;
        let er = $e.service('EntityRegistry') as EntityRegistry;
        let referenceType = er.entity(field.referenceType);
        if (type == 'REFERENCE') {
            if (referenceType.isAbstract) {
                let subEntites = er.getAllSubmodels(referenceType);
                NewViewDecider.showSubModelsDialog(subEntites, entity.displayName, callback, isShowInDialog, db);
            } else {
                NewViewDecider.showModelForm(referenceType, callback, isShowInDialog, db);
            }
        }
    }

    static showSubModelsDialog(subModels: Entity[], name: string,
        callback: (val: DatabaseObject) => void, isShowInDialog: boolean, db?: UIBaseDatabaseService) {
        // final SubModelSelectionDialog dialog = new SubModelSelectionDialog(name, subModels, messages);
        // Optional < Entity > result = dialog.showAndWait();
        // if (result.isPresent()) {
        //     NewViewDecider.showModelForm(dialog.getResult(), callback, isShowInDialog, db);
        // } else {
        //     // No model selected(Might be closed dialog). Then inform call back
        //     // as no new obj created.
        //     callback.accept(null);
        // }
    }

    static showModelForm(model: Entity, callback: (val?: DatabaseObject) => void,
        isShowInDialog: boolean, db?: UIBaseDatabaseService) {
        if (model == null) {
            if (callback != null) {
                callback();
            }
            return;
        }
        let newInstance = model.newInstance();
        let formInput: FormInput = { viewName: 'FormView', instance: newInstance, isEdit: true, openedFromViewMode: false, databaseService: db }
        formInput.callback = callback;
        let vm = $e.service('ViewManager') as ViewManager;

        if (isShowInDialog) {
            vm.openViewInDialog(model.displayName, formInput);
        } else {
            //TODO vm.openView(formInput);
        }
    }
}