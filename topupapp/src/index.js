/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: austin0072009 <2001beijing@163.com>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/07/15 00:01:11 by austin00720       #+#    #+#             */
/*   Updated: 2022/08/18 01:45:16 by austin00720      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import Expenses from "./routes/expenses";
import Invoices from "./routes/invoices";
import Home from "./pages/Home";
import Record from "./pages/Record";
import PersonalCenter from "./pages/PersonalCenter";
import "./index.css"

var useragent = navigator.userAgent;
if (useragent.match(/MicroMessenger/i) != 'MicroMessenger') {
    // 这里警告框会阻塞当前页面继续加载
    // 以下代码是用javascript强行关闭当前页面
    alert("已禁止本次访问：您必须使用微信内置浏览器访问本页面！");
    window.location.href = "https://www.tcjy33.cn"
}
else{
const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <BrowserRouter>
    <Routes >
      <Route path="/" element={<App />}>
        <Route index element={<Home/>}/>
        <Route path="Record" element = {<Record/>}/>
        <Route path="personalCenter" element ={<PersonalCenter/>}/>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>Error : wrong index</p>
            </main>
          }
        />

      </Route>
    </Routes>
  </BrowserRouter>
);
        }