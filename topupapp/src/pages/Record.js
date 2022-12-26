import "./Record.css"
import React, { useState, useEffect } from 'react'
import { PullToRefresh, List } from 'antd-mobile'
// import { mockRequest } from "../components/mockRequest";
import axios from 'axios';
import moment from "moment";

export default function Record() {

    let [data, setData] = useState([]);
    let [dataNum,setDataNum] = useState(5);
    let [hasMore, setHasMore] = useState(true);
    // async function loadMore() {
    //     const append = await mockRequest()
    //     setData(val => [...val, ...append])
    //     setHasMore(append.length > 0)
    // }
    async function loadOrder() {

        console.log("fetching!");
    }

    async function fetchData(count) {


        //拉取数据
       // let fetchUrl = `http://web.tcjy33.cn/orders/user/${window.openid}/${count}`;
       let fetchUrl = `/orders/user/${window.openid}/${count}`;

        let result = await axios.get(fetchUrl).catch(err => {
            console.log(err)
        });

        console.log("data", result.data);

        setData(result.data);
        setDataNum(dataNum => dataNum+5);


    }

    useEffect(() => {


        fetchData(dataNum);



    }, [])


    return (
        <div className="record">
            <PullToRefresh

                onRefresh={async () => {
                    fetchData(dataNum);
                }}

            >
                <List header="充值记录">

                    {data.map((item, index) => (
                        <List.Item key={index}>下单时间：{moment((parseInt(item.topup_Date))).format("YYYY-MM-DD HH:mm:ss")
                        } <br />充值量： {item.topup_Amount_Kyat}   类型： {item.topup_Type}<br /> 充值手机：{item.topup_Phone} <br /> 状态：{item.topup_Order_State} </List.Item>
                    ))}


                </List>
                {/* <InfiniteScroll  loadMore={loadOrder} hasMore={hasMore} /> */}

            </PullToRefresh>
        </div>
    );

}