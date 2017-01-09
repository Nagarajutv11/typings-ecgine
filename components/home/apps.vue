<template>
    <div class="apps">
        <div class="apps-title">
            Apps List
        </div>
        <div class="apps-list">
            <div v-for="app in apps">
                <img :src="app.icon" @click="openApp(app.appId)" width="100"></img></br>
                <span>{{app.name}}</span>
            </div>            
        </div>
    </div>
</template>
<script lang="ts" src="./apps.ts"></script>