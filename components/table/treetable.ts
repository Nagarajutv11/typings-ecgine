import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { TreeItem } from '../table/TreeItem';
import { TableColumn } from '../table/TableColumn';
import { $e } from '../Ecgine';
import * as treerow from './treerow.vue'
import * as Control from '../controls/Control.vue'

@Component({
  components: { treerow, Control }
})
export default class TreeTable extends Vue {

  @Prop
  datasets: TableColumn[]

  @Prop
  columns: TableColumn[]

  @Prop
  root: TreeItem

  nodes: TreeItem[] = [];

  @Lifecycle
  mounted() {
    this.nodes = []
    if (this.root) {
      this.addAllNodes(this.root);
    }
    this.$watch('root', (r) => {
      this.nodes = [];
      if (r) {
        this.addAllNodes(r);
      }
    })
  }

  addAllNodes(node: TreeItem) {
    this.nodes.push(node);
    let _this = this;
    if (node.subitems) {
      node.subitems.forEach(s => { _this.addAllNodes(s) })
    }
  }

  onBtnClick(node: TreeItem) {
    //node.collapse = !node.collapse
  }
}

export class DataSet {
  name: string
  collspan: number;
}