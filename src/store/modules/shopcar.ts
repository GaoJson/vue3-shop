import { defineStore } from "pinia";
import  storage  from "good-storage";



export const useShopCarStore = defineStore("shopcar",{

    actions:{
        getShopcar(){
            storage.set("")

        }
        

    }
}
)

export default useShopCarStore

interface ShopcarModel {
 
    name:string,
    

}