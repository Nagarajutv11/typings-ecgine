<template>
    <!--<tr v-for="r in (collapse?[root]:[root].concat(root.subitems))">
        <td style="width:100px"><button @click="onBtnClick()">{{collapse?'+':'-'}}</button>{{root.name}}</td>
        <td v-for="column in columns" style="width:100px">
            <Control :comp="column.component" :value="root.row" :property="column.id" @propertyChange="onPropertyChange($event,row)"
                :value1Prop="column.value1" :value2="value2">
            </Control>
        </td>
    </tr>-->
    <!--<treerow v-show="!collapse&&root.subitems" v-for="item in root.subitems" :root="item" :columns="columns"></treerow>-->
</template>
<script lang="ts" src="./treerow.ts"></script>