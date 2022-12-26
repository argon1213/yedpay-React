/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Navigation.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: austin0072009 <2001beijing@163.com>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/07/15 00:03:55 by austin00720       #+#    #+#             */
/*   Updated: 2022/07/15 00:03:55 by austin00720      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Link,useLocation,useNavigate,Outlet } from "react-router-dom";
import { Badge, TabBar,Card } from 'antd-mobile';
import {
  AppOutline,
  MessageOutline,
  MessageFill,
  UnorderedListOutline,
  BillOutline,
  UserOutline,
} from 'antd-mobile-icons';
import { useState } from "react";

export default function Navigation (){

    const location = useLocation();
    const { pathname } = location;
    const navigate = useNavigate();
    const setRouteActive = (value) => {
      navigate(value);
      console.log(value);
      setActiveKey(value);
      if (value == "home")
      {
        navigate("/")
      }
    }
  
    const tabs = [
      {
        key: 'home',
        title: '首页',
        icon: <AppOutline />,
        badge: Badge.dot,
      },
      {
        key: 'record',
        title: '充值记录',
        icon:<BillOutline />,
        badge: '5',
      },
      // {
      //   key: 'message',
      //   title: '我的消息',
      //   icon: (active: boolean) =>
      //     active ? <MessageFill /> : <MessageOutline />,
      //   badge: '99+',
      // },
      {
        key: 'personalCenter',
        title: '个人中心',
        icon: <UserOutline />,
      },
    ]
    const [activeKey, setActiveKey] = useState('home');


    return(
        <div className="Nav">
        <TabBar activeKey={activeKey} onChange={value => setRouteActive(value)}>
        {tabs.map(item => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
      </div>
    )
}