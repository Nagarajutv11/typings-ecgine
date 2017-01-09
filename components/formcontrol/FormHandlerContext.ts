import { DatabaseObject } from '../DatabaseObject'

export interface FormHandlerContext {

    instance(): DatabaseObject;

    setStatus(status: string): void;

    isEdit(): boolean;
}  