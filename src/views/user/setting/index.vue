
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

import useUserStore from '@/store/modules/user';

const router = useRouter();
const route = useRoute()


function logout(){

    useUserStore().loginOut();
    router.replace({ path: '/user'})
}


</script>




<template>

<van-nav-bar left-arrow title="安全设置" @click-left="router.back"/>

<van-cell-group style="margin-top: 10px;">
    <van-cell title="登录密码" is-link />
  <van-cell title="用户隐私协议" is-link />
  <van-cell title="用户注册协议" is-link />
</van-cell-group>

<van-button @click="logout" round style="margin-top: 15px;background-color: var(--color-orange); color: white; padding-left: 20px;padding-right: 20px;" size="large">
退出登录

</van-button>


</template>