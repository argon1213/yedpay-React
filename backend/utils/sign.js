/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sign.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: austin0072009 <2001beijing@163.com>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/07/15 23:27:56 by austin00720       #+#    #+#             */
/*   Updated: 2022/07/15 23:27:56 by austin00720      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

var {
    appid,
    secret
} = require('../config/index');
var axios = require('axios');
var sha1 = require('sha1');
var ticketModel = require('../lib/ticketModel');


// 详情参考微信开放文档：https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
// https请求方式: GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET

async function getTicket() {

    //从数据库中找
    let ticket_data = await ticketModel.find();
    let access_token = '';
    let ticket = '';
    if (ticket_data.length > 0) { //判断数据库中是否有字段
        let t = new Date().getTime() - ticket_data[0].token_time;
        if (t > 7000000) { //是否过期
            //重新获取，并插入新的数据进行覆盖（直接覆盖即可，不用存）
            await loadData();
            let {
                _id
            } = ticket_data[0];
            let time = new Date().getTime();
            await ticketModel.updateOne({
                _id
            }, {
                access_token,
                token_time: time,
                ticket,
                ticket_time: time
            });

        } else { //没有过期，直接取
            access_token = ticket_data[0].access_token;
            ticket = ticket_data[0].ticket;
        }

    } else { // 第一次获取需要进行 字段，文档的创建
        await loadData();
        let time = new Date().getTime();
        await new ticketModel({
            access_token,
            token_time: time,
            ticket,
            ticket_time: time
        }).save();

    }

    async function loadData() {

        let token_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
        let token_data = await axios.get(token_url);

        console.log('token', token_data);

        access_token = token_data.data.access_token; //向微信请求拿到access token

        // 用access token 获取jsapi_ticket
        //https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi

        let ticket_url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
        let ticket_data_temp = await axios.get(ticket_url); //得到jsapi_ticket

        console.log('ticket', ticket_data_temp.data.ticket);

        ticket = ticket_data_temp.data.ticket;

    }

    return {
        access_token,
        ticket
    }




}


var createNonceStr = function () { //生成随机字符串

    return Math.random().toString(36).substring(2, 15);

}

var createTimeStamp = function () { // 生成时间戳
    return parseInt(new Date().getTime() / 1000) + '';
}

var row = function (obj) { //处理数据格式的方法
    var keys = Object.keys(obj);
    keys = keys.sort();
    var newObj = {};
    keys.forEach((key) => {
        newObj[key.toLowerCase()] = obj[key]
    })

    var string = '';
    for (var k in newObj) {
        string += '&' + k + '=' + newObj[k]
    }

    string = string.substring(1);

    return string;
}


var sign = async function (url) { //生成signature签名的方法

    let {ticket} = await getTicket();
    var obj = {
        // appid, 签名过程只能有四个参数参数
        jsapi_ticket:ticket,
        nonceStr: createNonceStr(),
        timestamp: createTimeStamp(),
        url
    }

    var str = row(obj);
    var signature = sha1(str); // 生成签名
    obj.signature = signature;
    obj.appId = appid;


    return obj;
}

module.exports = {
    sign,
    getTicket
}