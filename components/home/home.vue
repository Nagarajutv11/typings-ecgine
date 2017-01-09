<template>
    <div>
        <TopBarComponent></TopBarComponent>
        <emenu :menus="menus"></emenu>
        <homeview :viewid="$route.params['viewid']"></homeview>
        <edialog></edialog>
        <BottomBarComponent></BottomBarComponent>
    </div>
</template>
<script lang="ts" src="./home.ts"></script>