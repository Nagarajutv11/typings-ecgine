import { ValidationResult } from './ValidationResult'
import { DatabaseObject } from './DatabaseObject'

export class DBResult extends ValidationResult {
    public created: boolean;
    public obj: DatabaseObject;
}