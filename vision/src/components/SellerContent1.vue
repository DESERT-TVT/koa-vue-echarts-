<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
// echarts.registerTheme('default', theme)
// import request from '../request/index'
// import { mapState } from 'vuex'
export default {
  data() {
    return {
      chartInstance: null,
      allDate: null,//服务器返回数据
      currentPage: 1,//当前显示的页数
      totalPage: 0, //一共多少页
      timerId: null //定时器标识
    }
  },
  created() {
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  destroyed() {
    clearInterval(this.timerId)
    // 清除监听
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('sellerData')
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  methods: {
    //初始化echartInstance对象
    initChart() {
      this.chartInstance = echarts.init(this.$refs.seller_ref, 'chalk')
      // 对图表初始化
      const initoption = {
        title: {
          text: '✘ 商家销售统计',
          left: 20,
          top: 20
        },
        grid: {
          top: '12%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true //距离加上坐标轴文字
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',

        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            z: 0,
            type: 'line',
            lineStyle: {
              type: 'solid',
              color: '#2D344'
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              color: 'white'

            },
            itemStyle: {
              //指明方向
              //指明百分比
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: 'white'
                },
                {
                  offset: 1,
                  color: 'blue'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initoption)
      // console.log(this.chartInstance);
      //对图表对象进行鼠标事件的监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    //获取服务器的数据
    getData(ret) {
      // const { data: ret } = await request({
      //   method: 'get',
      //   url: 'seller'
      // })
      this.allDate = ret
      //排序
      this.allDate.sort((a, b) => {
        return a.value - b.value
      })
      //每5个元素显示一页
      this.totalPage = this.allDate.length % 5 === 0 ? this.allDate.length / 5 : this.allDate.length / 5 + 1
      this.updateChart()
      this.startInterval()
    },
    //更新图表
    updateChart() {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allDate.slice(start, end)
      const sellerNames = showData.map((item) => {
        return item.name
      })
      const sellerValues = showData.map((item) => {
        return item.value
      })
      const dataoption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues,
          }
        ]
      }
      this.chartInstance.setOption(dataoption)

    },
    //定时更新
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },
    // 屏幕大小变化时,会调用方法
    screenAdapter() {
      // console.log(this.$refs.seller_ref.offsetWidth);
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      //分辨率配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          },
        },

        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              borderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      //手动调用resize()
      this.chartInstance.resize()
    }
  },
  // computed: {
  //   ...mapState(['theme'])
  // },
  // watch: {
  //   theme() {
  //     console.log('主题切换');
  //     this.chartInstance.dispose()//销毁当前图表
  //     this.initChart()
  //     this.screenAdapter()
  //     this.updateChart()
  //   }
  // }
}
</script>

<style lang="scss"></style>