<template>
  <div id="fi" v-if="isExisted">
    <span>{{modelfield.label}}</span>
    <span v-if="isRequired">*</span>

    <Control v-if="field" :comp="getComponent()" :value="value" :property="modelfield.property" :value1Prop="value1Prop" :value2="value2"
      @propertyChange="onPropertyChange" @click="onClick">
    </Control>
  </div>
</template>
<script lang="ts" src="./FormItem.ts"></script>
<style>
  div#fi {
    display: -webkit-box;
  }
</style>