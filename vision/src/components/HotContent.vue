
<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref">
    </div>
    <span class="iconfont arr-left" @click="toLift" :style="comStyle">&#xe6eb;</span>
    <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ee;</span>
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
// import request from '../request/index'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,//当前一级分类
      titleFontSize: 0
    }
  },
  created() {
    // 在组件创建完成之后 进行回调函数的注册
    this.$socket.registerCallBack('hotData', this.getData)
  },
  computed: {
    catName() {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  },
  mounted() {
    this.initChart()
    // this.getdata()
    this.$socket.send({
      action: 'getData',
      socketType: 'hotData',
      chartName: 'hot',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成的时候, 主动进行屏幕的适配
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('hotData')
  },
  methods: {
    //初始化
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme)
      const initOption = {
        title: {
          text: '🕴 热销商品的占比统计',
          left: 20,
          top: 20
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: arg => {
            // console.log(arg);
            const thirdCategory = arg.data.children
            let total = 0
            thirdCategory.forEach(item => {
              total += item.value
            })
            let retStr = ''
            thirdCategory.forEach(item => {
              retStr += `
              ${item.name}:${parseInt(item.value / total * 100) + '%'}<br/>
              `
            })
            return retStr
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取请求
    getData(ret) {
      // const { data: ret } = await request({
      //   methods: 'get',
      //   url: 'hot'
      // })
      this.allData = ret
      // console.log(1);
      // console.log(this.allData);
      this.updateChart()
    },
    // 更新图表
    updateChart() {
      const legendData = this.allData[this.currentIndex].children.map(item => {
        return item.name
      })
      const seriesData = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      const dataOption = {
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstance.setOption(dataOption)

    },
    //屏幕适配
    screenAdapter() {
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        lengend: {
          itemWidth: this.titleFontSize,
          itemHeith: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            radius: this.titleFontSize * 5.5,
            center: ['50%', '50%']
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    toLift() {
      if (this.currentIndex == 0) {
        this.currentIndex = this.allData.length - 1
      } else {
        this.currentIndex--
      }
      this.updateChart()
    },
    toRight() {
      if (this.currentIndex == this.allData.length - 1) {
        this.currentIndex = 0
      } else {
        this.currentIndex++
      }
      this.updateChart()
    },
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

<style lang="scss">
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}

.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}

.cat-name {
  position: absolute;
  left: 80%;
  bottom: 10%;
  color: white;
}
</style>
