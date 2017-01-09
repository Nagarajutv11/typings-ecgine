import { $e } from './Ecgine';
import { Field } from './Field';
import { FormHelper, Computation } from './FormHelper';
import { EntityRegistry } from './EntityRegistry';
import { EntityHelperService } from './EntityHelperService';
import { PropertyProviderInstance } from './PropertyProviderInstance';
import { Entity } from './Entity';

export class PropertyProvider {

    defaults: { [key: string]: string[] } = {}
    referenceFroms: { [key: string]: string[] } = {}
    computations: { [key: string]: string[] } = {}
    exists: { [key: string]: string[] } = {}

    staticReferenceFromValues: { [key: string]: any[] } = {}

    helper: FormHelper<any>;
    ehs: EntityHelperService;
    er: EntityRegistry;
    entity: Entity;
    parent: PropertyProvider
    parentProperty: string
    isCollection: boolean;
    pp: PropertyProviderInstance;
    pps: PropertyProviderInstance[] = [];

    constructor(entity: Entity) {
        this.entity = entity;
        this.helper = $e.helper(entity.name);
        this.ehs = $e.service("org.ecgine.webui.service.EntityHelperService");
        this.er = $e.service("EntityRegistry");
    }

    public createDummyProvider(): PropertyProviderInstance {
        let dummy = this.entity.newInstance();
        this.entity.setParents(dummy, this.parent.pp.instance)
        return this.createProvider(dummy, true, true);
    }

    public createProvider(instance: any, isEdit: boolean, isDummy?:boolean): PropertyProviderInstance {
        let pp = new PropertyProviderInstance(this, instance, isEdit); 
        if (this.isCollection) {
            this.pps.push(pp);
        } else {
            this.pp = pp;
        }
        if (this.parent) {
            this.parent.addProvider(pp);
        }
        return pp;
    }

    public addProvider(pp: PropertyProviderInstance) {
        if (this.isCollection) {
            this.pps.forEach(pp => pp.addSub(pp))
        } else {
            this.pp.addSub(pp);
        }
    }

    public onPropertyChange(prop: string) {
        if (this.parent) {
            this.parent.onPropertyChange(this.parentProperty + "." + prop);
        } else {
            if (this.pp) {
                this.pp.fireWatchers(prop);
            }
        }
    }

    public remove() {
    }

    public sub(property: string): PropertyProvider {
        let f = this.entity.getField(property);
        let ppd = new PropertyProvider(this.er.entity(f.referenceType));
        ppd.parent = this;
        ppd.parentProperty = property;
        ppd.isCollection = f.isCollection
        return ppd;
    }

    public addAllComputations() {
        let _this = this
        this.entity.getAllFields().forEach(f => {
            _this.addComputation(f);
        })
    }

    public addComputation(f: Field) {
        if (f.hasComputation) {
            this.addWatchers(f.computationPaths, f.name, this.computations)
        }
    }

    public addAllDefaultValues() {
        let _this = this
        this.entity.getAllFields().forEach(f => {
            _this.addDefaultValue(f);
        })
    }

    public addDefaultValue(f: Field) {
        if (f.hasDefaultValue) {
            let cc = this.addWatchers(f.defaultValuePaths, f.name, this.defaults)
        }
    }

    public addExistingCondition(field: string) {
        let _this1 = this;
        let f = this.entity.getField(field);
        if (f.hasExistancyCondition) {
            let cc = _this1.addWatchers(f.existanceConditionPaths, field, this.exists)
        }
    }

    public addReferenceFrom(field: string) {
        let _this1 = this;
        let f = this.entity.getField(field);

        if (f.type == 'PICKLIST') {
            this.setReferenceFromValue(f.name + "_referenceFrom", this.er.enumValues(f.enumCls))
        }


        if (f.type == 'REFERENCE' && !f.isChild && !f.attachmentType) {
            if (f.hasReferenceFrom) {
                if (f.referenceFromPaths.length != 0) {
                    _this1.addWatchers(f.referenceFromPaths, field, this.referenceFroms)
                } else {
                    _this1.staticReferenceFromValues[f.name + "_referenceFrom"] = [];
                    //Helper call
                    let computation = _this1.helper ? _this1.helper.getReferenceFroms()[field] : undefined;
                    if (computation) {
                        computation.compute($e, null as any, (val: any) => {
                            _this1.setReferenceFromValue(f.name + "_referenceFrom", val)
                        })
                    } else {
                        //RpcCall
                        this.ehs.getReferenceFromValues(null as any, _this1.entity.name, field).subscribe((val: any) => {
                            _this1.setReferenceFromValue(f.name + "_referenceFrom", val)
                        });
                    }
                }
            } else if (!f.isEmbedded) {
                _this1.staticReferenceFromValues[f.name + "_referenceFrom"] = [];
                //There is no reference from, So we need to load all values.
                this.ehs.getAllInstances(f.referenceType).subscribe(val => {
                    _this1.setReferenceFromValue(f.name + "_referenceFrom", val)
                })
            }
        }
    }


    public addExistNotUsingEntity(field: Field, column: any) {
        column.show = true;
        //Helper call
        let computation = this.helper ? this.helper.getExistancyConditions()[field.name] : undefined;
        if (computation) {
            computation.compute($e, null, b => {
                column.show = b;
            })
        } else {
            this.ehs.getExistNotUsingEntityFieldsValue(this.entity.name, field.name).subscribe(b => {
                column.show = b;
            });
        }
    }

    setReferenceFromValue(name: string, val: any[]) {
        if (val == null) {
            val = []
        }
        let v = this.staticReferenceFromValues[name];
        if (v) {
            v.splice(0, v.length);
        } else {
            v = []
            this.staticReferenceFromValues[name] = v;
        }
        val.forEach(r => v.push(r))
    }

    public addWatchers(paths: string[], field: string, pathsStore: { [key: string]: string[] } = {}) {
        let _this1 = this;
        let store = pathsStore[field];
        if (!store) {
            store = []
            pathsStore[field] = store
        }
        paths.forEach(p => { _this1.addWatcher(p, store) })
    }

    public addWatcher(path: string, store: string[]) {
        let _this1 = this;
        let props = path.split('.');
        let prefix = ''
        let ref: Entity | undefined = this.entity;
        props.forEach(p => {
            if (ref) {
                let f = ref.getOptionalField(p);
                if (f && f.isMaster) {
                    ref = this.er.entity(f.referenceType);
                    p = '$';
                } else {
                    ref = undefined;
                }
            }

            let pp;
            if (prefix) {
                pp = prefix + '.' + p
            } else {
                pp = p
            }
            prefix = pp
            store.push(pp)
        });
    }
}