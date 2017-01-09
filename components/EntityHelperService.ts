import { Observable, Observer } from 'rx'
import { DatabaseObject } from './DatabaseObject'
import { FieldValue } from './FieldValue'

export interface EntityHelperService {

	getComputaionValue(value: DatabaseObject, fieldName: string): Observable<FieldValue>;

	getDefaultValue(value: DatabaseObject, fieldName: string): Observable<FieldValue>;

	getExistancyValue(value: DatabaseObject, fieldName: string): Observable<boolean>;

	getExistNotUsingEntityFieldsValue(entityName: string, fieldName: string): Observable<boolean>;

	validate(value: DatabaseObject, fieldName: string): Observable<boolean>;

	getCustomWriteControlValue(value: DatabaseObject, fieldName: string): Observable<boolean>;

	getAllInstances(entityName: string, filters?: string, loadPaths?: string[]): Observable<DatabaseObject[]>;

	getReferenceFromValues(value: DatabaseObject, entity: string, fieldName: string): Observable<DatabaseObject[]>;
}