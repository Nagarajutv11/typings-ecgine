<template>
    <div>
        <input :value="value.name">
        <span v-if="value">{{value.name}}</span>
        <button @click="changeText"></button>
    </div>

</template>
<script lang="ts" src="./test.ts"></script>