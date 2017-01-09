import { Observable } from 'rx';
import { DatabaseObject } from './DatabaseObject'
import { DBResult } from './DBResult'
import { CascadeDeleteInputItem } from './CascadeDeleteInputItem'
import { WithRequest } from './WithRequest'
import { WithResponse } from './WithResponse'
import { RecycleBinObject } from './RecycleBinObject'
import { AutoIncrementNumber } from './AutoIncrementNumber'

export interface UIBaseDatabaseService {

	cascadeDelete(obj: DatabaseObject, input: CascadeDeleteInputItem[]): Observable<DBResult>;

	delete(recordToDelete: DatabaseObject): Observable<DBResult>;

	deleteAll(recordsToDelete: DatabaseObject[]): Observable<DBResult[]>;

	deleteById(type:string, recordID:number): Observable<DBResult>;

	deleteAllById(type:string, recordIDs:number[]): Observable<DBResult[]>;

	deleteDraft(recordToDelete:DatabaseObject): Observable<DBResult>;

	insert(typeObj:DatabaseObject): Observable<DBResult>;

	insertAll(recordsToInsert:DatabaseObject[]): Observable<DBResult[]>;

	load(id:number): Observable<DatabaseObject>;

	loadFully(id:number): Observable<DatabaseObject>;

	query(soql:string): Observable<DatabaseObject[]>;

	saveAsDraft(recordToDelete:DatabaseObject): Observable<DBResult>;

	saveOrUpdate(recordToInserOrUpdate:DatabaseObject): Observable<DBResult>;

	update(recordToUpdate:DatabaseObject): Observable<DBResult>;

	updateAll(recordsToUpdate:DatabaseObject[]): Observable<DBResult[]>;

	upsert(recordToUpsert:DatabaseObject): Observable<DBResult>;

	upsertAll(recordsToUpsert:DatabaseObject[]): Observable<DBResult[]>;

	with(requests:WithRequest[]): Observable<WithResponse[]>;

	getAllInstances(typeFQN:string, filter:string, fieldsToLoad:string[]): Observable<DatabaseObject[]>;

	getDeletedObjects(type:string): Observable<RecycleBinObject[]>;

	restore(id:number): Observable<DBResult>;

	permenantDelete(id:number): Observable<DBResult>;

	getNextAutoIncrementNumbers(entityName:string, autoIncrementFields:string[]): Observable<AutoIncrementNumber[]>;
}