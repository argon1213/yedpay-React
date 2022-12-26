/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: austin0072009 <2001beijing@163.com>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/07/16 17:29:51 by austin00720       #+#    #+#             */
/*   Updated: 2022/10/09 16:57:59 by austin00720      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

var express = require('express');
var router = express.Router();
var sha1 = require("sha1");
var { sign, getTicket } = require('../utils/sign');
var axios = require("axios");
var {
  appid,
  secret
} = require('../config/index');
var crypto = require('crypto');
var fs = require('fs');
var orderModel = require("../lib/orderModel");
var appModel = require("../lib/appModel");
const { type } = require('os');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

var rate = 300;
var rmbToKyats = ["1000",  "3000", "5000", "10000", "20000", "30000", "50000"];

var kyatsToRmb = { 1: (100000 / rate).toFixed(0), 2: (300000 / rate).toFixed(0),  3: (500000 / rate).toFixed(0), 4: (1000000 / rate).toFixed(0), 5: (2000000 / rate).toFixed(0), 6: (3000000 / rate).toFixed(0), 7: (5000000 / rate).toFixed(0),
                  21: 500, 22: 900, 23: 1300, 24:1600,25:2300,26:3800,27:7500,28:14500,29:21000};



var getOrderNumber = () => {
  //自定义订单编号生成规则   由YYYYMMDD(年月日) + 时间戳的格式组成
  let currDate = new Date();
  let year = currDate.getFullYear();
  let month = currDate.getMonth() + 1 < 10 ? "0" + (currDate.getMonth() + 1) : currDate.getMonth() + 1;
  let day = currDate.getDate() < 10 ? "0" + currDate.getDate() : currDate.getDate();

  //获取年月日
  let date = year + month + day; //20190524

  //获取当时时间戳
  let timestamp = Date.parse(currDate); //155866554500

  //生成订单
  let orderId = date + timestamp; //20190524155866554500

  return orderId;
}

/* GET home page. */
router.get('/', function (req, res, next) {

  console.log("Wechat Check");
  console.log(req.query);
  var { signature, timestamp, nonce, echostr } = req.query;

  var token = "Austin";
  var arrSort = [token, timestamp, nonce];
  arrSort.sort();

  var str = arrSort.join("");
  var shaStr = sha1(str);



  console.log(shaStr);

  if (signature === shaStr) {
    res.set('Content-Type', 'text/plain');
    res.send(echostr);
  }
  else res.send("Nothing Happen, But this it the right route");

});



router.get('/jsapi', async function (req, res) {

  let url = decodeURIComponent(req.query.url);
  let conf = await sign(url);

  console.log('config', conf);
  res.send(conf);


})

