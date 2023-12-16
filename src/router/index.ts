import { createRouter, createWebHashHistory } from 'vue-router'


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path:'/home',
      name: 'Home',

      component: () => import('@/views/home/home.vue'),
    },
    {
      path:'/Conversation',
      name: 'Conversation',
      component: () => import('@/views/chat/conversation.vue'),
    },
    {
      path:'/Chat',
      name: 'Chat',
      component: () => import('@/views/chat/chat.vue'),
    },
    {
      path:'/goods/detail',
      name:"GoodDetail",
      component:() => import('@/views/goods/detail/index.vue'),
    },
    {
      path:'/goods/search',
      name:'GoodSearch',
      component:()=>import('@/views/goods/search/index.vue')
    },
    {
      path:'/goods/sort',
      name:'GoodSort',
      component:()=>import('@/views/goods/sort/index.vue')
    },


    {
      path:'/user',
      name:'User',
      component:()=>import('@/views/user/index.vue')
    },
    {
      path:'/user/login',
      name:'Login',
      component:()=>import('@/views/login/login.vue')
    },
    {
      path:'/user/regist',
      name:'Regist',
      component:()=>import('@/views/login/regist.vue')
    },
    {
      path:'/user/setting',
      name:'Setting',
      component:()=>import('@/views/user/setting/index.vue')
    },

    {
      path:'/user/userinfo',
      name:'Userinfo',
      component:()=>import('@/views/user/userInfo/index.vue')
    },
    {
      path:'/news',
      name:'News',
      component:()=>import('@/views/news/index.vue')
    },

    {
      path: '/404',
      component: () => import('@/views/exception/404.vue'),
      meta: {
        title: '找不到页面',
      },
    },

    { path: '/:path(.*)*', redirect: '/404' },
  ]
})

export default router
