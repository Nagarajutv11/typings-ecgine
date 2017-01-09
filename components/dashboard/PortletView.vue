<template>
    <div>
        <div><b>{{layout.portlet.name}}</b> <button @click="onRefresh">R</button></div>
        <eview v-if="input" :input="input" @close="onClose" @title="onTitleChange">
            </component>
    </div>
</template>
<script lang="ts" src="./PortletView.ts"></script>