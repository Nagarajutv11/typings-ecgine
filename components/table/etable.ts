import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { TableColumn } from './TableColumn'

import * as Control from '../controls/Control.vue'

@Component({
  components: { Control }
})
export default class Table extends Vue {

  @Prop
  columns: TableColumn[];

  @Prop
  rows: any[];

  selected: any;

  allColumns: TableColumn[] = [];

  @Lifecycle
  mounted() {
    this.allColumns = this.columns;
    this.$watch('columns', (n) => {
      this.allColumns = n;
    })
  }

  orderByColumn(col: string, asc: boolean): void {
    this.$emit('order-by-column', col, asc);
  }

  onRowClick(row: any): void {
    this.selected = row;
    this.$emit('row-click', row);
  }

  onCellClick(row: any, e: any): void {
    this.$emit('cell-click', { id: e.id, type: e.type, row });
  }

  onPropertyChange(path: string, row: any) {
    this.$emit('propertyChange', path, this.rows.indexOf(row));
  }
}