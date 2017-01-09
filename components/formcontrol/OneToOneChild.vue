<template>
    <div>
        <input v-if="!required" :value.boolean="hasValue" :disabled="disable" type="checkbox" @change="onHasValueChange" />
        <span>{{ 'Need '+name}}</span>
        <PropertiesPanel v-if="hasValue" :group="group" :entity="childEntity" :property="property" :value="childValue" :isEdit="isEdit" :pp="pp"
            @propertyChange="$emit('propertyChange', $event)"></PropertiesPanel>
    </div>
</template>
<script lang="ts" src="./OneToOneChild.ts"></script>