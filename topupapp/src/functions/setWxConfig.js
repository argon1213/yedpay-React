export function setWxConfig(data) {
    console.log(data);
    wx.config({
      debug: false, // true是开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: data.appId, // 必填，公众号的唯一标识
      timestamp: data.timestamp, // 必填，签名的时间戳，后台生成的
      nonceStr: data.nonceStr, // 必填，签名的随机串，后台生成的
      signature: data.signature, // 必填，签名，后台生成的
      jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表，scanQRCode是调用扫一扫二维码
    });
    wx.error(function(res) {
      localStorage.removeItem('expireSignTime');
      Toast.fail('网络故障，请退出重新页面');
    });
  }
  