/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   schema_orders.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: austin0072009 <2001beijing@163.com>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/07/30 10:26:50 by austin00720       #+#    #+#             */
/*   Updated: 2022/07/30 10:26:50 by austin00720      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

//引入mongoose.js文件
var mongoose = require("./mongoose.js")
//定义schema
var schema = mongoose.Schema;
const orders = new schema({
    //这里是数据库自己创建的属性名：他的属性类型   如：
    topup_Type:{
        type:String
    },

    topup_Date: {
        type: String
    },
    topup_Amount_Kyat: {
        type: String
    },
    topup_Amount_Rmb: {
        type: String
    },

    topup_Phone: {
        type: String
    },
    topup_Order_State:{
        type: String
    },

    topup_Country: {
        type: String
    },
    topup_Order_No: {
        type: String
    },
    user_Openid: {
        type: String,
        require: true
    },

})
//导出
module.exports = orders;