
<script lang="ts">
export default {
  name:"GoodSearch"
}
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import API_GOODS from "@/apis/goods";

const router = useRouter();

const goodVos = ref<Recordable>([]);
var page = 1;


const isLoading = ref(false);
const loading = ref(false);
const finished = ref(false);
var keyword = '';

function getGoods() {
  var params = {
    "pageNum": page,
    "pageSize": 8,
    'goodsName': keyword
  }
  API_GOODS.searchGoods(params).then((res: { data: { rows: string | any[]; total: number; }; }) => {
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

function onRefresh() {
  page = 1;
  getGoods();
}

function onLoad() {
if (keyword.length == 0) {
  return;
}

  if (loading.value == true) {
    return;
  }
  loading.value = true;
  page += 1;
  getGoods();
}

function searchKeyword(data: string) {
  keyword = data;
  page = 1;
  onRefresh();
}

function goodDetail(id: any) {
  router.push({ path: '/goods/detail', query: { id } })
}

</script>



<template>
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
  <Search @search="searchKeyword" />
</template>

<style  lang="less" scoped>
.container {
  width: 100%;
  height: 100vh;
  margin-top: 100px;
  background-color: rgb(243, 243, 243);
}
</style>@/apis/account