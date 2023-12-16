

<script setup lang="ts">
import { getAssetsUrl } from '@/util/asset_path';
import { ref } from 'vue';
import { onMounted } from 'vue';


onMounted(() => {
    loadEmoji()
    loadFace()
    loadGif()
})

const selectIndex = ref(0)
function clickTabbar(index:number) {
    selectIndex.value = index;
}

var emojiList: Array<Array<Array<string>>> = [];
function loadEmoji() {
    var emojis: Array<string> = [];
    var emoji = "😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 😉 😊 😇 🥰 😍 🤩 😘 😗 ☺ 😚 😙 🥲 😋 😛 😜 🤪 😝 🤑 🤗 🤭 🤫 🤔 🤐 🤨 😐 😑 😶 😏 😒 🙄 😬 🤥 😌 😔 😪 🤤 😴 😷 🤒 🤕 🤢 🤮 🤧 🥵 🥶 🥴 😵 🤯 🤠 🥳 🥸 😎 🤓 🧐 😕 😟 🙁 ☹ 😮 😯 😲 😳 🥺 😦 😧 😨 😰 😥 😢 😭 😱 😖 😣 😞 😓 😩 😫 🥱 😤 😡 😠 🤬 😈 👿 💀 ☠ * 🤡 👹 👺 👻 👽 👾 🤖 😺 😸 😹 😻 😼 😽 🙀 😿 😾 🙈 🙉 🙊 💋 💌 💘 💝 💖 💗 💓 💞 💕 💟 ❣ 💔 ❤ 🧡 💛 💚 💙 💜 🤎 🖤 🤍 💯 💢 💥 💫 💦 💨 🕳 💣 💬 👁‍🗨 🗨 🗯 💭 💤"
    emojis = emoji.split(" ");
    var page = 1;
    var innerPage = 1;
    for (let index = 1; index < emojis.length; index++) {
        if (index / 32 > page) {
            page += 1;
            innerPage = 1;
        }
        if (emojiList.length < page) {
            var arr: Array<Array<string>> = [];
                emojiList.push(arr);
        }

        var array = emojiList[page - 1];
        var currectIndex = index % 32;

        if (currectIndex / 8 > innerPage) {
            innerPage++;
        }
        if (array.length < innerPage) {
            var arrs: Array<string> = [];
            array.push(arrs);
        }

        var imgArray = array[innerPage - 1];
        var face = emojis[index]
        imgArray.push(face);
    }
}

var faceList: Array<Array<Array<string>>> = [];
function loadFace() {
    var page = 1;
    var innerPage = 1;
    for (let index = 1; index < 209; index++) {
        if (index / 32 > page) {
            page += 1;
            innerPage = 1;
        }
        if (faceList.length < page) {
            var arr: Array<Array<string>> = [];
            faceList.push(arr);
        }

        var array = faceList[page - 1];
        var currectIndex = index % 32;

        if (currectIndex / 8 > innerPage) {
            innerPage++;
        }
        if (array.length < innerPage) {
            var arrs: Array<string> = [];
            array.push(arrs);
        }

        var imgArray = array[innerPage - 1];
        var face = getAssetsUrl("images/face/face-" + (index - 1) + ".gif");
        imgArray.push(face);
    }
}

var gifList: Array<Array<Array<string>>> = [];
function loadGif() {
    var page = 1;
    var innerPage = 1;
    for (let index = 1; index < 16; index++) {
        if (index / 8 > page) {
            page += 1;
            innerPage = 1;
        }
        
        if (gifList.length < page) {
            var arr: Array<Array<string>> = [];
                gifList.push(arr);
        }

        var array = gifList[page - 1];
        var currectIndex = index % 8;

        if (currectIndex / 4 > innerPage) {
            innerPage++;
        }
        if (array.length < innerPage) {
            var arrs: Array<string> = [];
            array.push(arrs);
        }

         var imgArray = array[innerPage - 1];
         var face = getAssetsUrl("images/chat/gif/gif-" + (index - 1) + ".gif");
         imgArray.push(face);
    }
}

const emit = defineEmits(['srcClick'])

function clickFace(msg:string){
    const data = selectIndex.value;
    emit('srcClick',data,msg)
    
}


</script>


<template>
    <van-swipe v-if="selectIndex==1"  style="background-color: #fff;width: 100%;height: 130px;padding-bottom: 8px;"  :loop="false" :show-indicators="false">
        <van-swipe-item v-for="idx in emojiList">
            <van-row  v-for="index in idx">
                <van-col @click="clickFace(j)" style="text-align: center;font-size: 20px;" span="3" v-for="j in index">
                    {{ j }}
                </van-col>
            </van-row>
        </van-swipe-item>
    </van-swipe>
    <van-swipe v-if="selectIndex==0" style="background-color: #fff;width: 100%;height: 130px;" :loop="false" :show-indicators="false">
        <van-swipe-item v-for="idx in faceList">
            <van-row v-for="index in idx">
                <van-col style="text-align: center;" span="3" v-for="j in index">
                    <img @click="clickFace(j)" style="width: 25px;height: 25px;" :src='j'>
                </van-col>
            </van-row>
        </van-swipe-item>
    </van-swipe>

    <van-swipe v-if="selectIndex==2" style="background-color: #fff;width: 100%;height: 130px;" :loop="false" :show-indicators="false">
        <van-swipe-item v-for="idx in gifList">
            <van-row v-for="index in idx">
                <van-col style="text-align: center;" span="6" v-for="j in index">
                    <img @click="clickFace(j)" style="width: 60px;height: 60px;" :src='j'>
                </van-col>
            </van-row>
        </van-swipe-item>
    </van-swipe>



    <van-row class="nav-bar">
        <van-button :type="selectIndex==0?'primary':'default'" @click="clickTabbar(0)">表情</van-button>
        <van-button :type="selectIndex==1?'primary':'default'" @click="clickTabbar(1)">emoji</van-button>
        <van-button :type="selectIndex==2?'primary':'default'" @click="clickTabbar(2)">斗图</van-button>
    </van-row>

    
</template>

<style lang='less' scoped>

.nav-bar {
    .van-button{
        margin-top: 5px;
        height: 30px;
    }

}




</style>