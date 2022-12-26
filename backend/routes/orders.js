/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   orders.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: austin0072009 <2001beijing@163.com>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/07/17 15:36:22 by austin00720       #+#    #+#             */
/*   Updated: 2022/07/17 15:36:22 by austin00720      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

var express = require('express');
var router = express.Router();
var orderModel = require("../lib/orderModel");


//测试使用接口
// router.get('/create', function (req, res, next) {


//     orderModel.create({
//         user_Name: "Test1",
//         topup_Date: "20220704",
//         topup_Amount_Kyat: "20000",
//         topup_Amount_Rmb: "100",
//         topup_Phone:"09652800280",
//         topup_Country:"Myanmar"
//     },function(err,result){
//         if (err) return handleErr(err);

//         res.send(result);
//     })




// });

router.post('/add', function (req, res, next) {


    orderModel.insertMany({
        user_Name: req.body.user_Name,
        topup_Date: req.body.topup_Date,
        topup_Amount_Kyat: req.body.topup_Amount_Kyat,
        topup_Amount_Rmb: req.body.topup_Amount_Rmb,
        topup_Phone: req.body.topup_Phone,
        topup_Country: req.body.topup_Country,
        topup_Order_No: req.body.topup_Order_No,
        topup_Order_State: "Unpaid"
    },function(err,result){
        if (err) return handleErr(err);

        res.status(200).send("Order Created Success");
    })




});


router.get("/all",function(req,res){

    orderModel.find({},function(err,result){
        console.log(result);
        res.send(result);
    })
});


router.get("/user/:openid/:count",async function(req,res){

    console.log(req.params);

    let result = await orderModel.find({user_Openid:req.params.openid},null,{limit:req.params.count,sort:{topup_Date:-1}}).catch(err=>{
        console.log("find order failed",err);
    }).then(res=>{
        return res;
    })
    
    res.status(200).send(result);


});

module.exports = router;