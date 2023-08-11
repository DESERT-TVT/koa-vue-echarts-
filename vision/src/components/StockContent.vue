<!-- 测试模板内容 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref">

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import request from '../request/index'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      timeId: null
    }
  },
  created() {
    //创建完成执行回调函数的注册
    this.$socket.registerCallBack('stockData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'stockData',
      chartName: 'stock',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成的时候, 主动进行屏幕的适配
    this.screenAdapter()

  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timeId)
  },
  methods: {
    //初始化
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme)
      const initOption = {
        title: {
          text: '👍 库存与销量分析',
          left: 20,
          top: 20
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timeId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取请求
    getData(ret) {
      // const { data: ret } = await request({
      //   methods: 'get',
      //   url: 'stock'
      // })
      this.allData = ret
      // console.log(this.allData);
      this.updateChart()
      this.startInterval()
    },
    // 更新图表
    updateChart() {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      // 处理数据
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          // radius: [60, 50],
          center: centerArr[index],
          hoverAnimation: false,
          labelLine: {
            show: false
          },
          label: {
            // show: false,
            formatter: () => {
              let str = `${item.name}\n${item.sales}`
              return str
            },
            position: 'center',

          },
          data: [
            {
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            {
              value: item.stock,
              itemStyle: {
                color: '#333845'
              }
            }
          ]
        }
      })
      const dataOption = {
        series: seriesArr

      }
      this.chartInstance.setOption(dataOption)

    },
    //屏幕适配
    screenAdapter() {
      const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
      const innerRadius = titleFontSize * 4
      const outterRadius = titleFontSize * 3
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [innerRadius, outterRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [innerRadius, outterRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [innerRadius, outterRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [innerRadius, outterRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [innerRadius, outterRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },

        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    //定时器切换
    startInterval() {
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      this.timeId = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        this.updateChart()//更新界面
      }, 5000)
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