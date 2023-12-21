
<script setup lang="ts">

import { OrderModel } from '@/store/modules/orderModel';
import { ShopcarModel } from '@/store/modules/shopcar';
import { DateTool } from '@/util/date_tool';
import { showConfirmDialog, showToast } from 'vant';
import { watch } from 'vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter()
const route = useRoute()

const topitemList = ["全部", "待付款", "待发货", "已发货", "已完成"]

const active = ref(0);

const orderList = ref<Array<OrderModel>>([])

loadQueny()
function loadQueny() {
    var state = route.query.state
    if (state == undefined) {
        active.value = 0
    } else {
        active.value = parseInt(state.toString())
    }
    loadOrderList()
}

function loadOrderList() {
    const list = OrderModel.getOrderList(active.value)
    orderList.value = list
}

function clickTabItemAction() {
    loadOrderList()
}

function getState(model: OrderModel): String {
    var str = ""
    switch (model.state) {
        case 0:
            str = "待付款"
            break
        case 1:
            str = "待发货"
            break
        case 2:
            str = "待收货"
            break
        case 3:
            if (model.content.length == 0) {
                str = "待评论"
            } else {
                str = "已完成"
            }
            break
    }

    return str
}

function getItemImage(model: OrderModel): Array<string> {
    var data: Array<ShopcarModel> = JSON.parse(model.goods.toString())
    var list: Array<string> = []
    for (let index = 0; index < 3; index++) {
        if (data.length > index) {
            list.push(data[index].goodsImg.toString())
        }
    }
    return list
}

function getMenuItem(model: OrderModel): Array<string> {
    var list: Array<string> = []
    switch (model.state) {
        case 0:
            list = ["取消订单", "去支付"]
            break
        case 1:
            list = ["催发货", "发货"]
            break
        case 2:
            list = ["查看物流", "确认收货"]
            break
        case 3:
            if (model.content.length == 0) {
                list = ["删除订单", "评论"]
            } else {
                list = ["删除订单"]
            }
            break
    }
    return list
}

function clickMenuAction(title: string, model: OrderModel) {
    selectOrderModel = model
    if (title == "去支付") {
        showPwd.value = true
    }
    if (title == "发货") {
        showEms.value = true
    }
    if (title == "确认收货") {
        showConfirmDialog({
            title: '确认收货',
            message:
                '是否确定已经收到货品？',
        })
            .then(() => {
                selectOrderModel!.state = 3
                selectOrderModel!.endTime = DateTool.newDate()
                OrderModel.updateModel(selectOrderModel!)
                showToast("确认收货成功")
            })
            .catch(() => {
                // on cancel
            });


    }
    if (title == "评论") {
        showContent.value = true
    }
    if (title == "删除订单") {
      OrderModel.deleteModel(model)
      loadOrderList()
    }
}

function clickOrderDetail(model:OrderModel) {
    router.push({path:"/order/orderDetail",query:{id:model.id}})



}


var selectOrderModel: OrderModel | undefined
/**
 *  password
 */
const showPwd = ref(false)
const passwordValue = ref<string>('');
function closeAction() {
    showPwd.value = false
    passwordValue.value = ""
    showToast("支付失败")
}

watch(passwordValue, (newVal) => {
    if (newVal.length === 6) {
        ensureAction()
    }
});

function ensureAction() {
    showPwd.value = false
    passwordValue.value = ""
    selectOrderModel!.state = 1
    selectOrderModel!.payTime = DateTool.newDate()
    OrderModel.updateModel(selectOrderModel!)
    showToast("支付成功")
}
/**
 * 发货
 */
const showEms = ref(false)
const emsValue = ref<string>('');
function ensreEmsAction() {
    selectOrderModel!.state = 2
    selectOrderModel!.expressNumber = emsValue.value
    selectOrderModel!.expressTime = DateTool.newDate()
    OrderModel.updateModel(selectOrderModel!)
    showToast("发货成功")
}
/**
 * 发布评论
 */
 const showContent = ref(false)
const contentValue = ref<string>('');
function ensureContentAction() {
    selectOrderModel!.content = contentValue.value
    OrderModel.updateModel(selectOrderModel!)
    showToast("评论成功")
}

</script>

<template>
    <van-nav-bar left-arrow @click-left="router.back" style="position: fixed;width:min(100%,480px);top: 0;"
        title="我的订单"></van-nav-bar>
    <div class="top-menu">
        <van-tabs v-model:active="active" @click-tab="clickTabItemAction">
            <van-tab v-for="title in topitemList" :title="title"></van-tab>
        </van-tabs>
    </div>

    <van-list class="list">
        <van-empty v-show="orderList.length == 0" description="暂无数据" />

        <van-col @click="clickOrderDetail(model)" style="padding: 8px;" class="list-item" v-for="model in orderList">
            <van-row justify="space-between">
                <div>自营</div>
                <div style="color: gray;">{{ getState(model) }}</div>
            </van-row>

            <van-row style="padding-top: 5px;" justify="space-between">
                <van-row>
                    <van-image radius="5px" style="width: 80px;height: 80px;margin-left: 5px;"
                        v-for=" img in getItemImage(model)" :src="img"></van-image>
                </van-row>
                <van-col style="display: flex; justify-content: center;align-items: center;">
                    <van-col>
                        <div style="color: red;">¥{{ model.orderPrice }}</div>
                        <div style="color: gray;">共3件</div>
                    </van-col>
                </van-col>
            </van-row>

            <van-row justify="end">

                <van-button @click.stop="clickMenuAction(info, model)" style="height: 28px;margin-right: 5px;font-size: 12px;"
                    round type="default" v-for="info in getMenuItem(model)">
                    {{ info }}
                </van-button>

            </van-row>

        </van-col>


    </van-list>

    <!--  password   -->
    <van-popup position="bottom" v-model:show="showPwd">
        <div style="color: black;text-align: center;margin-top: 15px;font-weight: bold;font-size: 20px;">输入密码</div>
        <van-password-input style="margin-bottom: 8px;margin-top: 15px;" :value="passwordValue" :focused="showPwd"
            @focus="true" />
        <van-number-keyboard style="position: relative;" v-model="passwordValue" :show="showPwd" @blur="closeAction" />
    </van-popup>

    <!-- 发货 -->
    <van-dialog v-model:show="showEms" title="输入快递单号" show-cancel-button @confirm="ensreEmsAction">
        <van-field style="text-align: center;" v-model="emsValue" placeholder="请输入快递单号" input-align="center" />
    </van-dialog>

     <!-- 发评论 -->
     <van-dialog v-model:show="showContent" title="输入评论" show-cancel-button @confirm="ensureContentAction">
        <van-field style="text-align: center;" v-model="contentValue" placeholder="请输入商品评论" input-align="center" />
    </van-dialog>
</template>

<style scoped lang="less">
.top-menu {
    position: fixed;
    width: min(100%, 480px);
    top: var(--van-nav-bar-height);
    height: var(--van-tabs-line-height);
    background-color: white;
    width: 100vw;
    z-index: 999;
}

.list {
    padding-top: calc(var(--van-nav-bar-height) + var(--van-tabs-line-height));
}

.list-item {
    margin-top: 5px;
    width: 100%;
    background-color: white;
}
</style>