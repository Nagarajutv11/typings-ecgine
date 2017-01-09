<template>
    <input :value.date="value?value.toJSON().slice(0,10):''" :disabled="disable" type="date" @change="onChange">
</template>
<script lang="ts" src="./DateField.ts"></script>