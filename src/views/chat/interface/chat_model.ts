
export interface ChatModel {
    msgType:MsgType,
    msg:String,
    isSend:Boolean,
    headIcon:String,
    


}

export enum MsgType {
    text,
    img,
    video,
    voice
}

export enum InputMenuType {
    none,
    face,
    text,
    more,
    voice
}

