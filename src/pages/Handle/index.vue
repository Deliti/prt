<template>
    <section class="">
        <div class="handletop f_origin">
            <div :class="path == 'mapData'?'f_origin':'f_white'" @click="change('mapData')">地图数据</div>
            <div :class="path == 'trackList'?'f_origin':'f_white'" @click="change('trackList')">轨道列表</div>
        </div> 
        <router-view></router-view>
    </section>
</template>

<script>
import router from '@/router'
import {mapState,mapMutations} from 'vuex'
export default {
    data(){
        return {
            path: 'mapData'
        }
    },
    methods:{
        ...mapMutations(['CHANGERUNSTATUS','SETHASCAR']),
        change(path){
            this.path = path;
            router.push(`/bigsimulator/${this.$route.params.id}/handle/${path}`)
        }
    }
}
</script>

<style lang="less" scoped>
@screen-md:1200px;
@screen-lg:1800px;

.handletop{
    display: flex;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    border-top: 2px solid #eee;
    border-bottom: 2px solid #eee;
    @media (min-width:@screen-lg) {
        height: 45px;
        line-height: 45px;
    }
    div{
        flex: 1;
        text-align: center;
    }
} 
</style>


