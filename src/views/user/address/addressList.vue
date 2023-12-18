
<script lang="ts">
  export default {
    name:"AddressList"
  }

</script>

<script setup lang="ts">

import { AddressModel } from '@/store/modules/address';
import { onActivated } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

 const list = ref()

function editAction(model: Recordable){
  router.push({path:'/user/addressEdit',query:{id:model.id}})
}

function addAction(){
  router.push({path:'/user/addressEdit'})
}

onActivated(()=>{
  console.log("onActivatedonActivated")
  list.value = AddressModel.getList()

})

</script>

<template>
    <van-nav-bar left-arrow @click-left="router.back"  style="position: fixed;width:min(100%,480px);" title="地址"></van-nav-bar>

    <van-address-list style="padding-top:var(--van-nav-bar-height)"
  
  :list="list"
  default-tag-text="默认"
  @edit="editAction"
  @add="addAction"
/>




</template>