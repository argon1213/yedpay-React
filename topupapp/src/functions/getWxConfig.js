export function getWxConfig() {
    //判断signature是否过期
    if (expireSign()) {
      let data = {};
      data.appId = localStorage.getItem('appId');
      data.timestamp = localStorage.getItem('timestamp');
      data.nonceStr = localStorage.getItem('nonceStr');
      data.signature = localStorage.getItem('signature');
      setWxConfig(data);
    } else {
      //如果过期了，请求后台获取
      let url = location.href.split('#')[0]; //获取锚点之前的链接,防止出现invalid signature错误
      wxSign({ url: url })
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            localStorage.setItem('appId', res.data.appId);
            localStorage.setItem('timestamp', res.data.timestamp);
            localStorage.setItem('nonceStr', res.data.nonceStr);
            localStorage.setItem('signature', res.data.signature);
            localStorage.setItem('expireSignTime', res.data.expireTime);
            setWxConfig(res.data);
          } else {
            localStorage.removeItem('expireSignTime');
            Toast.fail('网络故障，请退出重新加载页面');
          }
        })
        .catch(error => {
          localStorage.removeItem('expireSignTime');
          Toast.fail('网络故障，请退出重新加载页面');
        });
    }
  }
  