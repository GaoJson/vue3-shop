
<script lang="ts">
export default {
  name: "GoodSort",
}
</script>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import API_GOODS from "@/apis/goods";

const route = useRoute();
const router = useRouter();

const sortVos = ref<Recordable>([]);
const currectIndex = ref(parseInt(route.query.index as string));
var sortArray = JSON.parse(route.query.data as string);
sortVos.value = sortArray;


var page = 1;
const isLoading = ref(false);
const loading = ref(false);
const finished = ref(false);
const goodVos = ref<Recordable>([]);


onMounted(() => {
 loadData();
}
)

function loadData() {
  var params = {
    'pageSize':8,
    'pageNum':page,
    'goodsCid':sortArray[currectIndex.value].id
  }

  API_GOODS.searchGoods(params).then((res: { data: { rows: string | any[]; total: number; }; })=>{
    console.log(res);
    if (page == 1) {
      goodVos.value = [];
    }
    for (let idx = 0; idx < res.data.rows.length; idx++) {
      goodVos.value.push(res.data.rows[idx]);
    }
    if (goodVos.value.length >= res.data.total) {
      finished.value = true;
    } else {
      finished.value = false;
    }
    isLoading.value = false;
    loading.value = false;
  });
}

 function onLoad() {
  if (loading.value == true) {
    return;
  }
  loading.value = true;
   page += 1;
   loadData();
 }

function onRefresh() {
  page = 1;
  loadData();
}

function tabbarClick(){
   page = 1;
   loadData();
}

function searchGoods() {
  router.push({ path: '/goods/search' })
}

function goodDetail(id: any) {
  router.push({ path: '/goods/detail', query: { id } })
}

</script>



<template>
  <div style="width: 100%;;z-index: 999;height: 50px;padding-top: 10px;
  position: fixed;background-color: white;">
    <van-row>
      <van-icon @click="router.back" style="padding-left: 8px;margin-top: auto;margin-bottom: auto;" size="20px"
        name="arrow-left" />
      <div @click="searchGoods()"
        style="flex: 1; padding-left: 10px;padding-top: 5px;margin-left: 10px;margin-right: 10px;height: 30px;background-color: rgb(235, 235, 235);border-radius: 40px;">
        <van-row>
          <van-icon name="search" size="20px" color="rgb(197, 197, 197)" />
          <div style="margin-left: 5px;height: 20px; color:rgb(197, 197, 197);font-size: 14px;">请输入商品关键字</div>
        </van-row>

      </div>
    </van-row>
  </div>

  <van-tabs style="z-index: 999;position: fixed;top:50px" v-model:active="currectIndex" @click="tabbarClick">
      <van-tab  v-for="item in sortVos" :title="item.name">
      </van-tab>
    </van-tabs>

  <div class="container">
    <van-pull-refresh style="width: 100%;min-height: 100%;" v-model="isLoading" @refresh="onRefresh" loading-text="加载中中"
      success-text="刷新成功">

      <van-list v-model="loading" 
       :finished="finished"
       loading-text="加载中" 
       finished-text="没有更多了" 
       :immediate-check="false"
        offset="300" @load="onLoad">
        <div class="van-clearfix">
          <van-row>
            <van-col span="12" style="height: 320px;padding-left: 5px;padding-right: 5px;" v-for="item in goodVos">
              <div style="background-color:#fff;border-radius: 10px;height: 100%;" @click="goodDetail(item.id)">
                <van-image style="width: 100%;height: 200px;" :src="item.goodsImg" />
                <div
                  style="font-size: 12px;overflow: hidden; text-overflow:unset;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">
                  {{ item.goodsName }}</div>
                <van-row justify="space-between">
                  <div style="color: #fa732b;padding-left: 7px;font-size: 14px;">¥{{ parseFloat(item.goodsPrice) }}</div>

                  <div style="color: gray;font-size: 10px;padding-right: 5px;">{{ item.saleCount }}人已付款</div>
                </van-row>

                <van-row style="padding-left: 10px;margin-top: 10px;">
                  <div
                    style="padding: 3px 8px 3px 8px;background-color: #000;color:white;font-size: 12px;font-weight: 400;">
                    贡献值</div>
                  <div
                    style="padding: 3px 8px 3px 8px;background: linear-gradient(#F5CB81, #FBE8B9); color: #000;font-size: 12px;font-weight: 400;">
                    {{ parseFloat(item.contributeValue) }}</div>
                </van-row>
              </div>
            </van-col>
          </van-row>
        </div>
      </van-list>
    </van-pull-refresh>

  </div>
</template>

<style scoped lang="less">
.container {
  padding-top: 100px;
  width: 100%;
  min-height: 100vh;
  background-color: #f8f8f8;
}
</style>@/apis/account