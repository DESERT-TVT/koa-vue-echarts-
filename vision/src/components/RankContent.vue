<!-- 测试模板内容 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref">

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { color } from 'echarts'
// import request from '../request/index'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      startValue: 1,
      endValue: 9,
      TimeId: null
    }
  },
  created() {
    this.$socket.registerCallBack('rankData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getdata()
    this.$socket.send({
      action: 'getData',
      socketType: 'rankData',
      chartName: 'rank',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成的时候, 主动进行屏幕的适配
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.TimeId)
    this.$socket.unRegisterCallBack('mapData')
  },
  methods: {
    //初始化
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme)
      const initOption = {
        title: {
          text: '😦 地区销售排行',
          left: 20,
          top: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true

        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              color: arg => {
                if (arg.value > 300) {
                  return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgb(0, 221, 255)'
                    },
                    {
                      offset: 1,
                      color: 'rgb(77, 119, 255)'
                    }
                  ])
                } else if (arg.value > 200) {
                  return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgb(55, 162, 255)'
                    },
                    {
                      offset: 1,
                      color: 'rgb(116, 21, 219)'
                    }
                  ])
                } else {
                  return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgb(128, 255, 165)'
                    },
                    {
                      offset: 1,
                      color: 'rgb(1, 191, 236)'
                    }
                  ])
                }
              }

            },
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.TimeId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取请求
    getData(ret) {
      // const { data: ret } = await request({
      //   methods: 'get',
      //   url: 'rank'
      // })
      this.allData = ret
      // console.log(this.allData);
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      this.updateChart()
      this.startInterval()
    },
    // 更新图表
    updateChart() {
      // 省份名称数组
      const provinceArr = this.allData.map(item => {
        return item.name
      })
      //所有省份对应的销售金额
      const ValueArr = this.allData.map(item => {
        return item.value
      })
      const dataOption = {
        xAxis: {
          data: provinceArr
        },
        series: [
          {
            data: ValueArr
          }
        ],
        //动画
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        }
      }
      this.chartInstance.setOption(dataOption)

    },
    //屏幕适配
    screenAdapter() {
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      // console.log(titleFontSize);
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: 'bar',//必要,更新series他不会重新设置
            barWidth: titleFontSize,
            itemStyle: {
              //这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    //控制动画
    startInterval() {
      if (this.TimeId) {
        clearInterval(this.TimeId)
      }
      this.TimeId = setInterval(() => {
        this.startValue++,
          this.endValue++,
          this.updateChart()
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 1,
            this.endValue = 9
        }
      }, 2000)
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme() {
      // console.log('主题切换了')
      this.chartInstance.dispose() // 销毁当前的图表
      this.initChart() // 重新以最新的主题名称初始化图表对象
      this.screenAdapter() // 完成屏幕的适配
      this.updateChart() // 更新图表的展示
    }
  }
}
</script>

<style lang="scss"></style>