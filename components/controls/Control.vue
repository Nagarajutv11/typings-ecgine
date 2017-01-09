<template>
    <component :is="comp" :value="value[property]" :value1="value[value1Prop]" :value2="value2" :disable="value[disableProp]"
        @change="onPropertyChange" @click="$emit('click', {id:property, type:$event})">
    </component>
</template>
<script lang="ts" src="./Control.ts"></script>