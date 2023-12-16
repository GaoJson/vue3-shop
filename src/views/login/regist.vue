
<script setup lang="ts">
import useUserStore from '@/store/modules/user';
import { getAssetsUrl } from '@/util/asset_path';

import {showToast } from 'vant';
import { ref } from 'vue';
import { useRouter } from 'vue-router';




const router = useRouter()
const account = ref('')
const password = ref('')
const ensurePassword = ref('')

const logining = ref(false)


function loginSumit() {

    if(account.value.length == 0) {
        showToast("请输入账号")
        return
    }

    if(password.value.length == 0) {
        showToast("请输入密码")
        return
    }

    if(password.value != ensurePassword.value) {
        showToast("密码不一致")
        return
    }

    var list:Object = useUserStore().getUserList()
    if (list[account.value] == undefined) {
        var user = Object()
        user.userName = account.value
        user.password = password.value
        user.nickName = account.value
        user.avatarUrl = "https://profile-avatar.csdnimg.cn/bf597b4c16134ceda0620465fde01f8a_gaojson.jpg"
        list[account.value] = user
        

        useUserStore().storageUserList(JSON.stringify(list))
    } else {
        showToast("账号已经注册")
    } 


}


</script>

<template>

<div>
        <van-icon @click="router.back"
            style="position: fixed;border-radius: 20px; left: 10px; top: 20px;background-color: #0000007a;color: white;"
            size="20px" name="arrow-left" />
        <img class="login-top" :src="getAssetsUrl('images/common/login_top.png')" />
    </div>

    <div style="height: 10px;"></div>
    <LoginInput v-model="account" placeholder="请输入手机号码" inputType="text" />
    <div style="height: 10px;"></div>
    <LoginInput v-model="password" placeholder="请输入密码" inputType="password" />
    <div style="height: 10px;"></div>
    <LoginInput v-model="ensurePassword" placeholder="请再次输入密码" inputType="password" />
    <div style="height: 20px;"></div>
    <div style="width: 70%;   margin-left: auto;
    margin-right: auto; ">
        <van-button v-bind:loading="logining" @click="loginSumit" style="" size="large" loadingText="注册中..."
            round>注册</van-button>
    </div>


</template>

<style scoped lang="less">
.login-top {
    width: 100%;
    height: auto;
}

&button {
    margin-top: 20px;
    height: 40px;
    width: 100%;
    background-color: rgb(248, 130, 26);
    color: #fff;
}
</style>