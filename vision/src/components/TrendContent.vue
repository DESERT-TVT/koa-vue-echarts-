<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '📕' + showTitle }}</span>
      <span class="title-icon" :style="comStyle" @click="showChoice = !showChoice">↓</span>
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div class="select-item" v-for="item in selectTyeps" :key="item.key" @click="handleSelect(item.key)">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
// import * as echarts from 'echarts';
// import request from '../request/index'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      showChoice: null,//是否显示可选项
      choiceType: 'map',//数据类型
      titleFontSize: 0 //标题大小
    }
  },
  created() {
    //创建完成执行回调函数的注册
    this.$socket.registerCallBack('trendData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    // 发送数据给服务器
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    //改变时候调用
    window.addEventListener('resize', this.screenAdapter)
    //初始化调用
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    //在组建销毁时注销
    this.$socket.unRegisterCallBack('trendData')
  },
  computed: {
    selectTyeps() {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle() {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    // 设置标题样式
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize + 'px'
      }
    },
    ...mapState(['theme'])
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, this.theme)
      const initoption = {
        grid: {
          left: '3%',
          top: '%35',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(initoption)
    },
    //服务器发送给客户端的数据
    getData(ret) {
      // const { data: ret } = await request({
      //   method: 'get',
      //   url: 'trend'
      // })
      this.allData = ret
      //await this.$http.get()

      this.updateChart()
    },
    updateChart() {

      // 数据进行处理
      // x timeArr类目轴
      // console.log(this.allData);
      const timeArr = this.allData.common.month
      // y series下的数据
      const valueArr = this.allData[this.choiceType].data
      const seriesArr = valueArr.map((item) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.choiceType,
          areaStyle: {}
        }
      })
      //图例的数据
      const legendArr = valueArr.map(item => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      // console.log(this.$refs.seller_ref.offsetWidth);
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      //分辨率配置项
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeigth: this.titleFontSize,
          itemGap: this.titleFontSize,
          fontSize: this.titleFontSize / 2
        }
      }
      this.chartInstance.setOption(adapterOption)
      //手动调用resize()
      this.chartInstance.resize()
    },
    handleSelect(currentType) {
      this.choiceType = currentType
      this.updateChart()
      this.showChoice = false
    }
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
.title {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  color: white;

  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }

  .select-con {
    background-color: #222733;
  }
}
</style>