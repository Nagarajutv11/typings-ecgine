import { Field } from './Field'
import { EntityRegistry } from './EntityRegistry'
import { DatabaseObject } from './DatabaseObject'
import { $e } from './Ecgine'
export class Entity {
    name: string;
    isEmbedded: boolean;
    superClass: string;
    declaredFields: Field[];
    clonedFields: Field[];
    isAbstract: boolean;
    isChildModel: boolean
    displayName: string
    isAllowDrafts: boolean;
    editCriteria: string;
    isSingleton: boolean

    private allFields: Field[];

    public getAllFields(): Field[] {
        if (!this.allFields) {
            this.allFields = [];

            if (this.superClass != null) {
                let er = $e.service('EntityRegistry') as EntityRegistry;
                let superEntity = er.entity(this.superClass);
                let superFields = superEntity.getAllFields();
                let thisFieldsMap: { [name: string]: Field } = {};
                this.clonedFields.forEach(f => {
                    thisFieldsMap[f.name] = f;
                });
                this.declaredFields.forEach(f => {
                    thisFieldsMap[f.name] = f;
                });

                //Now add other than thisFieldMap
                superFields.forEach(f => {
                    if (!thisFieldsMap[f.name]) {
                        this.allFields.push(f);
                    }
                });
            }

            this.clonedFields.forEach(f => {
                this.allFields.push(f);
            });
            this.declaredFields.forEach(f => {
                this.allFields.push(f);
            });
        }
        return this.allFields;
    }

    public getField(fieldName: string): Field {
        let f = this.getOptionalField(fieldName);
        if (f != null) {
            return f;
        }
        throw "Field not found";
    }

    public getOptionalField(fieldName: string): Field | null {

        for (let f of this.declaredFields) {
            if (f.name == fieldName) {
                return f;
            }
        }

        for (let f of this.clonedFields) {
            if (f.name == fieldName) {
                return f;
            }
        }

        if (this.superClass != null) {
            let er = $e.service('EntityRegistry') as EntityRegistry;
            let superEntity = er.entity(this.superClass);
            return superEntity.getOptionalField(fieldName);
        }

        return null;
    }

    public setParents(ins: any, parent: any) {
        ins.parent = parent;
        this.getAllFields().forEach(f => {
            if (f.isMaster) {
                ins[f.name] = parent;
            }
        })
    }
    public canAssign(right: Entity): boolean {
        if (this.name == right.name) {
            return true;
        }
        if (right.superClass) {
            let er = $e.service('EntityRegistry') as EntityRegistry;
            let superEntity = er.entity(right.superClass);
            return this.canAssign(superEntity);
        }
        return false;
    }
    public addCanWriteProp(ins: any) {
        this.getAllFields().forEach(f => {
            ins[f.name + '_canWrite'] = true;
        })
    }

    public newInstance(): DatabaseObject {
        let val = { _type: this.name, id: 0, objStatus: 'SAVED' } as any;
        this.getAllFields().forEach(f => {
            val[f.name] = null;
            if (f.hasExistancyCondition) {
                val[f.name + '_exist'] = null;
            }
            if (f.hasReferenceFrom) {
                val[f.name + '_referenceFrom'] = null;
            }
        })
        return val;
    }
}