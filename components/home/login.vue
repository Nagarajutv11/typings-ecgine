<template>
    <div class="web_login_form">
        <div id="login_error" class="common-box">
            <span>{{errormessage}} </span>
        </div>
        <div class="email_field">
            <label>Email</label>
            <input v-model="emailId" type="text" name="emailId" />
        </div>
        <div class="password_field">
            <label>Password</label>
            <input v-model="password" type="password" name="password" />
        </div>
        <div class="loginbutton">
            <button @click="login">Login</button>
            <el-button type="primary">Primary Button</el-button>
        </div>
        <test :value="testVal"></test>
        <!--<treerow v-if="root" :columns="columns" :root="root" ></treerow>-->
        <button @click="testVal.name += 'naga'">test</button>
    </div>
</template>
<script lang="ts" src="./login.ts"></script>