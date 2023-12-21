
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { createRequest } from "@/util/request/request";
import { onMounted } from 'vue';
import { ref } from 'vue';
import { watch } from 'vue';
import useShopCarStore, { ShopcarModel } from '@/store/modules/shopcar';
import { showToast } from 'vant';
const route = useRoute();
const router = useRouter();

const modelHeight = ref('0px');
const showModal = ref(false);
const goodsCount = ref(1);

onMounted(() => {
    loadData();
    getPageSize();
})

function getPageSize() {
    let pageHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    modelHeight.value = (pageHeight - 50) + "px";
}

const bannerList = ref<Recordable>([]);
const goodsContent = ref("");
const goodsDetail = ref<Recordable>({});

watch(goodsCount,(newValue)=>{
    if(newValue <= 0) {
        goodsCount.value = 1;
    }
});


// net
function loadData() {
    createRequest("goods/v1/" + route.query.id, "get", {}).then((res) => {
        console.log(res);
        
        goodsDetail.value = res.data;
         var spec:Array<Recordable> = res.data.specVos
        goodsDetail.value.goodsPrice = spec[0].goodsPrice
        goodsDetail.value.originalPrice = spec[0].oriPrice
        goodsDetail.value.spec = spec[0].spec
        var banner: string = res.data.goodsBanner;
        bannerList.value = banner.split(",");
        goodsContent.value = res.data.goodsContent;
        goodsContent.value = "<!DOCTYPE html>\
                        <html lang='en'> \
                         <head>\
                            <style> img{  width: 100%} </style>\
                         <meta charset='UTF-8'>\
                        <meta name='viewport' content='width=device-width, initial-scale=1.0'>\
                        </head>\
                        <body>"+ res.data.goodsContent + "</body></html>";

    });
}

function buyAction() {
    if (showModal.value == false) {
        showModal.value = true;
        return;
    }
}

function addShopcar() {
    
  useShopCarStore().saveShopcar(ShopcarModel.toData(goodsDetail.value))
  showToast("添加成功")
}

</script>


