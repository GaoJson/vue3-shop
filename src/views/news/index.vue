<script setup lang="ts">

import useShopCarStore, { ShopcarModel } from '@/store/modules/shopcar';
import { showToast } from 'vant';
import { onMounted } from 'vue';

import { ref } from 'vue';
import { onActivated } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const editText = ref("编辑")
const editFlag = ref(false)

const selelctAll = ref(false)

const allPrice = ref("0.0")

const list = ref<Array<ShopcarModel>>([]);;


function toDouble(value: string): any {

    return parseFloat(value);
}

onActivated(() => {
    list.value = useShopCarStore().getShopcar()
    countPriceAction()
})

onMounted(() => {
    list.value = useShopCarStore().getShopcar()
    countPriceAction()
})

function rightAction() {
    if (editText.value == "完成") {
        editFlag.value = false
        editText.value = "编辑"
    } else {
        editFlag.value = true
        editText.value = "完成"
    }
}

function selectItem(model: ShopcarModel) {
    useShopCarStore().updateShopcar(model)
    countPriceAction()
}
function countChange(model: ShopcarModel) {
    useShopCarStore().updateShopcar(model)
    countPriceAction()
}

function selectAllAction() {
    list.value.forEach(element => {
        element.selectFlag = selelctAll.value
        useShopCarStore().updateShopcar(element)
    });
    countPriceAction()
}

function countPriceAction() {
    var prices = 0
    list.value.forEach(element => {
        if (element.selectFlag == true) {
            prices += parseFloat(element.goodsPrice.toString()) * element.count
        }
    });
    allPrice.value = prices.toFixed(2)
}

function deleteAction(){
    list.value.forEach(element => {
        if (element.selectFlag == true) {
            useShopCarStore().deleteShopcar(element)
        }
    });
    list.value = useShopCarStore().getShopcar()
    countPriceAction()
}

function gotoPay() {
    var str = new String("");
    var index = 0
    list.value.forEach(element => {
        if (element.selectFlag == true) {
            str = str.concat(`${index?"-":""}${element.id.toString()}`)
            index ++
        }
    });
    if (index == 0) {
        showToast("请选择商品")
    } else {
        router.push({path:"/order/shopOrder",query:{data:str.toString()}})
    }
   
}

</script>

<template>
    <van-nav-bar style="position: fixed;width:min(100%,480px);" title="购物车" :right-text="editText"
        @click-right="rightAction"></van-nav-bar>

    <van-list style="padding-top: var(--van-nav-bar-height);padding-bottom: var(--van-tabbar-height);">
        <van-empty v-show="list.length == 0" description="暂无数据" />
        <van-col v-for="model in list">
            <van-row style="padding: 5px;background-color: white;margin-top: 1px;">
                <div style="width: 5px;"></div>
                <van-checkbox v-model="model.selectFlag" v-on:click="selectItem(model)"> </van-checkbox>
                <div style="width: 8px;"></div>
                <van-image style="width: 80px;height: 80px;" :src="model.goodsImg.toString()" />
                <div style="width: 8px;"></div>
                <van-col style="flex: 1;">
                    <div class="one-line" style="font-size: 12px;">{{ model.goodsName }}</div>
                    <div class="one-line" style="font-size: 11px;color:gray;">{{ model.spec }}</div>
                    <div style="height: 10px;"></div>

                    <van-row justify="space-between">
                        <div style="color: red;">¥{{ toDouble(model.goodsPrice.toString()) }}</div>
                        <van-stepper v-model="model.count" min="1" v-on:change="countChange(model)" />
                    </van-row>

                </van-col>



            </van-row>

        </van-col>


    </van-list>

    <div
        style="margin-bottom: var(--van-tabbar-height);height: 40px;background-color: white;color: black;position: fixed;width:min(100%,480px);bottom: 0px;">
        <van-row justify="space-between">
            <van-row>
                <van-checkbox v-on:click="selectAllAction" style="margin-top: 10px;margin-left: 5px;" v-model="selelctAll">全选</van-checkbox>
                <div style="font-size: 12px;margin-left: 10px;margin-top: 15px;color: gray;">合计:</div>
                <div style="font-size: 12px;margin-left: 3px;margin-top: 15px;color: red;">¥</div>
                <div style="font-size: 15px;margin-left: 3px;margin-top: 12px;color: red;">{{ allPrice }}</div>
            </van-row>

            <van-row>
                <van-button @click="gotoPay" v-if="!editFlag" style="height: 30px;background-color: red;color: white;margin-top: 5px;margin-right: 10px;" round>去结算(0)</van-button>
                <van-button @click="deleteAction" v-if="editFlag" style="height: 30px;background-color: orange;color: white;margin-top: 5px;margin-right: 10px;" round>删除</van-button>
            </van-row>

        </van-row>





    </div>

    <tabbar />
</template>

<style scoped lang="less">
.one-line {
    overflow: hidden;
    text-overflow: unset;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
</style>