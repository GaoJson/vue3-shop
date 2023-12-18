

<script lang="ts">
  export default {
    name:"Home"
  }

</script>

<script setup lang="ts">
import { getAssetsUrl } from "@/util/asset_path";
import { ref, onMounted } from "vue";
import { createRequest } from "@/util/request/request";
import { useRouter } from "vue-router";
import { uploadProduct } from "@/util/upload_product";
import useShopCarStore from "@/store/modules/shopcar";
import { showToast } from "vant";

const iconList = ref<Recordable>([]);

const noticeList = ref<Recordable>([]);

const topBannerVos = ref<Recordable>([]);

const midBannerVos = ref<Recordable>([]);

const hotGoodVos = ref<Recordable>([]);

const GoodVos = ref<Recordable>([]);

var page = 1;
const isLoading = ref(true);
const loading = ref(false);
const finished = ref(false);
var isLoadData = false;
var goodsCategory = <Recordable>[];



onMounted(() => {
  getHomeData();
  getGoodsData();

})

function getHomeData() {
  createRequest("goods/v1/main","get", {}).then((res) => {
    console.log(res);
    isLoading.value = false;
    var categoryList: any[] = res.data.tgoodsCategoryVos;
    goodsCategory = res.data.tgoodsCategoryVos;
    var total = categoryList.length;
    if (total % 8 == 0) {
      total = Math.floor(total / 8);
    } else {
      total = Math.floor(total / 8) + 1;
    }
    var caList = [] as any[];
    for (let idx = 0; idx < total; idx++) {
      var model = [] as any[];
      var end = (idx + 1) * 8;
      if (end > categoryList.length) {
        end = categoryList.length - idx * 8;
      }
      for (let index = 0; index < end; index++) {
        var data = categoryList[index];
        model.push(data)
      }
      caList.push(model);
    }
    iconList.value = caList;


    var noticeData = res.data.shopNoticeVos;
    var caList = [] as any[];
    for (let idx = 0; idx < noticeData.length; idx++) {
      caList.push(noticeData[idx]);
      caList.push(noticeData[idx]);
      caList.push(noticeData[idx]);
    }

    midBannerVos.value = res.data.midBannerVos;

    topBannerVos.value = res.data.topBannerVos;

    noticeList.value = caList;

    hotGoodVos.value = res.data.hotGoodsVo;
  });
}

function getGoodsData() {
  var param = {
    "pageNum":page,
    "pageSize":4
  }
 createRequest("goods/v1/good","post",param).then((res)=>{
  console.log(res);
  uploadProduct(res);
  var noticeData = res.data.rows;
  if (page == 1) {
    GoodVos.value = [];
  }
  for (let idx = 0; idx < noticeData.length; idx++) {
      GoodVos.value.push(noticeData[idx]);
    }
    if (GoodVos.value.length >= res.data.total) {
      finished.value = true;
    } else {
      finished.value = false;
    }
    isLoadData = false;
});
}

function toDouble(value:string):any{

return parseFloat(value);
}

function onLoad(){  
  if (isLoadData == true) {
      return;
  }
  isLoadData = true;
  page++;
  getGoodsData();
}

function onRefresh() {
  getHomeData();
  page = 1;
  getGoodsData();
}

const router = useRouter();

function goodDetail(id: any){
  router.push({path:'goods/detail',query:{id}})
}

function searchGoods(){
  router.push({path:'goods/search'})
}
function goodsSort(id: any) {
  var params: any = [];
  var idx = 0;
  for (let index = 0; index < goodsCategory.length; index++) {
    var data:any = goodsCategory[index];
    if (data.id == id) {
      idx = index;
    }
    params.push({
      'id':data.id,
      'name':data.cname
    });
  }
  router.push({path:'goods/sort',query:{"data":JSON.stringify(params),"index":idx}});
}

function addShopcar(item:Recordable) {
  useShopCarStore().saveShopcar(item)
  showToast("添加成功")
}

</script>


