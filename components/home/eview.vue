<template>
    <div>
        <component :is="input.viewName?input.viewName:'unknownview'" :input="input" @close="onClose" @title="$emit('title',$event)"
            :closeHandler="addCloseListener"></component>
    </div>
</template>
<script lang="ts" src="./eview.ts"></script>