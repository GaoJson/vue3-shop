

import { createRequest as request } from "@/util/request/request";

export function searchGoods(data?:Recordable) {
    return request(
        'goods/v1/list',
        "post",
        data
    );
}

export function sortGoods(data?:Recordable) {
    return request(
        'goods/v1/list',
        "post",
        data
    );
}

export default {
    searchGoods,
    sortGoods,


}