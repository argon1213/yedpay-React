//引入mongoose.js文件
var mongoose = require("./mongoose.js")
//定义schema
var schema = mongoose.Schema
const users = new schema({
    //这里是数据库自己创建的属性名：他的属性类型   如：
    user_Name: {
        type: String,
        require: true
    },
    user_Openid: {
        type: String,
        require: true
    },
    user_Access_token:{
        type: String,
    },
    token_time:{
        type:String
    },
    refresh_token:{
        type:String
    },

    level: {
        type: String
    },
    updated: {
        type: Date,
        default: Date.now
    },
    // topup_History: [{
    //     topup_Date: {
    //         type: String
    //     },
    //     topup_Amount_Kyat: {
    //         type: String
    //     },
    //     topup_Amount_Rmb: {
    //         type: String
    //     },
    //     topup_Phone: {
    //         type: String
    //     },
    //     topup_Order_No: {
    //         type: String
    //     },

    //     topup_Country: {
    //         type: String
    //     },
    //     topup_Order_State:{
    //         type: String
    //     }

    // }],
    avatar: {
        type: String
    },

})
//导出
module.exports = users;