<template>
   <div class="container">
  <div  style="display:fixed;width:min(100%,480px);z-index: 999;;height: 75px;
  background: linear-gradient(90deg,#ff9603, #fbb67a);">

  <van-row>
    <div style="font-weight: bold;font-size: 20px; color: white;padding-left: 8px;margin-top: 5px;">悦海国际</div>
    <div style="padding-top: 8px;font-weight: bold;font-size: 13px; color: white;padding-left: 8px;margin-top: 5px;">海量商品用心精选</div>
  </van-row>

  <div @click="searchGoods()" style="padding-left: 10px;padding-top: 5px;margin-left: 10px;margin-right: 10px;height: 30px;background-color: white;border-radius: 40px;">
  
    <van-row>
      <van-icon name="search" size="20px" color="rgb(197, 197, 197)" />
      <div style="margin-left: 5px;height: 20px; color:rgb(197, 197, 197);font-size: 14px;">请输入商品关键字</div>
    </van-row>
    
  </div>
  </div>


  <van-pull-refresh style="margin-bottom: 50px;" v-model="isLoading" @refresh="onRefresh" loading-text="加载中" success-text="刷新成功">

   
      <van-swipe >
        <van-swipe-item v-for="item in topBannerVos">
          <van-image :src="item.coverImg" style="height: 200px;" fit="cover" />
        </van-swipe-item>
      </van-swipe>

      <van-swipe style="background-color: #fff;padding-top: 8px;" class="my-swipe" :loop="false" :show-indicators="false">
        <van-swipe-item class="item" v-for="idx in iconList">
          <div class="van-row">
            <div class="van-col van-col--6" v-for="item in idx" @click="goodsSort(item.id)">
              <div style="margin: bottom: 30px;">
                <div>
                  <img style="height: 40px;width: 40px;margin: top: 10px;bottom: 20.px; " :src="item.imgUrl" />
                </div>

                <label>{{ item.cname }}</label>
              </div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>


      <div style="background-color: #fff;padding-top: 10px;padding-bottom: 10px;" class="notice">
        <img class="center" style="width: 20px;height: 20px;" :src="getAssetsUrl('images/home/icon_home_gonggao.png')" />
        <img class="center" style="height: 15px;padding-left: 8px;"
          :src="getAssetsUrl('images/home/icon_hone_gongao_name.png')" />
        <div class="center"
          style="height: 15px;width: 1px; margin-left: 5px; background-color: #fa732b;display: inline-block;"> </div>
        <div class="center"
          style="margin-top: -3px;padding-left: 8px;padding-right: 8px;flex: 1;height: 20px;display: inline-block">
          <van-swipe autoplay="3000" :show-indicators="false" vertical style="height: 20px">
            <van-swipe-item v-for="item in noticeList">
              {{ item.noticeTitle }}
            </van-swipe-item>
          </van-swipe>
        </div>
        <van-icon class="center" name="arrow" />
      </div>

      <van-row style="height: 280px;margin-top: 15px;">
        <van-col span="13" style="border-radius: 10px;height: 100%;padding-left: 10px;padding-right: 10px;">
          <div style="background: linear-gradient(#f89a17, #fff);height:280px;border-radius: 15px;">
            <van-swipe autoplay="3000" style="padding-left: 0px;">
            <van-swipe-item v-for="item in midBannerVos">
              <van-image :src="item.coverImg" style="height: 240px;" fit="fill" />
            </van-swipe-item>
          </van-swipe>
          </div>

        </van-col>

        <van-col span="11" style="padding-right: 10px;">
          <van-col style="background-color: #fff; height: 50%;border-radius: 10px;">
            <label
              style="padding-top: 5px;margin-left: 8px;display: block;font-size: small;text-align: left;">地方特产</label>
            <label
              style="margin-left: 8px;margin-bottom: 5px;display: block;font-size: 8px;color: #fa732b;text-align: left ">折扣优惠</label>
            <van-row style="margin-top: 20px;" class="van-row--justify-space-around">
              <van-image style="width: 50%;height: 50px;" fit="contain"
                :src="getAssetsUrl('images/home/icon_home_demo_charge.png')" />
              <van-image style="width: 50%;height: 50px;" fit="contain"
                :src="getAssetsUrl('images/home/icon_home_demo_roupu.png')" />
            </van-row>
          </van-col>

          <van-col style="background-color: #fff; height: 50%;margin-top: 7px;border-radius: 10px;">
            <label
              style="padding-top: 5px;margin-left: 8px;display: block;font-size: small;text-align: left;">地方特产</label>
            <label
              style="margin-left: 8px;margin-bottom: 5px;display: block;font-size: 8px;color: #fa732b;text-align: left ">折扣优惠</label>
            <van-row style="margin-top: 20px;" class="van-row--justify-space-around">
              <van-image style="width: 50%;height: 50px;" fit="contain"
                :src="getAssetsUrl('images/home/icon_home_demo_maotai.png')" />
              <van-image style="width: 50%;height: 50px;" fit="contain"
                :src="getAssetsUrl('images/home/icon_home_demo_rouwan.png')" />
            </van-row>
          </van-col>
        </van-col>
      </van-row>

      <div style="margin-left: 10px;margin-right: 10px;background-color: #fff;">
        <van-row style="display: flex;margin-top: 15px;">
        <div class="center" style="flex: 1;height: 40px">
          <div style="height: 100%;width: 100%;color: #000;">
            <van-image  style="position: absolute;height: 40px;object-fit:cover;width: 80%;"
              :src="getAssetsUrl('images/home/icon_home_times.png')" />
            <van-row style="position: absolute;vertical-align: middle;">
              <van-image style="width: 22px;height: 29px;margin-top: 5px;margin-left: 5px;"
                :src="getAssetsUrl('images/home/icon_home_hot.png')" />
              <h3 style="color:white;font-weight: 600;font-size: 17px;margin-top: 7px;margin-left: 5px;">实时热销榜单</h3>
              <div
                style="background-color: #fff;margin-left: 5px;padding-top: 3px;height: 30px;margin-top: 5px;padding-left: 3px;padding-right:3px;border-radius: 5px;">
                24
              </div>
              <div style="color: #fff;margin-left: 5px;padding-top: 3px;font-size: 20px;font-weight: 600;">
                :
              </div>
              <div
                style="background-color: #fff;margin-left: 5px;padding-top: 3px;height: 30px;margin-top: 5px;padding-left: 3px;padding-right:3px;border-radius: 5px;">
                00
              </div>
              <div style="color: #fff;margin-left: 5px;padding-top: 3px;font-size: 20px;font-weight: 600;">
                :
              </div>
              <div
                style="background-color: #fff;margin-left: 5px;padding-top: 3px;height: 30px;margin-top: 5px;padding-left: 3px;padding-right:3px;border-radius: 5px;">
                00
              </div>



            </van-row>

          </div>
        </div>

        <h4 style=" text-align: center;margin-top: 10px;margin-right: 8px; ">更多 >></h4>


        </van-row>

        <van-row>
          <van-col style="padding-left: 5px;padding-right: 5px;margin-top: 10px;" class="van-col--6" v-for="item in hotGoodVos">
            <van-image :src="item.goodsImg" />
            <label style="color: black; font-size: small;overflow: hidden; text-overflow:unset;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;" >{{ item.goodsName }}</label>  
            <label style="color: #fa732b;font-size: small;">{{toDouble(item.goodsPrice)}}</label>
          </van-col>
        </van-row>

      </div>

      <van-row justify="center" style="margin-bottom: 10px;margin-top: 10px;">
        <van-image  style="width: 30vw;height: 8px;margin-top: 6px;" :src="getAssetsUrl('images/home/icon_home_jxsp_left.png')" />
        <div  style="color: #fa732b; margin-left: 10px;margin-right: 10px;">精选商品</div>
        <van-image  style="width: 30vw;height: 10px;margin-top: 6px;" :src="getAssetsUrl('images/home/icon_home_jxsp_right.png')" />
      </van-row>
      <van-list
      v-model="loading"
     :finished="finished"  
     loading-text="加载中" 
     finished-text="没有更多了"
     :immediate-check="false"
     offset="100"
      @load="onLoad">
       <div class="van-clearfix">
        <van-row>
          <van-col span="12" style="height: 320px;padding-left: 5px;padding-right: 5px;" v-for="item in GoodVos">
            <div style="background-color:#fff;border-radius: 10px;height: 100%;" @click="goodDetail(item.id)">
              <van-image style="width: 100%;height: 200px;" :src="item.goodsImg" />
              <div style="font-size: 12px;overflow: hidden; text-overflow:unset;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;"> {{ item.goodsName }}</div>
              <van-row justify="space-between">
                  <div style="color: #fa732b;padding-left: 7px;font-size: 14px;">¥{{toDouble(item.goodsPrice)}}</div>

                  <div style="color: gray;font-size: 10px;padding-right: 5px;">{{ item.saleCount }}人已付款</div>
              </van-row>  
                

              <van-row style="padding-left: 10px;margin-top: 10px;padding-right: 10px;" justify="space-between">
                  <van-row >
                  <div style="padding: 3px 8px 3px 8px;background-color: #000;color:white;font-size: 12px;font-weight: 400;">贡献值</div>
                  <div style="padding: 3px 8px 3px 8px;background: linear-gradient(#F5CB81, #FBE8B9); color: #000;font-size: 12px;font-weight: 400;">{{toDouble(item.contributeValue)}}</div>  
                  </van-row>
                
                  <img @click.stop="addShopcar(item)" style="width: 25px;height: 25px;" :src="getAssetsUrl('images/my/shopcats.png')">
              </van-row>
           
              
             

            </div>
        </van-col>    
        </van-row>
      </div>
        </van-list>
   
      
  </van-pull-refresh>

</div>

  <Tabbar />
</template>

<style lang="less"  scoped>
.container {
  background-color: rgb(243, 243, 243);

}

.swiper {
  width: 100%;
  height: 110px;
  margin-bottom: 10px;

  &-item {
    width: 100%;
    height: 100%;
  }
}

.van-col {
  padding-top: 0px;
  text-align: center;
  padding-bottom: 10px;
}

.notice {
  margin-top: 0px;
  padding-left: 10px;
  height: 40px;
  width: 100vw;
  display: flex;
  vertical-align: bottom;



  &-swipe-item {
    margin: auto;
    height: 20px;

  }

  .center {
    margin: auto;
  }


}</style>