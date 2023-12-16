import type { AxiosInstance } from "axios";
import axios from "axios";
import { ContentType } from "./request/types";
import { Base64 } from "js-base64";

import OSS from "ali-oss";

export function uploadFile<T = any>(file:File):Promise<T> {
    const  ossAccessKeyId = 'LTAI5tJiLy7bcow4pQ32qpLY'; 
    const ossAccessKeySecret = 'wUHepYT1wWtuFAgxNI5sX4W05nvUmV';
    const bucket = 'yuehaigj';
    const url = 'https://yuehaigj.oss-cn-shenzhen.aliyuncs.com';
    const expiration:string = '2055-01-01T12:00:00.000Z';
   
    const service: AxiosInstance = axios.create({
        baseURL:"https://api.yuehaigj.com/api/",
        timeout:30*1000,
        headers:{"Content-Type":ContentType.FORM_DATA}
    }
    )

    const client = new OSS({
        region:'oss-cn-shenzhen',
        accessKeyId:ossAccessKeyId,
        accessKeySecret:ossAccessKeySecret,
        bucket:'yuehaigj'
    })




return new Promise((resolve, reject) => {
    client.put(`moment/${getRandom(12)}-${file.name}`,file).then((res:any)=>{
        resolve(res);
    });
})

 function getDate():string{
    const date = new Date();
    return ""+date.getFullYear+date.getMonth+date.getDay
 }

 function getRandom(num:number):string {
    var alphabet = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    var left = '';
    for(var i =0; i < num;i++) {
        left += alphabet[Math.random()*alphabet.length]
    }
    return left
 }


 function getSignature():string {
    const policyText = `"expiration":"${expiration}","conditions":[
        {"bucket":"${bucket}"},
        ["content-length-range", 0, 1048576000]
    ]`

    const policyTextUtf8 = new TextEncoder().encode(policyText)
    const policy_base64 = Base64.encode(policyTextUtf8 as any,false)
    const policy = new TextEncoder().encode(policy_base64)
    const key =  new TextEncoder().encode(ossAccessKeySecret)
    

    return policyText
 }


}