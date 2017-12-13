<template>
  <div id="app">
    <router-view style="width:100%"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style lang="less" scoped>
@screen-md:1200px;
@screen-lg:1800px;
</style>

<style>
@import 'common/css/reset.css';
@font-face {
  font-family: '圆体';
  src: url('common/font/font.ttf');
}
body{
  background: #000000;
}
#app{
  width: 100%;
  min-width: 1050px;
  height: 100%;
  position: relative;
  margin:0 auto;
}
</style>
