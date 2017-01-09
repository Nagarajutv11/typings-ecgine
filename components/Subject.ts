import { Entity } from './Entity'

export class Subject {

    canRead(entity: Entity): boolean {
        return true;
    }

    canEdit(entity: Entity): boolean {
        return true;
    }

    canDelete(entity: Entity): boolean {
        return true;
    }
}