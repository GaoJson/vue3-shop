import { defineStore } from "pinia";
import  storage  from "good-storage";
import useUserStore from "./user";


export class ShopcarModel {
    shopId:number = 0
    id:number = 1
    userId:String = ""
    goodsImg:String = ""
    goodsName:String = ""
    goodsPrice:String = ""
    spec:String = ""
    selectFlag:boolean = true
    count:number = 1

    static toData(params:Recordable):ShopcarModel {
        console.log(params)
        var model = new ShopcarModel()
        model.goodsImg = params.goodsImg
        model.goodsName = params.goodsName
        model.goodsPrice = params.goodsPrice
        model.spec = "默认"
        model.selectFlag = true
        model.shopId = params.id
        model.userId = params.userId
        model.userId = useUserStore().getToken
        return model
    }
}

export const useShopCarStore = defineStore("shopcar",{

    actions:{
        getShopcar():Array<ShopcarModel> {
            var json = storage.get("shopcar","[]")
            var list:Array<ShopcarModel> = JSON.parse(json)
            var dataList:Array<ShopcarModel> = []
            list.forEach(element => {
                if(element.userId == useUserStore().getToken) {
                    dataList.push(element)
                }
            });
            return dataList
        },

        getShopcarbyId(ids:Array<string>):Array<ShopcarModel> {
            let mySet = new Set();
            ids.forEach(element => {
               mySet.add(element) 
            });
            var json = storage.get("shopcar","[]")
            var list:Array<ShopcarModel> = JSON.parse(json)
            var dataList:Array<ShopcarModel> = []
            list.forEach(element => {
               if (mySet.has(element.id.toString())){
                dataList.push(element)
               }
            });
            return dataList
        },

        saveShopcar(model:Recordable) {
            var json = storage.get("shopcar","[]")
            var list:Array<ShopcarModel> = JSON.parse(json)
            if (list.length != 0) {
                var isExitst = false
                list.forEach(element => {
                    if(element.shopId == model.id && element.userId==useUserStore().getToken) {
                            element.count += 1
                            isExitst = true
                    }
                });
                if (!isExitst){
                    var lastID = list[list.length-1].id
                    var shopcar = ShopcarModel.toData(model)
                    shopcar.id = lastID+1
                    list.push(shopcar)
                }
            } else {
                list.push(ShopcarModel.toData(model))
            }
            storage.set("shopcar",JSON.stringify(list))
        },

        updateShopcar(model:ShopcarModel) {
           let allList = this.getShopcar()
           for (let index = 0; index < allList.length; index++) {
            const element = allList[index];
            if (element.id == model.id){
                allList[index] = model
                break
             }
           }
           storage.set("shopcar",JSON.stringify(allList))
        },

        deleteShopcar(model:ShopcarModel) {
            let allList = this.getShopcar()
            var deleteIndex = 0
            for (let index = 0; index < allList.length; index++) {
             const element = allList[index];
             if (element.id == model.id){
                deleteIndex = index
                 break
              }
            }
            allList.splice(deleteIndex,1)
            storage.set("shopcar",JSON.stringify(allList))
        }

        
    }
}
)

export default useShopCarStore
