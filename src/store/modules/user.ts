import { defineStore } from "pinia";

import  storage  from "good-storage";
import  API_USER  from "@/apis/account/index";

export interface UserState {
	token:string;
}

export const useUserStore = defineStore('user',{
	state: ():UserState => ({
		token:storage.get('token','')
	}),

	getters:{
		getToken:(state):string => state.token,
		isLogin:(state):boolean => !!state.token,
	},
	actions:{
		login(){

		},
		 loginOut(){
			this.token = ''
			storage.set('token','')
		},
		 userData():Recordable {
			var list:Recordable = this.getUserList()
			
			return list[this.getToken]
		},

		getUserList():Recordable{
			return JSON.parse(storage.get('userList',"{}"))
		},
		storageUserList(data:string){
			storage.set('userList',data)
		}
	}
})

export default useUserStore


export interface UserInfo {
	avatarUrl:string
	nickName:string
}