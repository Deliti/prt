<template>
  <div class="main-container">
      <nav-div></nav-div>
      <div class="main">
        <map-div class="map"></map-div>
        <aside class="right handle-area gray_3">
            <router-view class="child"></router-view>
        </aside>
      </div>
  </div>
</template>

<script>
import NavDiv from 'components/nav'
import MapDiv from 'pages/Main'
import { mapMutations } from 'vuex'
export default {
    methods:{
        ...mapMutations(['SETMAPFLAG']),
    },
    mounted(){
        window.addEventListener('beforeunload',this.sendMsg);
    },
    beforeDestroy(){
        window.removeEventListener('beforeunload',this.sendMsg)
    },
    components:{
      NavDiv,
      MapDiv
    },
    methods:{
        sendMsg(){
            return '您确定离开此页面吗'
        }
    }
}
</script>

<style lang="less" scoped>
@screen-md:1200px;
@screen-lg:1800px;
.main-container{
    width: 100%;
    height: 100%;
    .main{
        overflow: hidden;
        height: calc(~"100% - 40px");
    }
    .map{
        min-width: 660px;
        width: calc(~'100% - 300px') ;
        height: 100%; 
        @media (min-width:@screen-lg) {
            width: calc(~"100% - 450px")
        }
    }
    .handle-area{
        width: 300px;
        height: 100%;
        position: relative;
        @media (min-width:@screen-lg) {
            width: 450px;
        }
        .child{
            width: 100%;
            height: 100%;
        }
    }
}




</style>

