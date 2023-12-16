
<script setup lang="ts">
import { useRouter } from 'vue-router';


import { ref } from 'vue';
import { onMounted } from 'vue';
import useUserStore from '@/store/modules/user';
import API_USER from '@/apis/account'


import { uploadFile } from "@/util/uploadFile";
import { showToast } from 'vant';

const userStore = useUserStore()
const router = useRouter()

const userData = ref<Recordable>({});

onMounted(() => {
    userData.value = userStore.userData()
})



const userNameInput = ref('')
const shows = ref(false)
function showName() {
    shows.value = true;
}
function ensureName() {
   userData.value.nickName = userNameInput.value
   var obj:Object = useUserStore().getUserList()
   obj[userData.value.userName] = userData.value
   useUserStore().storageUserList(JSON.stringify(obj))
}

const showDate = ref(false)
const minDate = ref(new Date(1900, 0, 1))
const maxDate = ref(new Date(2050, 0, 1))
const currentDate = ref(['2021', '01', '01']);
function showDatePicker() {
    showDate.value = true
}
function confirmDate() {
    
}

const genderList = ref<any>([{ text: '男', value: 0 }, { text: '女', value: 1 }])
const showGender = ref(false)
function confirmGender(value:any) {
   console.log(value)
}

const fileInput = <any>ref()

function handFileUpload(res: any) {
    const file = res.currentTarget.files[0];
    uploadFile(file).then((res: any) => {
        const url = res.url;
        var param = {
            'avatarUrl': url
        }
        API_USER.updateAvatarUrl(param).then((re: any) => {
            console.log(re);
            userStore.userData().then(() => {
                showToast('上传成功')
                userData.value = userStore.getuserInfo
            })
        })
    })


}

</script>


<template>
    <van-nav-bar left-arrow title="安全设置" @click-left="router.back" />

    <img :src="fileInput" />


    <div style="text-align: center;height: 150px;width: 100%;margin-top: 30px;margin-bottom: 30px;">
        <input v-on:change="handFileUpload" style="z-index: 999;height: 150px;width: 100px;opacity: 0;position: absolute;"
            type="file">
        <van-image round style="width: 100px;height: 100px;" :src="userData.avatarUrl" />
        <div>修改头像</div>
    </div>

    <van-cell-group inset>
        <van-cell class="valueleft hideright" title="注册手机号" :value="userData.userName ?? ''" is-link />
        <van-cell @click="showName" class="valueleft" title="昵称" :value="userData.nickName ?? ''" is-link />
        <van-cell @click="showDatePicker" class="valueleft" title="出生日期" :value="userData.birthday" is-link />
        <van-cell @click="showGender = true" class="valueleft" title="性别" :value="userData.gender == 1 ? '女' : '男'"
            is-link />
    </van-cell-group>

    <van-dialog @confirm="ensureName" v-model:show="shows" title="修改昵称" show-cancel-button>
        <div style="margin-top: 10px;margin-bottom: 10px;height: 40px;width: 100%;text-align: center;">
            <van-cell-group style="text-align: center;">
                <van-field input-align="center" v-model="userNameInput" placeholder="请输入昵称" />
            </van-cell-group>
        </div>
    </van-dialog>

    <van-popup position="bottom" v-model:show="showDate">
        <van-date-picker v-model="currentDate" type="datetime" title="选择日期" :min-date="minDate" :max-date="maxDate"
            @confirm="confirmDate" @cancel="showDate = false" />
    </van-popup>

    <van-popup position="bottom" v-model:show="showGender">

        <van-picker :columns="genderList" @cancel="showGender = false" @confirm="confirmGender" />

    </van-popup>
</template>

<style lang="less">
.hideright {
    i {
        color: transparent;
    }

}

.valueleft {
    .van-cell__value {
        min-width: 65%;
    }
}

.van-cell__value span {
    display: inline-block;
    text-align: left;
    word-break: break-all;
    width: 100%;
}
</style>