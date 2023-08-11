<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref">
    </div>
  </div>
</template>

<script>
// import request from '../request/index'
import { mapState } from 'vuex'
import china from '../../public/static/china.json'
import { getProvinceMapInfo } from '../utils/map_utils'
import axios from 'axios'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      mapData: {} // 所获取的省份的地图矢量数据
    }
  },
  created() {
    // 在组件创建完成之后 进行回调函数的注册
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getdata()
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成的时候, 主动进行屏幕的适配
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('mapData')
  },
  methods: {
    //初始化
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)

      this.$echarts.registerMap("china", china)
      const initOption = {
        title: {
          text: '❤商家分布',
          left: 20,
          top: 20
        },
        geo: {
          nameMap: {
            China: '中国',
          },
          map: 'china',
          top: '5%',
          bottom: '5%',
          areaColor: '#2E72BF',
          borderColor: '#333'
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async (arg) => {
        // console.log(arg.name);
        const argN = arg.name.substring(0, 2)
        const ProvinceInfo = getProvinceMapInfo(argN)
        // console.log(ProvinceInfo);
        //获取地图矢量数据
        if (ProvinceInfo.key !== undefined) {
          if (!this.mapData[ProvinceInfo.key]) {
            const ret = await axios.get('http://localhost:9000' + ProvinceInfo.path)
            // console.log(ret.data);
            this.mapData[ProvinceInfo.key] = ret.data
            this.$echarts.registerMap(ProvinceInfo.key, ret.data)
          }
          const changeOption = {
            geo: {
              map: ProvinceInfo.key
            }
          }
          this.chartInstance.setOption(changeOption)
        }
      })
    },
    // 获取请求
    getData(ret) {
      // const { data: reg } = await request({
      //   method: 'get',
      //   url: 'map'
      // })
      console.log(ret);
      this.allData = ret
      // console.log(this.allData);
      this.updateChart()
    },
    // 更新图表
    updateChart() {
      //需要处理数据
      //图例的数据
      const legendArr = this.allData.map(item => {
        return item.name
      })
      const seriesArr = this.allData.map(item => {
        //用散点要坐标
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 8,
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr,

      }
      this.chartInstance.setOption(dataOption)

    },
    //屏幕适配
    screenAdapter() {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    //双击事件
    revertMap() {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
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