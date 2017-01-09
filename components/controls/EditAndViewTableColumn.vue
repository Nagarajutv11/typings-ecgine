<template>
    <div>
        <a @click="$emit('click','edit')">Edit</a> <a @click="$emit('click','view')">View</a>
    </div>
</template>
<script lang="ts" src="./EditAndViewTableColumn.ts"></script>