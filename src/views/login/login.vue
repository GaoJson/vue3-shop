
<script setup lang="ts">

import { ref } from 'vue';
import { getAssetsUrl } from "@/util/asset_path";
import API_USER from '@/apis/account'

import { showToast } from 'vant';

import storage from "good-storage";

import {useRouter } from 'vue-router';
import useUserStore from '@/store/modules/user';

const router = useRouter()
const account = ref('')
const password = ref('')

const logining = ref(false)



function loginSumit() {
    logining.value = true
    var params = {
        'userName': account.value,
        'password': password.value,
    }
   
    API_USER.login(params).then((res:Recordable) => {
        logining.value = false
        if (res.code == 200) {
            showToast('登录成功')
            storage.set('token', res.data.userName)
            useUserStore().token = res.data.userName;
            router.replace({ path: '/user' })
        } else {
            showToast(res.msg)
        }
    });
}

function gotoRegist(){
    router.push({path:"/user/regist"})

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
    <div style="height: 20px;"></div>
    <div style="width: 70%;   margin-left: auto;
    margin-right: auto; ">
        <van-button v-bind:loading="logining" @click="loginSumit" style="" size="large" loadingText="登录中..."
            round>登录</van-button>
    </div>

    <div @click="gotoRegist" style="margin-left: auto;margin-right: auto;margin-top: 10px;text-align: center;color: #fb740c;">暂无账号？去登录</div>

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