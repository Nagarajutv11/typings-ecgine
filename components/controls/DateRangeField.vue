<template>
    <div>        
        <select @change="onDateChange">
            <option :value="0" :selected="i==selectedIndex">ALL</option>            
            <option v-for="(v, i) in ranges" :value="i" :selected="i==selectedIndex">{{v.displayName}}</option>
        </select>
        <span>From</span><input :value.date="custom.start?custom.start.toJSON().slice(0,10):''" :disabled="customDisable" type="date" @change="onFromChange">
        <span>To</span><input :value.date="custom.end?custom.end.toJSON().slice(0,10):''" :disabled="customDisable" type="date" @change="onToChange">
    </div>
</template>
<script lang="ts" src="./DateRangeField.ts"></script>