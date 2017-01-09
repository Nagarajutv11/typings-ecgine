<template>
    <!--MainView-->
    <div style="display: inline-flex">
        <!--Left View-->
        <div style="width: 100%">
            <portlet v-for="p in leftportlets" :layout="p"></portlet>
        </div>
        <!--Center View-->
        <div style="width: 100%">
            <portlet v-for="p in centerportlets" :layout="p"></portlet>
        </div>
        <!--Right View-->
        <div style="width: 100%">
            <portlet v-for="p in rightportlets" :layout="p"></portlet>
        </div>
    </div>
</template>
<script lang="ts" src="./DashboardView.ts"></script>