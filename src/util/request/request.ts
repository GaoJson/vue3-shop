import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig }  from "axios";
import { ContentType } from "./types";
import useUserStore from "@/store/modules/user";

export function createRequest<T = any>(path:string,method:string,param:any):Promise<T> {


    const service: AxiosInstance = axios.create({
        baseURL:"https://api.yuehaigj.com/api/",
        timeout:10*1000,
        headers:{"Content-Type":ContentType.FORM_DATA}
    }
    )

    service.interceptors.request.use((config: InternalAxiosRequestConfig)=> {
        if (useUserStore().getToken){
            config.headers.token = useUserStore().getToken;
        }
        return config;
    });

    service.interceptors.response.use(
        (response:AxiosResponse<any, any>) => {
           var data = response.data;
           return data;
        } 
    )

    return new Promise((resolve, reject) => {
        console.log(path)
        if (method == "get") {
            service.get(path).then((res:any)=>{
                resolve(res);
            }
            ).catch(()=>{
    
            })
        } else if (method == "post") {
            service.post(path,param).then((res:any)=>{
                resolve(res);
            }).catch(()=>{
    
            })
        }


        
      });

}




