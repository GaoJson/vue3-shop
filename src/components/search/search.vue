
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const keyword = ref('');



</script>




<template>
<div style="position: fixed;top: 0;;height: 50px; width: 100%; background-color: white;">

    <van-row style="height: 100%">
        <van-icon @click="router.back" style="padding-left: 8px;margin-top: auto;margin-bottom: auto;" size="20px" name="arrow-left" />
        <div style="padding-left: 8px;margin-left: 15px;margin-top: 10px;flex: 1;background-color: rgb(245, 245, 245);height:30px;border-radius: 30px;">
            <input v-model="keyword" style=";border: 0;width: 100%;height: 100%;background-color: #ffffff00;" placeholder="输入关键字" />
        </div>

        <van-button @click="$emit('search',keyword)" round style="color: #fff;height: 25px; margin-top: 13px;
        margin-left: 15px;margin-right: 15px;background-color: var(--color-orange);"> 搜索</van-button>
    </van-row>
</div>


</template>

<style lang="less">



</style>