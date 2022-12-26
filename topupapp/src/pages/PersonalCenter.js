import "./personalInfo.css"
import React, { useState,useEffect } from 'react'
import { List, Avatar, Space,Card } from 'antd-mobile'
import { ListItem } from "antd-mobile/es/components/list/list-item";

export default function PersonalCenter() {

    let [userName,setUserName] = useState("");
    let [userAvatar,setAvatar] = useState("");

    useEffect(() => {
      
        setUserName(window.nickname);
        setAvatar(window.img);
    
        console.log("img",window.img);
      
    }, [])
    

    return (
        <div className="personalCenter">
            <div >
                <List>
                    <List.Item
                        prefix={<Avatar src={userAvatar}/>}
                    >
                    <div className="personalInfo">
                        用户名称：{userName}
                    </div>

                    </List.Item>
                    <ListItem>
                    <Card style={{"fontSize":"x-large","textAlign":"center"}}>
                        更多扩展功能（等级系统，推广奖励机制，亲友赞助商特别通道）正在开发中!尽情期待！
                        目前本系统只支持缅甸话费充值，其他国家的小伙伴有兴趣可以联系我们一起合作、开发！
                    </Card>

                    </ListItem>
                </List>

            </div>
        </div>
    );

}