
<script setup lang="ts">

import { ref } from 'vue';

import { useRouter } from 'vue-router';

const chatList = ref<Recordable>([]);
chatList.value.push("11");

const router = useRouter();


function enterChatPage(){
    router.push({ path: '/Chat' })
}


</script>


<template>
    <van-nav-bar style="position: fixed;width:min(100%,480px)" title="聊天"></van-nav-bar>
  
    <div style="padding-top:var(--van-nav-bar-height);" class="chat">
    <van-col>
        <van-row v-for="i in 5" @click="enterChatPage">
            <img src="https://upload.jianshu.io/users/upload_avatars/3136195/484e32c3504a.jpg" alt="" />
            <div style="margin-left: 10px;"></div>
            <van-col style="vertical-align: middle;height: 100%;padding-bottom: 0;" justify="center" >
                <div>会当凌决定{{ i }}</div>
                <div style="color: gray;">梭哈一下</div>
            </van-col>
        </van-row>
        <van-row>
        </van-row>

    </van-col>



</div>

    <Tabbar />
</template>

<style lang="less" scoped>

.van-nav-bar {
    display: fixed;
    width: min(100%, 480px);
    z-index: 999;
    color: #fff;
    background: linear-gradient(90deg, #ff9603, #fbb67a);  

    :deep(.van-nav-bar__title) {
		color: white;
	}


}
:deep(.van-nav-bar__text) {
		color: #EF1726;
	}



.chat {
    .van-col{
        background-color: #fff;
        .van-row {
            padding-top: 10px;
            padding-left: 10px;
    
            img{
                border-radius: 20px;
                height: 60px;
                width: 60px;
            }

        }
    }
}


</style>