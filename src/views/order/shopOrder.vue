<script setup lang="ts">
import { AddressModel } from '@/store/modules/address';
import useShopCarStore, { ShopcarModel } from '@/store/modules/shopcar';
import { OrderModel } from '@/store/modules/orderModel'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { DateTool } from '@/util/date_tool';
import { watch } from 'vue';
import { showToast } from 'vant';

const router = useRouter()
const route = useRoute()

var titleList = ["商品价格","退换货免运费","运费","优惠卷"]
const valueList = ref<Array<String>>([])
const allprice = ref("")

const shopList = ref<Array<ShopcarModel>>([])
function loadGoodData() {
    var ids = route.query.data?.toString()
    const list = ids?.split("-")
    const goodList = useShopCarStore().getShopcarbyId(list!)
    shopList.value = goodList
    var price = 0.0
    goodList.forEach(element => {
        price += element.count * parseFloat(element.goodsPrice.toString())
    });

   allprice.value = price.toFixed(2)
   valueList.value = ["¥"+allprice.value,"0.0","0.0","0.0"]   
}   
loadGoodData() 


const addressModel = ref<AddressModel>()
function loadAddress() {
    const list = AddressModel.getList()
    var defaultAddress: AddressModel | undefined
    list.forEach(element => {
        if (element.isDefault) {
            defaultAddress = element
        }
    });
    if (defaultAddress == undefined) {
       if(list.length > 0){
         defaultAddress = list[0]
       }
    }
    addressModel.value = defaultAddress
}
loadAddress()

function gotoAddress(){
    router.push({path:"/user/addressList"})
}

var orderModels:OrderModel | undefined

function showPassword() {
    var model = new OrderModel()
    model.createTime = DateTool.newDate()
    model.address = addressModel.value?.name + " " +addressModel.value?.tel + "  " + addressModel.value?.address
    model.orderPrice = allprice.value
    model.goods = JSON.stringify(shopList.value)
    orderModels = OrderModel.saveModel(model)

    shopList.value.forEach(element => {
        useShopCarStore().deleteShopcar(element)
    });

    showPwd.value = true
}


const showPwd = ref(false)

const passwordValue = ref<string>('');

function closeAction() {
    showPwd.value = false
    showToast("支付失败")
    router.go(-1)
}

watch(passwordValue,(newVal)=>{
    if (newVal.length === 6) {
            ensureAction()
      }
});

function ensureAction(){
    orderModels!.state = 1
    orderModels!.payTime = DateTool.newDate()
    OrderModel.updateModel(orderModels!)
    showToast("支付成功")
    router.go(-1)
}

</script>


<template>
    <van-nav-bar left-arrow @click-left="router.back" style="position: fixed;width:min(100%,480px);" title="订单结算"></van-nav-bar>
    <van-list style="padding-top: var(--van-nav-bar-height);padding-bottom: var(--van-tabbar-height);">
        <div style="height: 5px;"></div>
        <div class="address" >
            <van-row style="height: 100%;" justify="space-between">
                <van-col style="margin-left: 8px;padding-top: 16px;">
                    <div style="font-size: 15px;font-weight: bold;">
                        {{addressModel?.name}}   &nbsp;&nbsp;  {{addressModel?.tel}}
                    </div>
                    <div >
                        {{addressModel?.addressDetail}}
                    </div>
                </van-col>
                <van-col style="display: flex; justify-content: center;align-items: center;margin-right: 8px;">
                    <van-icon  name="arrow" size="20px"></van-icon>
                </van-col>

            </van-row>
            <div v-if="addressModel?.id==undefined" @click.stop="gotoAddress" style="position: absolute;width: 100%;
            height: 100%;background-color: white;top: 0px;left: 0px;">
            <div style="line-height: 80px;text-align:center;">暂无地址，去添加</div>
        </div>
        </div>
        <div style="height: 5px;"></div>
        <div v-for="idx in shopList">
            <van-card style="background-color: white;"
            :num="idx.count"
            :price="idx.goodsPrice.toString()"
            :desc="idx.spec.toString()"
            :title="idx.goodsName.toString()"
            :thumb="idx.goodsImg.toString()"
                />
        </div>
        <div style="margin-top: 5px;background-color: white;padding-left: 10px;
        padding-right: 10px;padding-top: 10px;padding-bottom: 5px;">
            <van-row justify="space-between" v-for="(model,index) in valueList">
                <div>{{ titleList[index] }}</div>
                <div style="font-weight: 600;">{{ model }}</div>
            </van-row>
            <van-divider style="background-color: rgb(243, 243, 243);margin-top: 5px;margin-bottom: 5px;"/>

            <van-row justify="end" style="align-items: center;">
                <div style="color: gray;font-size: 12px;line-height: 25px;">总计：</div>
                <div style="color: red;font-size: 15px;line-height: 25px;">¥{{allprice}}</div>

            </van-row>

        </div>
    </van-list>


    <div  class="bottom">
        <van-divider style="background-color: rgb(243, 243, 243);margin:0px"/>
        <van-row justify="end">
            <van-button @click="showPassword" style="height: 30px;background-color: red;
        color: white;margin-top: 5px;margin-right: 10px;" round>去结算</van-button>
        </van-row>
    </div>


    <van-popup position="bottom" v-model:show="showPwd">
        <div style="color: black;text-align: center;margin-top: 15px;font-weight: bold;font-size: 20px;">输入密码</div>
        <van-password-input style="margin-bottom: 8px;margin-top: 15px;"
         :value="passwordValue"
         :focused="showPwd"
         @focus="true"
         
        />
        <van-number-keyboard style="position: relative;"
         v-model="passwordValue"
        :show="showPwd"
         @blur="closeAction"/>
    </van-popup>

  

</template>

<style scoped lang="less">

.bottom {
    bottom: 0px;
    position: fixed;
    width:min(100%,480px);
    background-color: white;
    height: 40px;

}

.address {
    position: relative;
    height: 80px;
    width: 100%;
    background-color: white;

}


</style>