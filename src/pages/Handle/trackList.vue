<template>
    <section class="parent">
        <div class="tips-title gray_2 f_origin">
            全部轨道列表
        </div>
        <section class="aside-menu-box gray_3 f_origin">
            <ul>
                <li 
                    v-for="(item,index) in trackList" 
                    :key="index" 
                    class="square text"
                    @click="foucs(item)" >{{item.name}}</li>
            </ul>
        </section>
    </section>
</template>

<script>
import router from '@/router'
import {mapState,mapMutations} from 'vuex'
import { queryTrackAll } from '@/service/getData'

const pageSize = 20;
export default {
    data(){
        return {
            trackList: [],
            pageNo: 0,
            pages: 1
        }
    },
    computed:{
        ...mapState(['mapFlag','runStatus','hasCar']),
    },
    mounted(){
        this.getList();
    },
    beforeDestroy(){
        this.pageNo = 0;
        this.pages = 1;
    },
    components:{
    },
    methods:{
        ...mapMutations(['CHANGERUNSTATUS','SETHASCAR']),
        async getList(){
            const params = {
                eventId	: this.$route.params.id,
                pageIndex : this.pageNo,
                pageSize
            }
            const trackData = await queryTrackAll(params);
            if(trackData.result != 0){
                this.$message({
                    trackData,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            const { pageNo,pages,detail } = trackData;
            const { edgeCount,edgeList } = detail;
            this.pageNo = pageNo;
            this.pages = pages;
            this.trackList.push(...edgeList);
        },
        foucs(item){
            const { edgeId,dst,src } = item;
            this.$root.eventHub.$emit('foucsItV2',{
                id: edgeId,
                dst: [dst.longitude,dst.latitude],
                src: [src.longitude,src.latitude]
            });
        }
    }
}
</script>

<style lang="less" scoped>
@screen-md:1200px;
@screen-lg:1800px;

.tips-title{
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    padding-left: 50px;
    border-top: 2px solid #eee;
    border-bottom: 2px solid #eee;
    @media (min-width:@screen-lg) {
        height: 45px;
        line-height: 45px;
    }
}
.aside-menu-box{
    box-sizing: border-box;
    height: 100%;
    padding: 50px 40px 0;
    overflow-y: auto;
    ul{
        overflow: hidden;
        li{
            width: 80px;
            height: 80px;
            margin-bottom:20px; 
            @media (min-width:@screen-lg) {
                 width: 150px;
                 height: 150px;
                 line-height: 150px;
            }
            &:nth-child(even){
                float:right;
            }
            &:nth-child(odd){
                float: left;;
            }
        }
        .text{
            text-align: center;
            line-height: 80px;
        }
    }
}
</style>


