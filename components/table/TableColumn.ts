export class TableColumn {
  id: string;
  name: string;
  sortable: boolean;
  component: string;
  show: boolean = true;
  value1?: string;
  value2: any;
  disableProp: string;
  minWidth: number;
  maxWidth: number;
  width: number;
  colspan:number;
  rowspan:number;
}