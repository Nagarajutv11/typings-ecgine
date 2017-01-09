export class FieldType {
	name: string;
	type: string;
	allowPrefix: boolean;
	attachmentType: string
	isCollection: boolean;
	referenceType: string;
	enumCls: string;
	isEmbedded: boolean;
	isChild: boolean;
	writeControlType: string;
	prefilBasedOn: string;
	currency: string;
	scale: number;
	roundingMode: string;
	prefilType: string;
}

export class Field extends FieldType{
	isMaster:boolean;
	hasDefaultValue: boolean;
	hasComputation: boolean;
	hasExistancyCondition: boolean;
	hasExistNotUsingEntityFields: boolean;
	hasReferenceFrom: boolean;
	hasValidation: boolean;
	useDefaultIfNotExists: boolean;
	canOverrideUserValue: boolean;
	defaultValue: any;

	computationPaths: string[];
	defaultValuePaths: string[];
	existanceConditionPaths: string[];	
	customWritePaths: string[];
	referenceFromPaths: string[];
}