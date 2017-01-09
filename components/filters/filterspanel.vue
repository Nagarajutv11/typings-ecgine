<template>
    <div>
        <div v-for="f in totalFilters">
            <span>{{f.name}}</span>
            <Control :comp="getComponent(f)" :value="values" :property="f.identity" :value1Prop="getValue1Prop(f)" :value2="getValue2(f)"
                @propertyChange="onPropertyChange(f)">
            </Control>
        </div>
    </div>
</template>
<script lang="ts" src="./filterspanel.ts"> </script>