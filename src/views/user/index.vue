<script lang="ts">
export default {
    name: "User",
}
</script>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import { ref } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { getAssetsUrl } from '@/util/asset_path';
import { onActivated } from 'vue';

const router = useRouter()
const userStore = useUserStore();
const userInfo = ref<Recordable>({});
const accountInfo = ref<Recordable>({});

const isLoading = ref(false)

var itemTitle = ["道具商店","我的团队","我的订单","我的收藏","兑换商场","邀请好友","实名认证","新手帮助","官方客服",];
var itemImg = ["shops","team","order","collect","charge","invite","certification","help","service"];


onActivated(()=>{
    onRefresh()
})

function onRefresh(){
    isLoading.value = false
    userInfo.value = userStore.userData()
}

function loginAction() {
    router.push('/user/login')

}

function userInfoAction() {
    router.push("/user/userinfo");

}

function settingAction(){
    router.push("/user/setting");
}

</script>


<template>

<div class="container">

    <van-row class="top" style="padding-left: 20px;height: 130px;">
        <van-image @click="userInfoAction" round
            style="width: 60px;height: 60px;margin-top: auto;margin-bottom: auto;" :src="userInfo.avatarUrl??''" />
        <van-col style="padding-left: 20px;margin-top: auto;margin-bottom: auto;" v-if="useUserStore().isLogin">
            <div style="font-size: 15px;font-weight:700;">
                {{ userInfo.nickName }}
            </div>
            <div
                style="width: 30px;margin-top: 5px;text-align: center;font-size: 12px;font-weight:700;color: #fff;background-color: var(--color-orange);border-radius: 20px;">
                {{ userInfo.personalGradeName }}
            </div>
        </van-col>
        <van-col @click="loginAction" style="padding-left: 20px;margin-top: auto;margin-bottom: auto;font-weight: 500;"
            v-else>
            去登录
        </van-col>

        <van-row justify="end" style="text-align: right;flex: 1;padding-right: 20px;padding-top: 20px;">
                <van-icon name="setting-o" size="25px" @click="settingAction" />
        </van-row>

    </van-row>


    <van-pull-refresh style="flex: 1;width: 100%;" v-model="isLoading" @refresh="onRefresh" loading-text="加载中" success-text="刷新成功">

        <van-col
        style="background-color: white;margin-top: 10px;margin-left: 10px;margin-right: 10px;border-radius: 10px;padding-left: 10px;padding-right: 10px;padding-top: 5px;padding-bottom: 8px;">

        <van-row justify="space-between">
            <div style="font-weight: bold;">我的订单</div>
        </van-row>

        <van-row
            style="background-color: #f6e9e0; border-radius: 5px;margin-top: 5px;padding-bottom: 8px;padding-top: 8px;">
            <van-col style="text-align: center;" span="6">
                <div style="font-weight: 700;font-size: 13px;">我的通票</div>
                <div style="font-size: 11px; color: #f66a09;font-weight: 700;">
                    {{ parseFloat(accountInfo?.throughTicket??'0.0').toFixed(1) }}</div>
            </van-col>
            <van-col style="text-align: center;" span="6">
                <div style="font-weight: 700;font-size: 13px;">贡献值</div>
                <div style="font-size: 11px; color: #f66a09;font-weight: 700;">
                    {{ parseFloat(accountInfo?.contributeBalance??0).toFixed(1) }}</div>

            </van-col>
            <van-col style="text-align: center;" span="6">
                <div style="font-weight: 700;font-size: 13px;">能量值</div>
                <div style="font-size: 11px; color: #f66a09;font-weight: 700;">
                    {{ parseFloat(accountInfo?.energyValueBalance??0).toFixed(1) }}</div>

            </van-col>
            <van-col style="text-align: center;" span="6">
                <div style="font-weight: 700;font-size: 13px;">我的通证</div>
                <div style="font-size: 11px; color: #f66a09;font-weight: 700;">
                    {{ parseFloat(accountInfo?.myTokenValue??0).toFixed(1) }}</div>

            </van-col>
        </van-row>
    </van-col>

    <van-col
        style="background-color: white;margin-top: 10px;margin-left: 10px;margin-right: 10px;border-radius: 10px;padding-left: 10px;padding-right: 10px;padding-top: 5px;padding-bottom: 8px;">

        <van-row justify="space-between">
            <div style="font-weight: bold;font-size: 13px;">常用功能</div>
        </van-row>

        <van-row>
        <van-col style="text-align: center;padding-top: 10px;" span="4" v-for=" (item,index) in itemTitle">
            <div>
                <img style="height: 20px;width: 20px;margin: top: 10px;bottom: 20px; "
                    :src='getAssetsUrl("images/my/icon_my_item_"+itemImg[index]+".png")' />
            </div>
            <label style="font-size: 12px;">{{ item }}</label>
        </van-col>
    </van-row>
    </van-col>


   

    </van-pull-refresh>

</div>

  



    <Tabbar />
</template>

<style scoped lang="less">
.container {
    flex-direction:column;
    width: 100%;
    min-height: 100vh;
    display: flex;
}

.top {
    background: url('@/assets/images/my/icon_my_top_bck.png');
    background-size: 100vw;
}</style>