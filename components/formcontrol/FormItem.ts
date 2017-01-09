
import { Vue, Component, Lifecycle, Prop } from 'av-ts'
import { PropertyField } from './PropertyField';
import { Entity } from '../Entity';
import { Field } from '../Field';
import LocalFormats from '../LocalFormats';
import { ModelField } from './ModelField';
import { $e } from '../Ecgine';
import { EntityRegistry } from '../EntityRegistry';
import { NewViewDecider } from '../NewViewDecider';
import { ControlUtils } from '../ControlUtils'
import { EntityHelperService } from '../EntityHelperService';

import * as Control from '../controls/Control.vue'

@Component({
    components: { Control }
})

export default class FormItem extends Vue {

    @Prop
    modelfield: ModelField;

    @Prop
    entity: Entity;

    @Prop
    value: any;

    @Prop
    isEdit: boolean;

    value2: any = {};
    value1Prop: string = '';
    formats: LocalFormats | any = {};
    field: Field | any = undefined;

    @Lifecycle
    mounted() {
        let f = this.entity.getField(this.modelfield.property);
        if (f != null) {
            this.field = f;
        } else {
            console.error("Field not found:" + this.modelfield.property)
        }
        //TODO Get the LocalFormats
    }

    get isRequired() {
        return this.value[this.modelfield.property + '_required']
    }

    get isExisted() {
        return this.value[this.modelfield.property + '_exist'] == undefined || this.value[this.modelfield.property + '_exist']
    }

    onPropertyChange(path: any) {
        let fullpath;
        if (this.modelfield.path) {
            fullpath = this.modelfield.path + '.' + this.modelfield.property;
        } else {
            fullpath = this.modelfield.property
        }
        this.$emit('propertyChange', fullpath);
    }

    onClick(e: any) {
        if (e.type == 'addNew') {
            NewViewDecider.showNewView(this.entity, e.id, (v: any) => {
                if (v) {
                    this.value[this.modelfield.property] = v;
                    if (this.field.hasValidation) {
                        let helper = $e.helper(this.entity.name);
                        if (helper) {
                            let computation = helper.getValidations()[this.modelfield.property];
                            if (computation) {
                                computation.compute($e, this.value, this.propValueValidate);
                            }
                        } else {
                            let ehs = $e.service("org.ecgine.webui.service.EntityHelperService") as EntityHelperService;
                            ehs.validate(this.value, this.modelfield.property).subscribe(r => {
                                this.propValueValidate(r)
                            })
                        }
                    } else {
                        this.propValueValidate(true);
                    }
                }
            }, true);
        }
    }

    propValueValidate(valid: boolean) {
        if (valid) {
            this.value[this.value1Prop].push(this.value[this.modelfield.property]);
        } else {
            //TODO show dialog and remove value
            this.value[this.modelfield.property] = null;
        }
        this.onPropertyChange(this.modelfield.property)
    }

    private getComponent(): string {
        if (!this.field) {
            return '';
        }
        let res = ControlUtils.createControl(this.field, !this.isReadOnly(), this.modelfield.disableAddNew);
        if (res.value1) {
            this.value1Prop = res.value1;
        }
        for (var property in res.value2) {
            if (res.value2.hasOwnProperty(property)) {
                this.value2[property] = res.value2[property]
            }
        }
        return res.component;
    }

    private isReadOnly(): boolean {
        if (!this.isEdit) {
            return true;
        }
        let writeControlType = this.field.writeControlType;
        if (writeControlType === "READ_ONLY") {
            return true;
        }
        let iscomputedField = this.field.hasComputation;
        if (iscomputedField) {
            return true;
        }
        return false;
    }
}


