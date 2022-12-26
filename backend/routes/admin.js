const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSMongoose = require('@adminjs/mongoose')


var mongooseDb = require("../lib/mongoose");
var tickets = require('../lib/ticketModel');
var orders = require("../lib/orderModel");

AdminJS.registerAdapter(AdminJSMongoose)

// const adminJs = new AdminJS({
//   databases: [mongooseDb],
//   rootPath: '/admin',
// })
const contentParent = {
  name: '业务操作',
  icon: 'Accessibility',
}

const adminJsOptions = {
  databases: [mongooseDb],
  rootPath: '/jgdashuaige',
  resources: [
    // { resource: tickets, options: { parent: contentParent } },
    { resource: orders, options: { parent: contentParent ,listProperties: ['topup_Order_No','topup_Date','topup_Type','topup_Amount_Kyat',
  'topup_Amount_Rmb','topup_Phone','topup_Order_State'] } },
  ],
  locale: {
    translations: {
      labels: {
        orders: '订单'
      }
    }
  },
}

const adminJs = new AdminJS(adminJsOptions);



const router = AdminJSExpress.buildRouter(adminJs);
module.exports = router;
