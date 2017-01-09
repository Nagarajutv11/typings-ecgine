import { ModelPaneGroup } from './ModelPaneGroup';
import { PropertyProvider } from '../PropertyProvider';

export class ModelPane {
	property?: string;
	name: string;
	groups: ModelPaneGroup[];
	tabs: ModelPane[];
	pp: PropertyProvider
	collectionDisplayType?: string
	disableAddNew?: boolean
	show?: boolean
}