//服务器创建自定义菜单
router.get('/createMenu', async function (req, res) {

  var post_data = {
    "button": [
      {
        "type": "view",
        "name": "话费充值",
        "url": "http://jiaguo.tcjy33.cn/"
      },
      {
        "type": "click",
        "name": "关于我们",
        "key": "about"
      }
    ]
  };


  var { access_token } = await getTicket();


  var url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`;
  axios.post(url, post_data)
    .then(res => {
      console.log('res=>', res);
    })

})


//服务器用code换取accesstoken 和 openid
router.post('/exchangeCode', async function (req, res) {

  let time = new Date().getTime();

  console.log(req.body);
  var code = req.body.code;


  console.log("code", code);
  var { openid, access_token } = await axios.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`)
    .then(async res => {
      //console.log(data.data);

      var { openid, access_token, refresh_token } = res.data;
      console.log("openid", openid);
      if (openid == undefined) openid = window.openid;


      let find = await appModel.find({ user_Openid: openid });

      if (find == 0) {

        await appModel.insertMany([{
          user_Openid: openid,
          user_Access_token: access_token,
          token_time: time,
          refresh_token: refresh_token
        }]).catch(err => {
          console.log("Insert user openid access token err", err);
        })


        console.log("new User Data created");

      }
      else {

        await appModel.updateOne({ user_Openid: openid }, {
          user_Openid: openid,
          user_Access_token: access_token,
          token_time: time,
          refresh_token: refresh_token
        }).catch(err => {
          console.log("Insert user openid access token err", err);
        })


        console.log("User Data updated");

      }

      return { openid, access_token };
    }).catch(err => {
      console.log(err);

      res.status(501).send("request to wechat error");
    })

  var { nickname, headimgurl } = await axios.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`)
    .then(res => {

      var { nickname, headimgurl, openid } = res.data;


      appModel.updateOne({ user_Openid: openid }, {
        user_Name: nickname,
        avatar: headimgurl
      }).catch(err => {
        console.log("Insert user data err", err);
      });

      return { nickname, headimgurl };


    }).catch(err => {
      console.log(err);

      res.status(501).send("request to wechat error");
    })






  res.status(200).send({ openid, access_token, nickname, headimgurl });


})


router.post('/getPaySign', async function (req, res) {

  // var { nonceStr, timestamp } = req.body;

  var { appid, timestamp, nonceStr, prepay_id } = req.body;
  console.log("PaySing Req:", req.body);

  const message = `${appid}\n${timestamp}\n${nonceStr}\nprepay_id=${prepay_id}\n`;
  // const message = `POST\n/v3/pay/transactions/jsapi\n${timestamp}\n${nonceStr}\n{"mchid":"1628040916","out_trade_no":"${orderNumber}","appid":"${appid}","description":"亚洲未来科技-话费充值-缅甸话费充值","notify_url":"http://web.tcjy33.cn/notify","amount":{"total":${amount},"currency":"CNY"},"payer":{"openid":"${openid}"}}\n`;

  const signature = crypto.createSign('RSA-SHA256').update(message, 'utf-8').sign(fs.readFileSync('./pem/apiclient_key.pem').toString(), 'base64');

  console.log(signature);

  res.send(signature);

})


//下单接口
//这个时候就要入库了
router.post('/getPrepayId', async function (req, res) {

  var { appid, amount, openid, nonceStr, timestamp, phone } = req.body;

  var orderNumber = getOrderNumber().toString();
  console.log(req.body);
  var total = parseInt(kyatsToRmb[amount]);
  var payment_data =
  {
    "mchid": "1628040916",
    "out_trade_no": orderNumber,
    "appid": appid,
    "description": "亚洲未来科技-话费充值-缅甸话费充值",
    "notify_url": "http://web.tcjy33.cn/notify",
    "amount": {
      "total": total,
      "currency": "CNY"
    },
    "payer": {
      "openid": openid
    }
  }
  const message = `POST\n/v3/pay/transactions/jsapi\n${timestamp}\n${nonceStr}\n{"mchid":"1628040916","out_trade_no":"${orderNumber}","appid":"${appid}","description":"亚洲未来科技-话费充值-缅甸话费充值","notify_url":"http://web.tcjy33.cn/notify","amount":{"total":${total},"currency":"CNY"},"payer":{"openid":"${openid}"}}\n`;



  console.log("message:", message);
  const signature = crypto.createSign('RSA-SHA256').update(message, 'utf-8').sign(fs.readFileSync('./pem/apiclient_key.pem').toString(), 'base64');
  const serial_no = process.env.SERIAL_NO;

  var config = {
    headers: {
      Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="1628040916",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="${serial_no}"`
    }
  }


  console.log("paymentdata", req.body);


  await axios.post("https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi", payment_data, config).then(function (response) {
    console.log("jsApi:", response.data);
    var { prepay_id } = response.data;

    //还要进行二次签名    
    //在这里进行入库
    //这个时候订单状态为 “未支付” （“等待发货“，”已发货“）

    let time = new Date().getTime();

    //下单分两个 一个是order 一个是用户里面
    //order

    var type = "话费充值";
    var topupAmount = rmbToKyats[amount - 1]+" Kyats"
    if (amount > 20)
    {
      type = "流量充值";
      let arrayMb = ["500MB","1000MB","1500MB","2000MB","3000MB","5000MB","10000MB","20000MB","30000MB"];
      topupAmount = arrayMb[amount-20 - 1];
    }
    orderModel.insertMany({
      user_Openid: openid,
      topup_Date: time,
      topup_Amount_Kyat: topupAmount,
      topup_Amount_Rmb: kyatsToRmb[amount],
      topup_Phone: phone,
      topup_Country: "Myanmar",
      topup_Order_No: orderNumber,
      topup_Order_State: "未支付",
      topup_Type: type,
    }, function (err, result) {
      if (err) return handleErr(err);

      console.log("Order Created Success");
    })

    //Userhistory

    var array_return = { prepay_id, signature };
    res.status(200).send(array_return);


  })
    .catch(function (error) {
      console.log("JsApi:", error);
    });


})

//支付成功的回调通知接口
//这个时候才写入数据库
router.post('/notify', async function (req, res) {


  console.log("充值成功", req.body);
  let key = process.env.API_KEY;  // 解密key 上面提到的商户keys（APIv3 secret）
  let nonce = req.body.resource.nonce;  // 加密使用的随机串
  let associated_data = req.body.resource.associated_data;  // 加密用的附加数据
  let ciphertext = req.body.resource.ciphertext;  // 加密体 base64

  // 解密 ciphertext字符  AEAD_AES_256_GCM算法
  ciphertext = Buffer.from(ciphertext, 'base64');
  let authTag = ciphertext.slice(ciphertext.length - 16);
  let data = ciphertext.slice(0, ciphertext.length - 16);
  let decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
  decipher.setAuthTag(authTag);
  decipher.setAAD(Buffer.from(associated_data));
  let decoded = decipher.update(data, null, 'utf8');
  decipher.final();
  let payData = JSON.parse(decoded); //解密后的数据

  console.log(payData);


  await orderModel.updateOne({ topup_Order_No: payData.out_trade_no }, {
    topup_Order_State: "等待发货"
  }).catch(err => {
    console.log("支付或许已完成，入库失败，订单不存在", err);
  })

  // sendSMS(`Customer Top Up Pls Check Admin \n Order :${payData}` );

  //发短信的接口，暂时取消
  // client.messages
  // .create({
  //    body: `Customer Top Up Pls Check Admin \n Order :${payData.out_trade_no}`,
  //    from: '+12135664368',
  //    to: '+9509664266940'
  //  })
  // .then(message => console.log(message)).catch(err => console.log(err));

  // console.log("SMS Message Send!!!");


  res.sendStatus(200);


})


router.get('/test', async function (req, res) {


  let result = await appModel.find({ user_Openid: "obbuZ6JG3-4APr8HbT4cH-8pIHls" });

  if (result == 0) console.log("empty");
  else
    console.log(result);

})


module.exports = router;