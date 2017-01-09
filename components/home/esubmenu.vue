<template>
    <div>
        <li v-if="!menu.submenus&&appid!=''">
            <router-link :to="{name:'home',params:{appid:appid,viewid:menu.command}}">{{menu.name}}</router-link>
        </li>
        <li class="dropdown" v-if="menu.submenus&&appid!=''">
            <template slot="title">{{menu.name}}</template>
            <ul class="dropdown-menu">
                <esubmenu v-for="item in menu.submenus" :menu="item"></esubmenu>
            </ul>
        </li>
    </div>
    <!--<el-submenu :index="index" v-if="menus">
        <template slot="title">{{name}}</template>
        <el-menu-item v-for="(item,i) in menus" :index="index+'-'+(i+1)" v-if="!item.submenus&&appid!=''">
            <router-link :to="{name:'home',params:{appid:appid,viewid:item.command}}">{{item.name}}</router-link>
        </el-menu-item>
        <esubmenu v-for="(item,i) in menus" v-if="item.submenus" :index="index+'-'+(i+1)" :menus="item.submenus" :name="item.name"></esubmenu>
    </el-submenu>-->
</template>
<script lang="ts" src="./esubmenu.ts"></script>