
<script setup lang="ts">
import { getAssetsUrl } from '@/util/asset_path';
import { ref } from 'vue';
import { ChatModel, MsgType, InputMenuType } from "@/views/chat/interface/chat_model";
import { Ref } from 'vue';
import { listenKeybord } from "@/util/inputUtil";
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const chatList = ref<ChatModel[]>([]);

const chatInput: Ref<string> = ref("")

const data: ChatModel = {
    msg: "i am sender",
    msgType: MsgType.text,
    isSend: true,
    headIcon: "https://upload.jianshu.io/users/upload_avatars/4790772/388e473c-fe2f-40e0-9301-e357ae8f1b41.jpeg"
}

chatList.value.push(data);
const data2: ChatModel = {
    msg: "12312",
    msgType: MsgType.text,
    isSend: false,
    headIcon: "https://upload.jianshu.io/users/upload_avatars/4790772/388e473c-fe2f-40e0-9301-e357ae8f1b41.jpeg"
}
chatList.value.push(data2);


function change() {
    var pattern = /\[http(.+?)\]/
    var imgData = chatInput.value.match(pattern);
    if (imgData) {
        var img: string = imgData[0];
        img = img.replace("[", "").replace("]", "");
        chatInput.value = ''
        const data3: ChatModel = {
            msg: img,
            msgType: MsgType.img,
            isSend: true,
            headIcon: "https://upload.jianshu.io/users/upload_avatars/4790772/388e473c-fe2f-40e0-9301-e357ae8f1b41.jpeg"
        }
        chatList.value.push(data3);
        scrollToBottom()
    }

}

scrollToBottom()
function scrollToBottom() {
    setTimeout(() => {
        window.scrollTo(0, 500000);
    }, 300);
}

function keydowns(e: any) {
    if (e.key == "Enter") {
        var text = chatInput.value;
        var facePattern = /\[face-(.+?)\]/g
        var faceData = text.match(facePattern);
        if (faceData) {
            faceData.forEach(e => {
                var imgSrc = e.replace("[", "").replace("]", "");
                var face = "images/face/" + imgSrc + ".gif";
                text = text.replace(e, "<image style='width:18px;height:18px' src=" + getAssetsUrl(face) + ">")
            })
        }

        const data: ChatModel = {
            msg: text,
            msgType: MsgType.text,
            isSend: true,
            headIcon: "https://upload.jianshu.io/users/upload_avatars/4790772/388e473c-fe2f-40e0-9301-e357ae8f1b41.jpeg"
        }
        chatList.value.push(data);

        const data1: ChatModel = {
            msg: text,
            msgType: MsgType.text,
            isSend: false,
            headIcon: "https://upload.jianshu.io/users/upload_avatars/4790772/388e473c-fe2f-40e0-9301-e357ae8f1b41.jpeg"
        }
        chatList.value.push(data1);

        chatInput.value = "";
        scrollToBottom()
    }

}

listenKeybord(function main(data: string) {
    if (data === "on") {
        inputMenuType.value = InputMenuType.text;
        setTimeout(() => {
            window.scrollTo(0, 500000);
        }, 300);
    }
});

var inputMenuType = ref<InputMenuType>(0)


function moreBtnClick() {
    scrollToBottom()
    if (inputMenuType.value == InputMenuType.more) {
        inputMenuType.value = InputMenuType.none;
    } else {
        inputMenuType.value = InputMenuType.more;
    }
}

function faceBtnClick() {
    scrollToBottom()
    if (inputMenuType.value == InputMenuType.face) {
        inputMenuType.value = InputMenuType.none;
    } else {
        inputMenuType.value = InputMenuType.face;
    }
}

function voiceBtnClick() {
    scrollToBottom()
    if (inputMenuType.value == InputMenuType.voice) {
        inputMenuType.value = InputMenuType.none;
    } else {
        inputMenuType.value = InputMenuType.voice;
    }
}

function chatBottomHeight() {
    if (inputMenuType.value == InputMenuType.more || inputMenuType.value == InputMenuType.face) {
        return "230px";
    }

    return "50px";
}

function uploadImageChange(e: any) {
    console.log(e.target.files);
    var reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onload = function (event) {
        // blob stuff
        var blob = new Blob([event.target.result]); // create blob...
        window.URL = window.URL || window.webkitURL;
        var blobURL = window.URL.createObjectURL(blob); // and get it's URL
        const data3: ChatModel = {
            msg: blobURL,
            msgType: MsgType.img,
            isSend: true,
            headIcon: "https://upload.jianshu.io/users/upload_avatars/4790772/388e473c-fe2f-40e0-9301-e357ae8f1b41.jpeg"
        }
        chatList.value.push(data3);
        scrollToBottom()
    };

}

function onclickFaceAction(e: any) {
    var src: string = e;
    var data = src.split("/")
    var faceStr = "[" + data[data.length - 1].replace(".gif", "") + "]"
    chatInput.value = chatInput.value.concat(faceStr);
}

