<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th v-for="column in allColumns" @click="orderByColumn(column.id)" v-if="column.show">
                        <div>{{column.name}}</div>
                        <div v-if="column.sortable"></div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows" >
                    <td v-for="column in allColumns" v-if="column.show">
                        <Control :comp="column.component" :value="row" :property="column.id" @propertyChange="onPropertyChange($event,row)" :value1Prop="column.value1"
                            :value2="value2" :disableProp="column.disableProp" @click="onCellClick(row, $event)">
                        </Control>
                    </td>
                </tr>
                <tr v-if="!rows || rows.length==0" class="VueTables__no-results">
                    <td class="text-center" :colspan="allColumns.length">
                        No Results
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script lang="ts" src="./etable.ts"></script>