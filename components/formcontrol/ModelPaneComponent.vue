<template>
    <div id="mp" v-if="modelpane">
        <div v-if="modelpane.groups.length!=0">
            <component v-for="group in modelpane.groups" :group="group" :is="getComponent(modelpane.property)" :input="groupInput" :property="modelpane.property"
                :pp="modelpane.pp" :name="name" @propertyChange="$emit('propertyChange',$event)">
            </component>
        </div>
        <div v-if="modelpane.groups.length==0">
            <component :is="getComponent(modelpane.property)" :input="groupInput" :property="modelpane.property" :pp="modelpane.pp" :name="name"
                @propertyChange="$emit('propertyChange',$event)">
            </component>
        </div>

        <div v-if="modelpane.tabs.length!=0">
            <div class="row">
                <a v-for="tab in modelpane.tabs" class="col-md-1" v-if="input.value[tab.property + '_exist'] == undefined || input.value[tab.property + '_exist']"
                    @click="selectedTab=tab">{{tab.name}}</a>
            </div>            
            <div v-for="tab in modelpane.tabs">
                <model-pane-component v-show="selectedTab==tab" :modelpane="tab" :name="tab.name" :input="groupInput" @propertyChange="onPropertyChange">
                </model-pane-component>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./ModelPaneComponent.ts"></script>