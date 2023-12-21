import storage from "good-storage"
import useUserStore from "./user"

export class OrderModel {
    id:number = 1
    userId:String = ""
    state:number = 0
    orderPrice:String = ""
    address:String = ""
    expressNumber:String = ""
    content:String = ""
    goods:String = ""
    createTime:String=""
    payTime:String=""
    expressTime:String=""
    endTime:String=""


    static saveModel(model:OrderModel):OrderModel {
        model.userId = useUserStore().getToken
        var json = storage.get("order","[]")
        var list:Array<OrderModel> = JSON.parse(json)
        if (list.length != 0) {
            var lastID = list[list.length-1].id
            model.id = lastID+1
            list.push(model)
        } else {
            list.push(model)
        }
        storage.set("order",JSON.stringify(list))
        return model
    }

    static updateModel(model:OrderModel){
        var json = storage.get("order","[]")
        var list:Array<OrderModel> = JSON.parse(json)
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.id == model.id) {
                list[index] = model
                break
            }
        }
        storage.set("order",JSON.stringify(list))
    }

    static getModel(id:number):OrderModel {
        var json = storage.get("order","[]")
        var list:Array<OrderModel> = JSON.parse(json)
        var data = new OrderModel()
        list.forEach(element => {
            if(element.id == id) {
                data = element
            }
        });
        return data
    }

    static getOrderState():Array<number> {
        var json = storage.get("order","[]")
        var stateList = [0,0,0,0]
        var list:Array<OrderModel> = JSON.parse(json)
        list.forEach(element => {
            if(element.state == 0) {
                stateList[0] += 1
            }
            if(element.state == 1) {
                stateList[1] += 1
            }
            if(element.state == 2) {
                stateList[2] += 1
            }
            if(element.state == 3) {
                stateList[3] += 1
            }
            if(element.state == 4) {
                stateList[4] += 1
            }
        });
        return stateList
    }

    static getOrderList(state:number):Array<OrderModel>{
        var list:Array<OrderModel> = []
        var json = storage.get("order","[]")
        var allList:Array<OrderModel> = JSON.parse(json)
        if (state == 0) {
            list = allList
        }else {
            allList.forEach(element => {
                if (element.state == (state-1)){
                    list.push(element)
                }
            });
        }
        return list
    }

    static deleteModel(model:OrderModel) {
        var json = storage.get("order","[]")
        var list:Array<OrderModel> = JSON.parse(json)
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.id == model.id) {
                list.splice(index,1)
                break
            }
        }
        storage.set("order",JSON.stringify(list))
    }

}