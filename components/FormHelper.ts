import { Ecgine } from './Ecgine'
import { Observable } from 'rx';

export interface FormHelper<T> {
	
	getDefaultValues(): { [prop: string]: Computation<T, any> };
	
	getComputations(): { [prop: string]: Computation<T, any> };
	
	getExistancyConditions(): { [prop: string]: Computation<T, boolean> };
	
	getCustomWriteControls(): { [prop: string]: Computation<T, boolean> };
	
	getReferenceFroms(): { [prop: string]: Computation<T, any[]> };
	
	getValidations(): { [prop: string]: Computation<T, boolean> };
}

export interface Computation<T, R> {
  compute($e: Ecgine, instance: T, callback: (r: R) => void): void;
}