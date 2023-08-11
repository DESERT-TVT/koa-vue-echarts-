<!-- 测试模板内容 -->
<template>
  <div class="com-container">
    测试
    <div class="com-chart" ref="test_ref">

    </div>
  </div>
</template>

<script>

// import request from '../request/index'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null
    }
  },

  mounted() {
    this.initChart()
    this.getdata()
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成的时候, 主动进行屏幕的适配
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    //初始化
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.test_ref)
      const initOption = {}
      this.chartInstance.setOption(initOption)
    },
    // 获取请求
    async getdata() {
      // const { data: ret } = await request({
      //   methods: 'get',
      //   url: 'test'
      // })
      // this.allData = await ret
      this.updateChart()
    },
    // 更新图表
    updateChart() {
      const dataOption = {}
      this.chartInstance.setOption(dataOption)

    },
    //屏幕适配
    screenAdapter() {
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  },

}
</script>

<style lang="scss"></style>