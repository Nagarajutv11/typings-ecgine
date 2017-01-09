import { AbstractListViewInput } from './AbstractListViewInput'

export class ListViewInput extends AbstractListViewInput {
    isSummary: boolean
    isPortlet: boolean
    dontShowHeader: boolean
    limit?: number;
}