//引入mongoose.js文件
var mongoose = require("./mongoose.js")
//定义schema
var schema = mongoose.Schema

const tickets = new schema({
   
    access_token: String,
    token_time: String, // 获取token的时间
    ticket: String,
    ticket_time:String
})
//导出
module.exports = tickets;