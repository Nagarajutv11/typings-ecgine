import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { Form } from './Form';
import { Entity } from '../Entity';
import { ModelPane } from './ModelPane';
import { PropertyFieldGroup } from './PropertyFieldGroup';
import { PropertyField } from './PropertyField';
import { ModelField } from './ModelField';
import { ModelFieldGroup } from './ModelFieldGroup';
import { ModelPaneGroup } from './ModelPaneGroup';
import { PropertySubTab } from './PropertySubTab';
import { ModelSubTab } from './ModelSubTab';
import { FormHandler } from './FormHandler';
import { FormHandlerContext } from './FormHandlerContext';
import { $e } from '../Ecgine';
import { PropertyProvider } from '../PropertyProvider';
import { PropertyProviderInstance } from '../PropertyProviderInstance';
import { FormInput } from '../FormInput';
import { DatabaseObject } from '../DatabaseObject';
import { WithRequest } from '../WithRequest';
import { FormRegistryService } from '../FormRegistryService';
import { EntityRegistry } from '../EntityRegistry';
import { UIBaseDatabaseService } from '../UIBaseDatabaseService';
import * as FormActionsPanel from './FormActionsPanel.vue';
import * as ModelPaneComponent from './ModelPaneComponent.vue';

@Component({
    components: { FormActionsPanel, ModelPaneComponent }
})
export default class FormControl extends Vue {

    @Prop
    input: FormInput;

    @Prop
    closeHandler: (listener: (close: (close: boolean) => void) => void) => void;

    modelPaneInput: any = undefined;

    form: Form | any = {};
    entity: Entity | undefined = undefined;
    value: DatabaseObject | any = undefined;
    modelpane: ModelPane | undefined = undefined;
    isEdit: boolean = false;
    saved: boolean = false;
    handler: FormHandler;
    handlerContext: FormHandlerContext;

    @Lifecycle
    created() {
        this.modelPaneInput = undefined
        if (this.closeHandler) {
            this.closeHandler(this.closeView)
        }

        if (this.input.databaseService == undefined) {
            this.input.databaseService = $e.service('org.ecgine.core.shared.api.DatabaseService')
        }
        let er = $e.service('EntityRegistry') as EntityRegistry;
        this.entity = er.entity(this.input.instance._type);
        if (this.input.instance.id == 0 || this.input.instance.id == null) {
            this.getAutoIncrementValues();
            this.value = this.input.instance;
            this.setValue();
        } else {
            let _this1 = this;
            let db = this.input.databaseService as UIBaseDatabaseService
            let ins = this.entity.newInstance();
            ins.id = this.input.instance.id;
            let wr: WithRequest = { paths: ['**',], instance: ins }
            db.with([wr]).subscribe(i => {
                _this1.value = i[0].instance;
                _this1.setValue();
            });
        }

        this.isEdit = this.input.isEdit;
        if (this.isEdit == undefined) {
            this.isEdit = true;
        }
    }

    @Lifecycle
    mounted() {
        let _this1 = this;
        this.handlerContext = {
            instance: function (): DatabaseObject {
                return _this1.value;
            },

            isEdit: function (): boolean {
                return _this1.isEdit;
            },

            setStatus: function (status: string): void {
                //TODO
            }
        }

        let fr = $e.service('FormRegistryService') as FormRegistryService;
        fr.form(this.input.instance._type, null, (form: Form) => {
            _this1.form = form;
            _this1.handler = $e.formHandler(form.handler)
            _this1.$emit('title', form.name)
            if (_this1.entity) {
                _this1.modelpane = _this1.createModelpane(new PropertyProvider(_this1.entity));
                _this1.setValue();
            }
        });
    }

    getAutoIncrementValues() {
        if (this.entity) {
            if (this.entity.isEmbedded) {
                return;
            }
            let autoIncrements = this.entity.getAllFields().filter(f => f.type == 'AUTOINCREMENT').map(f => f.name);
            if (autoIncrements.length == 0) {
                return;
            }

            let db = this.input.databaseService as UIBaseDatabaseService
            db.getNextAutoIncrementNumbers(this.entity.name, autoIncrements).subscribe(r => {
                r.forEach((v: any, i) => {
                    let a = autoIncrements[i];
                    this.value[a] = v.longValue!=null ? v.longValue : v.strValue;
                })
            })
        }
    }

    setValue() {
        if (this.modelpane && this.value) {
            this.modelpane.pp.createProvider(this.value, this.input.isEdit);
            this.modelPaneInput = { value: this.value, entity: this.entity, isEdit: this.isEdit }
        }
    }

