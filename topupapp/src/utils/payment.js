export function createNonceStr () { //生成随机字符串

    return Math.random().toString(36).substring(2, 15);

}

export function createTimeStamp () { // 生成时间戳
    return parseInt(new Date().getTime() / 1000) + '';
}


