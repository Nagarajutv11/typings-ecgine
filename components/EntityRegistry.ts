import { Entity } from './Entity';
import { RemoteServiceSyncProxy, RpcConfiguration } from './RemoteServiceSyncProxy';
import { Serialization } from './Serialization';
import { FormHelper } from './FormHelper';
import { $e } from './Ecgine';

export class EntityRegistry {

    private static _instance: EntityRegistry;

    private allEntities: { [name: string]: Entity; } = {};

    private allEnums: { [name: string]: string[]; } = {};

    constructor() {
        if (EntityRegistry._instance) {
            throw new Error("Error: Do not create another object. This is singleton");
        }
        EntityRegistry._instance = this;
        let _this = this;
        $e.waitForMe(function () {
            let action = 'loading entities'
            let proxy = $e.service('RemoteServiceSyncProxy') as RemoteServiceSyncProxy;
            proxy.sendEcgineRequest("/org.ecgine.webui/u/entities", {}, function (res: any): void {
                var entities = res.entities as Entity[];
                entities.forEach(e => {
                    e = _this.createEntity(e);
                    _this.allEntities[e.name] = e;
                });
                _this.allEnums = res.enumValues;
                $e.actionCompleted(action)
            });
            return action
        });
    }

    private createEntity(entity: any): Entity {
        let e = new Entity();
        e.name = entity.name;
        e.isEmbedded = entity.isEmbedded;
        e.superClass = entity.superClass;
        e.declaredFields = entity.declaredFields;
        e.clonedFields = entity.clonedFields;
        return e;
    }

    public register(entity: Entity): void {
        this.allEntities[entity.name] = entity;
    }

    public entity(fullName: string): Entity {
        return this.allEntities[fullName];
    }

    public enumValues(fullName: string): string[] {
        return this.allEnums[fullName];
    }

    public getAllSubmodels(entity:Entity):Entity[]{
        return [];
    }

}