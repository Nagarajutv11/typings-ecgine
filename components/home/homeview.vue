<template>
    <div>
        <div v-if="tabs.length!=0">
            <div class="row">
                <div v-for="tab in tabs" class="col-md-1">
                    <a @click="onTabClick(tab)">{{tab.label}}</a>
                    <button v-if="tabs.length!=1" type="button" class="close" @click="onCloseTab(tab)">&times;</button>                    
                </div>
            </div>
            <div v-for="tab in tabs">
                <eview v-show="selectedTab==tab" :input="tab.input" @close="closeTab(tab)" :closeHandler="($event)=>{addCloseListener(tab,$event)}" @title="tab.label=$event"></eview>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./homeview.ts"></script>