    closeView(close: (close: boolean) => void): void {
        if (this.isEdit && !this.saved) {
            let _this1 = this as any;
            _this1.$alert('This is a message', 'Title', {
                confirmButtonText: 'OK',
                callback: (action: string) => {
                    if (action == 'confirm') {
                        if (this.input.callback) {
                            this.input.callback();
                        }
                        close(true)
                    } else {
                        close(false)
                    }
                }
            });
        } else {
            close(true);
        }
    }

    saveSuccess(val: any) {
        this.saved = true;
        if (this.input.callback) {
            this.input.callback(val);
        }
    }

    onCloseClick() {
        let _this1 = this;
        this.closeView((close: boolean) => {
            if (close) {
                this.$emit('close')
            }
        });
    }

    onNewClick() {
        this.input.callback = undefined;
        if (this.entity) {
            this.input.instance = this.entity.newInstance()
        }
        this.isEdit = true;
        this.saved = false;
        this.value = this.input.instance;
        this.modelpane = this.value;
    }

    onEditClick() {

    }

    private createModelpane(pp: PropertyProvider, property?: string): ModelPane {
        let _this = this;
        let allFields = this.getFields(property);
        let modelSubTabs = this.getTabs(property);

        let modelpane = new ModelPane();
        modelpane.pp = pp;
        modelpane.property = property;
        modelpane.tabs = [];
        modelpane.groups = [];
        if (this.isEdit) {
            pp.addAllComputations();
            pp.addAllDefaultValues();
        }

        let modelPaneGroupsBygroup: { [name: string]: any } = {};
        allFields.forEach(function (field: ModelField) {
            let modelpaneGroup = modelPaneGroupsBygroup[field.fieldGroup];
            if (!modelpaneGroup) {
                modelpaneGroup = new ModelPaneGroup();
                modelpaneGroup.group = _this.getModelFieldGroup(field)
                modelpaneGroup.fields = [];
                modelPaneGroupsBygroup[field.fieldGroup] = modelpaneGroup;
                modelpane.groups.push(modelpaneGroup);
            }
            if (_this.isEdit) {
                pp.addReferenceFrom(field.property);
                pp.addExistingCondition(field.property);
            }
            modelpaneGroup.fields.push(field);
        });

        modelSubTabs.forEach(function (modelsubTab: ModelSubTab) {
            if (_this.isEdit) {
                pp.addReferenceFrom(modelsubTab.property);
                pp.addExistingCondition(modelsubTab.property);
            }
            let mp = _this.createModelpane(pp.sub(modelsubTab.property), modelsubTab.property);
            mp.name = modelsubTab.label;
            mp.collectionDisplayType = modelsubTab.collectionDisplayType;
            mp.disableAddNew = modelsubTab.disableAddNew;
            mp.show = modelsubTab.show;
            modelpane.tabs.push(mp);
        });

        return modelpane;
    }

    private getFields(property?: string): ModelField[] {
        var modelFields = [] as ModelField[];
        if (!this.form.fields) {
            return modelFields;
        }
        this.form.fields.forEach(function (propertyField: PropertyField) {
            if (propertyField.property != property) {
                return;
            }
            propertyField.fields.forEach(function (mf: ModelField) {
                modelFields.push(mf);
            });
        });
        return modelFields;
    }

    private getTabs(property: string | undefined): ModelSubTab[] {
        var modelSubTabs = [] as ModelSubTab[];
        if (!this.form.subTabs) {
            return modelSubTabs;
        }
        this.form.subTabs.forEach(function (propertySubTab: PropertySubTab) {
            if (propertySubTab.property != property) {
                return;
            }
            propertySubTab.tabs.forEach(function (mst: ModelSubTab) {
                modelSubTabs.push(mst);
            });
        });
        return modelSubTabs;
    }

    private getFieldsByGroup(fieldgroup: ModelFieldGroup, allFields: ModelField[]): ModelField[] {
        let modelFields = [] as ModelField[];
        if (!allFields) {
            return [];
        }
        allFields.forEach(function (field: ModelField) {
            if (field.fieldGroup === fieldgroup.label) {
                modelFields.push(field);
            }
        });
        return modelFields;
    }

    private getModelFieldGroup(mf: ModelField): ModelFieldGroup | null {
        if (!this.form.fieldGroups) {
            return null;
        }
        for (var pfg of this.form.fieldGroups) {
            for (var mfg of pfg.groups) {
                if (mfg.label === mf.fieldGroup) {
                    return mfg;
                }
            }
        }
        return null;
    }
}