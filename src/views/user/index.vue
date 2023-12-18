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
import { onMounted } from 'vue';

const router = useRouter()
const userStore = useUserStore();
const userInfo = ref<Recordable>({});
const orderInfo = ref([0,0,0,0]);

const isLoading = ref(false)

var itemTitle = ["我的地址","我的团队","我的订单","我的收藏","兑换商场","邀请好友","实名认证","新手帮助","官方客服",];
var itemImg = ["shops","team","order","collect","charge","invite","certification","help","service"];

onMounted(()=>{
 
    onRefresh()
})

onActivated(()=>{
    
})

function onRefresh(){
    isLoading.value = false
    userInfo.value = userStore.userData()
    orderInfo.value = [0,0,0,0]

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

function itemClickAction(title:String) {
    if (title == "我的地址") {
        router.push("/user/addressList");
    }
    
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

        <van-row justify="space-between" >
            <div style="font-weight: bold;">我的订单</div>
            <van-row style="margin-top: 5px;">
                <div style="font-size: 12px;color: gray;line-height: 15px;">全部订单</div>
                <van-icon name="arrow" />
            </van-row>
        </van-row>

        <van-row
            style="margin-top: 10px">
            <van-col style="text-align: center;" span="6" >
                <van-badge :content="orderInfo[0]?orderInfo[0]:undefined">
                    <van-image style="width: 31px;height: 25px;" :src="getAssetsUrl('images/my/ic_my_order_1.png')"/>
                </van-badge>
                <div style="font-size: 12px;">待支付</div>
            </van-col>
            <van-col style="text-align: center;" span="6">
                <van-badge :content="orderInfo[1]?orderInfo[1]:undefined">
                    <van-image style="width: 31px;height: 25px;" :src="getAssetsUrl('images/my/ic_my_order_2.png')"/>
                </van-badge>
                <div style="font-size: 12px;">待发货</div>
            </van-col>
            <van-col style="text-align: center;" span="6">
                <van-badge :content="orderInfo[2]?orderInfo[2]:undefined">
                    <van-image style="width: 31px;height: 25px;" :src="getAssetsUrl('images/my/ic_my_order_3.png')"/>
                </van-badge>
                <div style="font-size: 12px;">待收货</div>
            </van-col>
            <van-col style="text-align: center;" span="6">
                <van-badge :content="orderInfo[3]?orderInfo[3]:undefined">
                    <van-image style="width: 31px;height: 25px;" :src="getAssetsUrl('images/my/ic_my_order_4.png')"/>
                </van-badge>
                <div style="font-size: 12px;">待评价</div>
    

            </van-col>
        </van-row>
    </van-col>

    <van-col
        style="background-color: white;margin-top: 10px;margin-left: 10px;margin-right: 10px;border-radius: 10px;padding-left: 10px;padding-right: 10px;padding-top: 5px;padding-bottom: 8px;">

        <van-row justify="space-between">
            <div style="font-weight: bold;font-size: 13px;">常用功能</div>
        </van-row>

        <van-row>
        <van-col style="text-align: center;padding-top: 10px; width: 20%;" v-for=" (item,index) in itemTitle">
            <div @click="itemClickAction(item)">
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