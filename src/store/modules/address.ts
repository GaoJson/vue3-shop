import storage from "good-storage"
import useUserStore from "./user"

export class AddressModel {
    id:number = 1
    userId:String = ""
    name:String = ""
    tel:String = ""
    province:String = ""
    city:String = ""
    county:String = ""
    addressDetail:String = ""
    address:String = ""
    isDefault:boolean = false

    static toData(params:Recordable):AddressModel {
        var model = new AddressModel()
    
        model.userId = useUserStore().getToken
        return model
    }

    static saveModel(model:AddressModel){
        model.userId = useUserStore().getToken
        var json = storage.get("address","[]")
        var list:Array<AddressModel> = JSON.parse(json)
        if (list.length != 0) {
            if(model.id != 0) {
                for (let index = 0; index < list.length; index++) {
                    const element = list[index];
                    if (element.id == model.id){
                        list[index] = model
                        break
                     }
                   }
            } else {
                var lastID = list[list.length-1].id
                model.id = lastID+1
                list.push(model)
            }
            
        } else {
            list.push(model)
        }
        storage.set("address",JSON.stringify(list))
    }

    static deleteModel(model:AddressModel){
        var json = storage.get("address","[]")
        var list:Array<AddressModel> = JSON.parse(json)
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.id == model.id){
                list.splice(index,1)
                break
             }
           }
        storage.set("address",JSON.stringify(list))
    }
 
    static getList():Array<AddressModel> {
        var json = storage.get("address","[]")
        var list:Array<AddressModel> = JSON.parse(json)
        var dataList:Array<AddressModel> = []
        list.forEach(element => {
            if(element.userId == useUserStore().getToken) {
                dataList.push(element)
            }
        });
        return dataList
    }
    static getModel(id:number):AddressModel {
        var json = storage.get("address","[]")
        var list:Array<AddressModel> = JSON.parse(json)
        var data = new AddressModel()
        list.forEach(element => {
            if(element.id == id) {
                data = element
            }
        });
        return data
    }


}
