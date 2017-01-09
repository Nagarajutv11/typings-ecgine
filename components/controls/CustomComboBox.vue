<template>
    <span>
        <select @change="onChange" :disabled="disable">
            <option :value="-1"> </option>
            <option v-for="(v, i) in list" :value="i" :selected="i==selectedIndex">{{v.displayName}}</option>
        </select>
        <button v-if="this.value2 && this.value2.showAddNew" @click="onAddNew" :disabled="disable">+</button>
    </span>
</template>
<script lang="ts" src="./CustomComboBox.ts"></script>