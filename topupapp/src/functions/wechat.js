import wx from 'weixin-js-sdk' // 引入微信js-sdk
import http from '@/utils/axios.js'; //接口请求封装

class AuthWechat {

	signLink() {
		if (typeof window.entryUrl === 'undefined' || window.entryUrl === '') {
			window.entryUrl = document.location.href
		}
		return /(Android)/i.test(navigator.userAgent) ? document.location.href : window.entryUrl;
	}
	
	// 当前是否是微信环境
	isWeixin() {
		return navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
	}

	/**
	 * 初始化wechat(分享配置)
	 */
	wechat() {
		return new Promise((resolve, reject) => {
			let url = this.signLink()
			http.post('Users/shareSign', {
				url: url
			}).then(res => {
				if (res.code == 200) {
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: res.data.appId, // 必填，公众号的唯一标识
						timestamp: res.data.timestamp, // 必填，生成签名的时间戳
						nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
						signature: res.data.signature, // 必填，签名
						jsApiList: [
							'updateAppMessageShareData', // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
							'updateTimelineShareData', // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
							'scanQRCode', // 扫一扫
							'getLocation', // 获取地理位置
							'openLocation', // 使用微信内置地图查看位置接口
							'chooseImage', //拍照或从手机相册中选图接口
							'closeWindow', //关闭当前网页窗口接口
						]
					})
					wx.ready(res => {
						// 微信SDK准备就绪后执行的回调。
						resolve(wx, res)
					})
					wx.error(err => {
						reject(wx, err)
					})
				}
			})
		})
	}

	// 微信分享
	wxShare(shareObj) {
		this.wechat().then((wx, res) => {
			wx.ready(() => {
				wx.updateAppMessageShareData({
					title: shareObj.title, // 分享标题
					link: shareObj.link, // 分享链接
					desc: shareObj.desc, // 分享描述
					imgUrl: shareObj.imgUrl,
					success: function() {},
					cancel: function() {}
				});
				wx.updateTimelineShareData({
					title: shareObj.title, // 分享标题
					link: shareObj.link, // 分享链接
					desc: shareObj.desc, // 分享描述
					imgUrl: shareObj.imgUrl,
					success: function() {},
					cancel: function() {}
				});
			})
		})
	}


	// 扫一扫
	scanQRCode() {
		return new Promise((resolve, reject) => {
			this.wechat().then((wx, res) => {
				this.toPromise(wx.scanQRCode, {
					needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
					scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
				}).then(res => {
					resolve(res);
				}).catch(err => {
					reject(err);
				});
			})
		})
	}

	// 获取地理位置接口
	getLocation() {
		return new Promise((resolve, reject) => {
			this.wechat().then((wx, res) => {
				this.toPromise(wx.getLocation, {
					type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				}).then(res => {
					resolve(res);
				}).catch(err => {
					reject(err);
				});
			})
		})
	}

	// 使用微信内置地图查看位置接口
	openLocation(data) {
		return new Promise((resolve, reject) => {
			this.wechat().then((wx, res) => {
				this.toPromise(wx.openLocation, {
					latitude: data.latitude, // 纬度，浮点数，范围为90 ~ -90
					longitude: data.longitude, // 经度，浮点数，范围为180 ~ -180。
					name: '', // 位置名
					address: '', // 地址详情说明
					scale: 1, // 地图缩放级别,整型值,范围从1~28。默认为最大
					infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
				}).then(res => {
					resolve(res);
				}).catch(err => {
					reject(err);
				});
			})
		})
	}
	
	// 拍照或从手机相册中选图接口
	chooseImage() {
		return new Promise((resolve, reject) => {
			this.wechat().then((wx, res) => {
				this.toPromise(wx.chooseImage, {
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				}).then(res => {
					resolve(res);
				}).catch(err => {
					reject(err);
				});
			})
		})
	}
	
	// 关闭当前网页窗口接口
	closeWindow() {
		this.wechat().then((wx, res) => {
			wx.ready(() => {
				wx.closeWindow();
			})
		})
	}
	
	

	toPromise(fn, config = {}) {
		return new Promise((resolve, reject) => {
			fn({
				...config,
				success(res) {
					resolve(res);
				},
				fail(err) {
					reject(err);
				},
				complete(err) {
					reject(err);
				},
				cancel(err) {
					reject(err);
				}
			});
		});
	}
	// 如果你需要添加新的方法，请查下步骤5
}


export default new AuthWechat();

