<template>
    <div>
        <chartist v-if="chartData" ratio="ct-major-second" :type="type" :data="chartData" :options="chartOptions">
        </chartist>
    </div>
</template>
<script lang="ts" src="./ChartPortletView.ts"></script>