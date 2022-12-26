/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: austin0072009 <2001beijing@163.com>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/07/15 00:00:42 by austin00720       #+#    #+#             */
/*   Updated: 2022/08/17 16:59:36 by austin00720      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Link, useLocation, useSearchParams, Outlet } from "react-router-dom";
import Navigation from "./pages/Navigation";
import "./App.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { appid, secret } from "./config/index";
import wx from 'weixin-js-sdk';
import { Modal } from "antd-mobile";
import { ExclamationCircleFill } from 'antd-mobile-icons';
import useCookie from 'react-use-cookie';;




//paraName 等找参数的名称
function GetUrlParam(paraName) {
    var url = window.location.href.toString();
    var arrObj = url.split("?");

    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var arr;

        for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");

            if (arr != null && arr[0] == paraName) {
                return arr[1];
            }
        }
        return "";
    }
    else {
        return "";
    }
}

export default function App() {


    //const params = new URLSearchParams(window.location.href);
    console.log(window.location);
    //console.log(GetUrlParam("code"));
    window.austin = "austin0072009";
    window.code = GetUrlParam("code");

    let [init, setInit] = useState(false);
    let [userOpenId, setOpenId] = useCookie("openid", "0");
    let [userImg, setImg] = useCookie("headimg", "0");
    let [userNickname, setNickname] = useCookie("nickname", "0");




    async function exchangeCode() {

        //Step1 code换取openid

        var backendUrl = "http://web.tcjy33.cn/exchangeCode"
        console.log("code", window.code);


        var result = await axios.post(backendUrl, {
            appid: appid,
            secret: secret,
            code: window.code
        }).then(function (response) {
            console.log(response);
            return response.data;
        })
            .catch(function (error) {
                console.log(error);
            });

        console.log("result is ", result);
        window.nickname = result.nickname;
        window.img = result.headimgurl;
        window.openid = result.openid;
        setOpenId(result.openid);
        setImg(result.headimgurl);
        setNickname(result.nickname);

        return result.openid;

    };

    useEffect(() => {
        console.log("author", window.austin);
       


        async function initWechat() {
            let url = encodeURIComponent(window.location.href.split("#")[0]);
            await axios.get(`http://web.tcjy33.cn/jsapi?url=${url}`).then((result) => {

                let {
                    appId,
                    timestamp,
                    nonceStr,
                    signature
                } = result.data;
                console.log(result.data);
                window.signature = signature;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
                    appId, // 必填，公众号的唯一标识
                    timestamp, // 必填，生成签名的时间戳
                    nonceStr, // 必填，生成签名的随机串
                    signature, // 必填，签名
                    jsApiList: [
                        'scanQRCode',
                        'chooseWXPay'

                    ] // 必填，需要使用的 JS 接口列表
                });
            });
        }


        async function userAdd() {
            var { openid, access_token } = await exchangeCode();
            var user_Openid = openid;
            var userAdd_url = "http://web.tcjy33.cn/users/add";

            var result = await axios.post(userAdd_url, {
                user_Openid: user_Openid,
                user_Access_token: access_token,
            }).then((res) => {
                console.log(res);
                return res;
            })

        }


        // setOpenId(exchangeCode());
        // console.log("getOpenId",openid);

        // userAdd();

        if (!init) {

            initWechat();
            if (userOpenId == "0")
                exchangeCode();
            else {

                window.nickname = userNickname;
                window.img = userImg;
                window.openid = userOpenId;



            }

            Modal.alert({
                content: <div className="Alert">重要声明：切勿随便帮陌生人充值，
                    一旦充值成功，无法退款！
                    如有陌生人威胁您给他充值，请立即报警，如您因帮陌生人充值上当受骗，本平台不承担任何法律责任！
                </div>
                ,
                closeOnMaskClick: true,
                header: (
                    <ExclamationCircleFill
                        style={{
                            fontSize: 64,
                            color: 'var(--adm-color-warning)',
                        }}
                    />
                ),
                title: '注意',

            })

            setInit(true);

        }


    }, []);




    return (
        <div className="App">
            <div className="RollingContent">
                <h1 className="Title">话费充值中心</h1>


                <Outlet />
            </div>
            <div className="Footer">
                <Navigation />
            </div>
        </div>
    );
}