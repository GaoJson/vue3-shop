
<script setup lang="ts">
import { watchEffect } from "vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const active = ref("/Home"); 

const router = useRouter();
const route = useRoute();

watchEffect(() => {
      active.value = route.path;
    });

function changeTabar(index:number) {
  
  router.replace(tabList.list[index].pagePath);
}
 const tabList = {
  color: '#c0c0c0',
  selectedColor: '#1ba784',
  list: [
    {
      text: '首页',
      pagePath: '/Home',
      icon: 'home-o',
      activeIcon: 'home-o',
    },
    {
      text: '聊天',
      pagePath: '/Conversation',
      icon: 'apps-o',
      activeIcon: 'apps-o',
    },
    {
      text: '购物车',
      pagePath: '/news',
      icon: 'shopping-cart-o',
      activeIcon: 'shopping-cart',
    },
    {
      text: '个人中心',
      pagePath: '/user',
      icon: 'contact',
      activeIcon: 'contact',
    },
  ],
};
</script>


<template>

<van-tabbar v-model='active' fixed>
    <van-tabbar-item v-for="(item,index) in tabList.list"
     :key="index" :name="item.pagePath" @click="changeTabar(index)">
    
     <template #icon>
          <van-icon :name="item.icon" />
        </template>
        {{ item.text }}

    </van-tabbar-item>
</van-tabbar>


</template>