<template>
    <div class="container">
        <van-swipe autoplay="3000">
            <van-swipe-item v-for="item in bannerList">
                <van-image :src="item" style="height: 240px;width: 100%;" fit="cover" />
            </van-swipe-item>
        </van-swipe>

        <van-row style="margin-top: 5px;margin-left: 10px;">
            <div style="color: rgb(250, 127, 39);">¥{{ parseFloat(goodsDetail.goodsPrice) }} </div>
            <div style="color: gray;margin-left: 5px;text-decoration: line-through;">¥{{
                parseFloat(goodsDetail.originalPrice) }}</div>
            <div
                style="padding: 3px 8px 3px 8px;margin-left: 8px;background-color: #000;color:white;font-size: 12px;font-weight: 400;">
                贡献值</div>
            <div
                style="padding: 3px 8px 3px 8px; background: linear-gradient(#F5CB81, #FBE8B9); color: #000;font-size: 12px;font-weight: 400;">
                {{ parseFloat(goodsDetail.contributeValue) }}</div>
        </van-row>

        <div style="margin-left: 10px;margin-bottom: 5px;margin-top: 5px;">{{ goodsDetail.goodsName }}</div>

        <van-row style="padding-left: 8px;padding-right: 8px;" justify="space-between">
            <div style="color: gray;font-size: 10px;">销售量:{{ goodsDetail.saleCount }}</div>
            <div style="color: grey; font-size: 10px;">浏览量:{{ goodsDetail.pageView }}</div>
        </van-row>

        <hr>

        <div style="padding: 8px 0 8px 8px;color: gray;">
            该商品不发货地区及偏远地区运费
        </div>
        <hr>

        <van-row style="padding: 8px 0 8px 8px" justify="space-between" @click="showModal=true">
            <van-row>
                <div style="color: gray;">规格</div>
                <div style="margin-left: 8px;">{{ goodsDetail.spec }}</div>
            </van-row>
            <van-icon style="margin-top: auto;margin-bottom: auto;" name="arrow"></van-icon>
        </van-row>
        <hr>
        <van-col>
            <van-row style="padding-top: 8px;padding-bottom: 8px;" justify="space-between">
                <van-row style="">
                    <div style="margin-left: 8px;">用户好评</div>
                    <div
                        style="margin-left: 5px;color: rgb(254, 129, 39);font-size: 10px;margin-top: auto;margin-bottom: auto;">
                        好评率{{ goodsDetail.goodsCommentRating }}%</div>
                </van-row>

                <van-row style="margin-top: auto;margin-bottom: auto;">
                    <div style="margin-right: 8px;color: gray;font-size: 10px;">查看全部</div>
                    <van-icon name="arrow"></van-icon>
                </van-row>
            </van-row>

            <div style="text-align: center;padding-bottom: 15px;" v-show="true">
                暂无评论
            </div>

        </van-col>

        <hr>
        <div style="padding: 8px 0 8px 0;width: 100%;text-align: center;">商品详情</div>

        <div class="goods-content" v-html="goodsContent"></div>

    </div>
    <van-icon @click="router.go(-1)"
        style="border-radius: 10px;padding: 3px;top: 20px;left: 20px; position:fixed;color: white;background-color: rgba(0, 0, 0, 0.47);"
        name="arrow-left"></van-icon>

    <div>
        <van-overlay :style="{ height: modelHeight }" :show="showModal" @click="showModal = false">
            <div class="spac" @click.stop>
                <van-row @click="showModal = false" type="flex" justify="end">
                    <van-icon style="padding-right: 10px;padding-top: 5px;" name="cross" size="20px" />
                </van-row>
                <van-row style="padding-left: 10px;">
                    <van-image style="width: 60px;" :src="goodsDetail.goodsImg" />
                    <van-col>
                        <van-row>
                            <div style="color: var(--color-orange);margin-left: 5px;">
                                ${{ parseFloat(goodsDetail.goodsPrice) }}
                            </div>
                            <div
                                style="padding: 3px 8px 3px 8px;margin-left: 8px;background-color: #000;color:white;font-size: 12px;font-weight: 400;">
                                贡献值</div>
                            <div
                                style="padding: 3px 8px 3px 8px; background: linear-gradient(#F5CB81, #FBE8B9); color: #000;font-size: 12px;font-weight: 400;">
                                {{ parseFloat(goodsDetail.contributeValue) }}</div>
                        </van-row>
                        <div style="color: gray;margin-left: 5px;font-size: 12px;margin-top: 3px;">
                            已选{{ goodsDetail.spec }} 数量{{goodsCount}}件
                        </div>
                    </van-col>



                </van-row>
                <div style="font-weight: 800;margin-top: 10px;margin-left: 10px;">规格</div>

            <van-button round style="margin-left: 10px;margin-bottom: 15px;color: #ff6200;height: 25px;border-color: #ff6200;background-color: #f9debc;">
                {{ goodsDetail.spec }}
            </van-button>

            <van-row style="margin-bottom: 40px;margin-left: 10px;" justify="space-between">
                <van-row style="margin-top: auto;margin-bottom: auto;">
                    <div style="font-weight: 800;font-size: 13px;">数量 </div>
                    <div style="font-size: 10px;"> (库存：999)</div>
                </van-row>

                <van-row style="">
                    <van-stepper integer v-model="goodsCount" min="1" max="99" />
                </van-row>
            </van-row>
            </div>
        </van-overlay>
    </div>

    <!-- 底部购买 -->
    <div class="buttonBuy">
        <van-row>

            <van-col style="margin: auto;margin-left: 10px;text-align: center;margin-top: 5px;">
                <van-icon style="margin: auto;padding: 0;" size="20px" name="service-o" />
                <div style="font-size: 10px;padding: 0;">客服</div>
            </van-col>

            <van-col @click="addShopcar" style="margin: auto;margin-left: 10px;text-align: center;margin-top: 5px;">
                <van-icon style="margin: auto;padding: 0;" size="20px" name="shopping-cart-o" />
                <div style="font-size: 10px;padding: 0;">加入购物车</div>
            </van-col>

            <van-button @click="buyAction"
                style="flex: 1; background-color: var(--color-orange);color:#fff;;height: 40px;margin-top: 5px;margin-right: 10px;border-radius: 40px;margin-left: 20px;">
                立即购买

            </van-button>

        </van-row>

    </div>
</template>


<style lang="less" scoped>
.container {
    width: 100%;
    height: --color-bg-2;
    margin-bottom: 45px;

}


.spac {
    position: absolute;
    background-color: #fff;
    width: 100%;
    bottom: 0;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;


}

.buttonBuy {
    background-color: #fff;
    width: 100%;
    height: 50px;
    position: fixed;
    bottom: 0;
}

.goods-content {
    box-sizing: border-box;
    background: var(--color-bg-2);
    overflow: hidden;
    width: 100svw;
    color: var(--color-text-1);
    font-size: 16px;
    line-height: 0;
    text-align: left;
    word-wrap: break-word;
}

hr {
    border: none;
    width: 100%;
    height: 5px;
    background-color: #f8f8f8;
}
</style>