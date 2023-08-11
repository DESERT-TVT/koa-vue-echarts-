<!-- 测试模板 -->
<template>
  <div class="com-page">
    <Test></Test>
  </div>
</template>

<script>
import Test from '@/components/TestContent.vue'
export default {
  data() {
    return {

    }
  },
  components: {
    Test: Test
  }
}
</script>

<style lang="scss"></style>
<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="headerSrc" alt="">
      </div>
      <span class="logo">
        <img :src="logoSrc" alt="" />
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img :src="themeSrc" class="qiehuan">
        <span class="datetime">2049-01-01 00:00:00</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullScreen' : '']">
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <div class="resize ">
            <span :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-compress-alt']"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullScreen' : '']">
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-compress-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[fullScreenStatus.map ? 'fullScreen' : '']">
          <!-- 商家分布图表 -->
          <Map ref="map"></Map>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.map ? 'icon-compress-alt' : 'icon-compress-alt']"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullScreen' : '']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-compress-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullScreen' : '']">
          <!-- 热销商品占比图表 -->
          <Hot></Hot>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-compress-alt']"></span>
          </div>
        </div>
        <div id="right-bottom fullScreen" :class="[fullScreenStatus.stock ? 'fullScreen' : '']">
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-compress-alt']"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>