<template>
    <div>
        <table>
            <thead>
                <tr v-if="datasets&&datasets.leangth!=0">
                    <th style="width:100px"></th>
                    <th v-for="column in datasets" style="width:100px" :rowspan="column.rowspan?column.rowspan:1" :colspan="column.colspan?column.colspan:1">
                        <div>{{column.name}}</div>
                    </th>
                </tr>
                <tr>
                    <th style="width:100px">+/-</th>
                    <th v-for="column in columns" v-if="!column.rowspan" style="width:100px">
                        <div>{{column.name}}</div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <!--<treerow v-for="item in nodes" :root="item" :columns="columns"></treerow>                -->
                <tr v-for="node in nodes" v-if="!node.collapse" @click="$emit('row-click',$event, node.row)">
                    <td style="width:100px"><button @click="onBtnClick(node)">{{node.collapse?'+':'-'}}</button></td>
                    <td v-for="column in columns" style="width:100px">
                        <Control :comp="column.component" :value="node.row" :property="column.id" @propertyChange="onPropertyChange($event,row)"
                            :value1Prop="column.value1" :value2="value2">
                        </Control>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script lang="ts" src="./treetable.ts"></script>