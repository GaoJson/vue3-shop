
<script setup lang="ts">
import { OrderModel } from '@/store/modules/orderModel';
import useShopCarStore, { ShopcarModel } from '@/store/modules/shopcar';
import { DateTool } from '@/util/date_tool';
import { showConfirmDialog, showToast } from 'vant';
import { watch } from 'vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()

const goodList = ref<Array<ShopcarModel>>([])
var titleList = ["商品总价", "运费", "支付优惠", "实付款", "收货信息", "创建时间", "支付时间", "发货时间", "完成时间"]
const valueList = ref<Array<String>>([])
const orderModel = ref<OrderModel>()

function loadGoodData() {
    let orderId = route.query.id
    if (orderId == undefined) {
        showToast("商品不存在")
    } else {
        let model = OrderModel.getModel(parseInt(orderId.toString()))
        orderModel.value = model
        var data: Array<ShopcarModel> = JSON.parse(model.goods.toString())
        goodList.value = data

        var values: Array<String> = []
        values = ["¥" + model.orderPrice, "¥0.0", "¥0.0", "¥" + model.orderPrice, model.address, model.createTime, model.payTime, model.expressTime, model.endTime]
        valueList.value = values
    }
}
loadGoodData()

function getMenuItem(model: OrderModel | undefined): Array<string> {
    var list: Array<string> = []
    switch (model!.state) {
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
            if (model!.content.length == 0) {
                list = ["删除订单", "评论"]
            } else {
                list = ["删除订单"]
            }
            break
    }
    return list
}

function clickMenuAction(title: string, model: OrderModel | undefined) {
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
                loadGoodData()
            })
            .catch(() => {
                // on cancel
            });
    }
    if (title == "评论") {
        showContent.value = true
    }
    if (title == "删除订单") {
        OrderModel.deleteModel(model!)
        router.back()
    }
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
    loadGoodData()
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
    loadGoodData()
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
    loadGoodData()
}


function addShopcar(model: ShopcarModel) {
    useShopCarStore().saveShopcar(model)
    showToast("添加成功")
}

</script>


<template>
    <van-nav-bar left-arrow @click-left="router.back" style="position: fixed;width:min(100%,480px);top: 0px;"
        title="订单详情"></van-nav-bar>

  

    <van-list class="list">

        <van-steps style="margin-bottom: 5px;" :active="orderModel?.state">
        <van-step>待付款</van-step>
        <van-step>待发货</van-step>
        <van-step>已发货</van-step>
        <van-step>已完成</van-step>
         </van-steps>

        <div v-for="idx in goodList">
            <van-card style="background-color: white;" :num="idx.count" :price="idx.goodsPrice.toString()"
                :desc="idx.spec.toString()" :title="idx.goodsName.toString()" :thumb="idx.goodsImg.toString()">
                <template #footer>
                    <van-button @click="addShopcar(idx)" size="mini" round> 添加购物车 </van-button>
                    <van-button size="mini" round> 收藏商品 </van-button>
                </template>
            </van-card>
        </div>

        <van-col style="background-color: white;margin-top: 8px;padding: 8px;">
            <van-row style="padding-top: 5px;" v-for="(value, index) in valueList" justify="space-between">
                <div class="title">{{ titleList[index] }}</div>
                <div :style="{ color: index == 3 ? 'red' : 'gray', fontSize: index == 3 ? '18px' : '14px' }" class="values">{{ value }}</div>
            </van-row>
        </van-col>
    </van-list>

    <div class="bottom">
        <van-divider style="background-color: rgb(243, 243, 243);margin:0px" />
        <van-row style="padding-top: 5px;" justify="end">
            <van-button @click.stop="clickMenuAction(info, orderModel)"
                style="height: 28px;margin-right: 5px;font-size: 12px;" round type="default"
                v-for="info in getMenuItem(orderModel)">
                {{ info }}
            </van-button>

        </van-row>
    </div>

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
.list {
    padding-top: calc(var(--van-nav-bar-height) + 8px);

    .title {
        font-size: 14px;
        font-weight: bold;
        width: 20%;
    }

    .values {
        width: 80%;
        text-align: end;
    }
}

.bottom {
    bottom: 0px;
    position: fixed;
    width: min(100%, 480px);
    background-color: white;
    height: 40px;

}
</style>