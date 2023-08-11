export default class SocketService {

  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }
  //和服务器连接的socket对象
  ws = null
  //处理回调函数
  callBackMapping = {}

  //是否连接成功
  connected = false
  //记录从尝试时间
  sendRetryCount = 0
  //重新连接尝试次数
  connectRetryCount = 0
  //定义连接服务器代码
  connect() {
    //连接服务器
    if (!window.WebSocket) {
      return console.log("你的浏览器不支持");
    } else {
      this.ws = new WebSocket('ws://localhost:9998')
      //数据连接成功
      this.ws.onopen = () => {
        console.log("连接服务器成功1");
        this.connected = true
        this.connectRetryCount = 0
      }
      //1.连接服务器失败
      //2.当连接成功服务器关闭也会调用onclose
      this.ws.onclose = () => {
        console.log("连接服务器失败");
        this.connectRetryCount++
        this.connected = false
        setTimeout(() => {
          this.connect()
        }, 800 * this.connectRetryCount)


      }
      this.ws.onmessage = msg => {
        console.log("接收数据");
        //真正的数据在data里面
        // console.log(msg.data);
        const recvData = JSON.parse(msg.data)
        // console.log(recvData.action);
        const socketType = recvData.socketType
        // 判断回调函数是否存在
        if (this.callBackMapping[socketType]) {
          const action = recvData.action
          console.log(1);
          if (action === 'getData') {
            // console.log(1);

            const realData = JSON.parse(recvData.data)
            console.log(realData);
            this.callBackMapping[socketType].call(this, realData)
          } else if (action === 'fullScreen') {
            this.callBackMapping[socketType].call(this, recvData)
          } else if (action === 'themeChange') {
            this.callBackMapping[socketType].call(this, recvData)
          }
        }
      }
    }
  }
  // 回调注册
  registerCallBack(socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }
  //取消回调
  unRegisterCallBack(socketType) {
    this.callBackMapping[socketType] = null
  }
  //传输数据
  send(data) {
    //判断是否连接成功
    if (this.connected) {
      // console.log(1);
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      setTimeout(() => {
        // console.log(1);
        this.send(data)
      }, this.sendRetryCount + 500)
    }

  }
}