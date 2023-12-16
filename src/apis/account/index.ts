import useUserStore from "@/store/modules/user";
import { createRequest as request } from "@/util/request/request";

export function login(data:Recordable) {
    return new Promise((resolve, reject) => {
        let userData:Recordable = useUserStore().getUserList()
        var res = Object()
        if (userData[data["userName"]] != undefined) {
           let user = userData[data["userName"]]
            if (user.password == data["password"]) {
                res.code = 200
                res.msg = "登录成功"
                res.data = user
            }
        }
        if(res.code == undefined) {
            res.code = 500
            res.msg = "用户名或密码错误"
        }
        resolve(res);
      });
}

export function getUserInfo(data?:Recordable) {
    return request(
        'user/v1/my/info',
        "post",
        data
    );
}

export function getAccountInfo(data?:Recordable) {
    return request(
        'account/v1/balance',
        "post",
        data
    );
}

export function updateAvatarUrl(data?:Recordable) {
    return request(
        'user/v1/update/avatarUrl',
        "post",
        data
    );
}

export function updateGender(data?:Recordable) {
    return request(
        'user/v1/update/gender',
        "post",
        data
    );
}

export function updateNickname(data?:Recordable) {
    return request(
        'user/v1/update/nickname',
        "post",
        data
    );
}

export function updateBirthday(data?:Recordable) {
    return request(
        'user/v1/update/birthday',
        "post",
        data
    );
}


export default {
    login,
    getUserInfo,
    getAccountInfo,
    updateAvatarUrl,
    updateGender,
    updateNickname,
    updateBirthday,

}