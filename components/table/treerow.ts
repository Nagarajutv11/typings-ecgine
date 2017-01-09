import { Vue, Component, Prop, Lifecycle } from 'av-ts'
import { TreeItem } from '../table/TreeItem';
import { TableColumn } from '../table/TableColumn';
import { $e } from '../Ecgine';
import * as Control from '../controls/Control.vue'

@Component({
  name: 'treerow',
  components: { Control }
})
export default class TreeRow extends Vue {

  @Prop
  columns: TableColumn

  @Prop
  root: TreeItem

  collapse: boolean = false;


  onBtnClick() {
    this.collapse = !this.collapse
  }
}