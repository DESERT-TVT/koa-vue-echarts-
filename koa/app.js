// 服务器的入口文件
// 1.创建KOA的实例对象
// import Koa from 'koa';
const Koa = require('koa')
const app = new Koa()
// 2.绑定中间件
// 绑定第一层中间件
// import respDurationMiddleware from './middleware/koa_response_duration.js';
const respDurationMiddleware = require('./middleware/koa_response_duration')
app.use(respDurationMiddleware)
// 绑定第二层中间件
// import respHeaderMiddleware from './middleware/koa_response_header.js';
const respHeaderMiddleware = require('./middleware/koa_response_header')
app.use(respHeaderMiddleware)
// 绑定第三层中间件
// import respDataMiddleware from './middleware/koa_response_data.js';
const respDataMiddleware = require('./middleware/koa_response_data')
app.use(respDataMiddleware)
// 3.绑定端口号 8888
app.listen(8080)

const WebSocketServeice = require('./service/web_socket_service')

//开启监听
//当某个客户端连接成功,就会对这个客户端开始改造
WebSocketServeice.listen()