const content = ref()
onMounted(() => {
    window.addEventListener('scroll', function(e) {
 
        
});
})






function srcOnClick(data1: number, data2: string) {
    if (data1 == 0) {
        onclickFaceAction(data2)
    } else if (data1 == 1) {
        chatInput.value = chatInput.value.concat(data2);
    } else if (data1 == 2) {
        const data3: ChatModel = {
            msg: data2,
            msgType: MsgType.img,
            isSend: true,
            headIcon: "https://upload.jianshu.io/users/upload_avatars/4790772/388e473c-fe2f-40e0-9301-e357ae8f1b41.jpeg"
        }
        chatList.value.push(data3)
        scrollToBottom()

    }
}


</script>


<template>
    <van-nav-bar left-arrow @click-left="router.back"  style="position: fixed;width:min(100%,480px)" title="聊天"></van-nav-bar>

    <div ref="content" :style="{ paddingBottom: chatBottomHeight() }" style="padding-top: 40px;" class="container">
        <div   v-for="item in chatList">

            <van-row v-show="item.isSend" type="flex" justify="end" style="margin-top: 10px;">
                <div v-show="item.msgType == MsgType.text"
                    style="word-break: break-all;word-wrap: break-word;
                     margin-left: 5px;padding: 8px 8px 0px 8px;background-color: white;border-radius: 10px;max-width: 250px;">

                    <div v-html="item.msg"></div>
                </div>

                <img v-if="item.msgType == MsgType.img" style="margin-left: 5px;border-radius: 10px;max-width: 250px;"
                    :src="item.msg" />

                <img style="width: 40px;height: 40px;border-radius: 50px;margin-left: 5px;margin-top: 5px;"
                    :src="(item.headIcon)" />
            </van-row>

            <van-row v-show="!item.isSend" type="flex" justify="start" style="margin-top: 10px;">
                <img style="width: 40px;height: 40px;border-radius: 50px;margin-left: 5px;margin-top: 5px;"
                    :src="item.headIcon" />

                <div v-show="item.msgType == MsgType.text"
                    style="word-break: break-all;word-wrap: break-word;margin-left: 5px;padding: 8px;background-color: white;border-radius: 10px;max-width: 250px;tex">
                    <div v-html="item.msg"></div>
                </div>
                <img v-show="item.msgType == MsgType.img" style="margin-left: 5px;border-radius: 10px;max-width: 250px"
                    :src="item.msg" />
            </van-row>


        </div>


    </div>

    <div class="screen-width" style="position:fixed;bottom: 0;width:min(100%,480px);z-index: 999;">
        <van-row style="height: 40px;background-color: rgb(239, 239, 239);">
            <img @click="voiceBtnClick" class="input-item" :src="getAssetsUrl('images/chat/icon_chat_input_item_voice.png')" />
            <input v-show="inputMenuType != InputMenuType.voice" enterkeyhint="send" type="text" v-on:keydown="keydowns" v-on:beforeinput="" v-on:input="change"
                v-model="chatInput" class="chat-input" style="flex: 1;" />
            
            <van-button v-show="inputMenuType == InputMenuType.voice" class="chat-voice">按住说话</van-button>
           
            <img @click="faceBtnClick" class="input-item"
                :src="getAssetsUrl('images/chat/icon_chat_input_item_face.png')" />
            <img @click="moreBtnClick" class="input-item"
                :src="getAssetsUrl('images/chat/icon_chat_input_item_more.png')" />
        </van-row>

        <div v-show="inputMenuType == InputMenuType.more"
            style="height: 180px;width: 100%;background-color: white;padding-top: 10px;">
            <van-row>
                <van-col class="uploadImg" span="6" style="text-align: center;position: relative;">
                    <van-icon name="debit-pay" size="50px" />
                    <p>图片</p>
                    <input v-on:input="uploadImageChange" accept="dat" style="width: 100%;height: 100%;position: absolute;"
                        type="file" />
                </van-col>
                <!-- <van-col span="6" style="text-align: center;">
                    <van-icon name="debit-pay" size="50px" />
                    <p>图片</p>
                </van-col> -->
            </van-row>
        </div>



        <div v-if="inputMenuType == InputMenuType.face"
            style="height: 180px;width: 100%;background-color: white;padding-top: 10px;z-index: 100;">
            <emoji-view @src-click="srcOnClick" />

        </div>

    </div>
</template>

<style lang="less" scoped>
.input-item {
    margin-left: 5px;
    height: 30px;
    width: 30px;
    margin-top: 5px;
}

.chat-input {
    border-radius: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
    border: 0;
    padding-left: 5px;
    margin-left: 8px;
    margin-right: 5px;
}

.chat-voice {
    height: 33px;
    flex: 1;
    border-radius: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
    border: 0;
    padding-left: 5px;
    margin-left: 8px;
    margin-right: 5px;
}


.uploadImg input[type=file] {
    left: 0;
    top: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: 2;
    opacity: 0;
    position: absolute;
}
</style>

