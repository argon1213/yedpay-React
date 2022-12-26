 //先引入mongoose模块
var mongoose = require("mongoose");
 //连接数据库服务器

var url = process.env.DB_HOST;
 
 mongoose.connect(url, function (error) {
     if (error) {
         console.log("数据库连接失败")
     } else {
         console.log("数据库连接成功")
     }
 })
 //导出
 module.exports = mongoose;
 