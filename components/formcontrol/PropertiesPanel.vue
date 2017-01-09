<template>
  <div id="pp">
    <span> {{group.label}} </span>
    <FormItem v-for="modelfield in group.fields" :modelfield="modelfield" :entity="input.entity" :value="input.value" :isEdit="input.isEdit" @propertyChange="onPropertyChange">
    </FormItem>
  </div>
</template>
<script lang="ts" src="./PropertiesPanel.ts"></script>