import axios, { Axios } from "axios";
import { ContentType } from "./request/types";




export function uploadProduct(data:any){
   
    const rows = data.data.rows;
    var params:any = {};
    params.data = JSON.stringify(rows);
    const service = axios.create(
        {
            headers:{"Content-Type":ContentType.FORM_DATA}
        }
    );
    service.post(
    "http://192.168.2.17:8080/product/add",params
   ).then((res)=>{

   }).catch((error)=>{

   })


}