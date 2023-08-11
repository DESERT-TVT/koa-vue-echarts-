const WebSocket = require('ws')
const path = require('path')
const fileUtils = require('../utils/file_utils')
const wss = new WebSocket.Server({
  port: 9998
})
//开启监听
module.exports.listen = () => {
  //对客户端的连接事件进行监听
  wss.on('connection', client => {
    console.log('有客户的连接成功');
    //对客户端的连接对象进行message事件监听n
    //msg:由客户端发给服务器数据
    client.on('message', async msg => {
      console.log('客服端发送数据给服务端:' + msg);
      let payload = JSON.parse(msg)
      const action = payload.action
      if (action === 'getData') {
        // console.log(1);
        let filePath = '../data/' + payload.chartName + '.json'
        payload.charName
        filePath = path.join(__dirname, filePath)
        const ret = await fileUtils.getFileJsonData(filePath)
        //需要在服务端获取到数据的基础之上
        //data所对应的值,就是json文件的内容
        payload.data = ret
        client.send(JSON.stringify(payload))
      } else {
        //返回给每一个连接客户端
        // console.log('1');
        wss.clients.forEach(client => {
          client.send(msg)
        }) //所有客户端的数组
      }
      //服务端向客服端发送数据
      // client.send('hello secket from backend')
    })
  })
}

