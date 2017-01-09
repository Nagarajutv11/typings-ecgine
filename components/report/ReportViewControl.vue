<template>
    <div>
        <!-- Filters -->
        <div>
            <filters-panel :filters="filters" :values="filterValues.values" @refresh="refresh"></filters-panel>
        </div>
        
        <treetable v-if="tableColumns" :columns="tableColumns"  :datasets="dataSetTableColumns" :root="root" @row-click="onRowClick"></treetable>
    </div>
</template>
<script lang="ts" src="./ReportViewControl.ts"></script>