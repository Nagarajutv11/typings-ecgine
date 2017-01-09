import { Field } from '../Field';

export class SavedSearch {
	name(): string {
		return '';
	}
	identity(): string {
		return '';
	}
	model(): string {
		return '';
	}
	filters(): SearchFilter[] {
		return [];
	}
	columns(): SearchColumn[] {
		return [];
	}
	orderBys(): SearchOrder[] {
		return [];
	}
	disableViewEdit(): boolean {
		return false;
	}
	disableNewButton(): boolean {
		return false;
	}
	openAsDialog(): boolean {
		return false;
	}
	criteria(): string {
		return '';
	}
	needPagination(): boolean {
		return true;
	}
	limit(): number {
		return 50;
	}
}

export class SearchColumn {
	name: string;
	identity: string;
	searchColumnType: string = "PropertyPath";
	propertyPath: string;
	summaryType: string;
	functionType: string;
	summaryLabel: string;
	needLink: boolean;
	minWidth: number = 150;
	maxWidth: number;
	width: number;
	whenOrderByProperty: string;
	formula: string;
}

export class SearchFilter {
	identity: string;
	name: string;
	path: string;
	textFilterType: string;
	showAsMultiSelect: boolean;
	showInFilterRegion: boolean = true;
	namedConditions: SearchNamedCondition[];
	dateRangeFilters: string;
	searchFilterType: string = "PropertyFilter";
	description: string;
	collapse: boolean;
	supportAll: boolean = true;
	condition: string;
	values: string;
	value: string;
}

export class SearchOrder {
	property: string;
	descending: boolean;
}

export class SearchNamedCondition {
	name: string;
	conditon: string;
}

export class SearchInformation {
	searchBuilder: string;
	searchDefinition: SearchDefinition;
	savedSearch: SavedSearch;
}

export class SearchDefinition {

	columns: { [name: string]: Field };

	filters: { [name: string]: Field };

	public getColumnInfo(name: string): Field {
		return this.columns[name];
	}

	public getFilterInfo(name: string): Field {
		return this.filters[name];
	}

}