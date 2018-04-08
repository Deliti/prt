<template>
    <section class="parent">
        <section class="aside-menu-box gray_3 f_origin" id="trackListId">
            <ul id="trackListSlide">
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
let canQuery = true;
const pageSize = 20;
export default {
    data(){
        return {
            trackList: [],
            pageNo: 0,
            pages: 1,
            edgeCount: 0
        }
    },
    computed:{
        ...mapState(['mapFlag','runStatus','hasCar']),
    },
    mounted(){
        this.initAction();
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
        initAction(){
            const listWrap = document.querySelector('#trackListId');
            const listSlide = document.querySelector('#trackListSlide'); 
            listWrap.addEventListener('scroll',(e) => {
                if(listWrap.scrollTop + listWrap.clientHeight > listSlide.offsetHeight){
                    if(this.trackList.length < this.edgeCount && canQuery){
                        this.pageNo++;
                        this.getList();
                    }
                }
            })
        },
        async getList(){
            const params = {
                eventId	: this.$route.params.id,
                pageIndex : this.pageNo,
                pageSize
            }
            canQuery = false;
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
            this.pages = pages;
            this.edgeCount = edgeCount;
            this.trackList.push(...edgeList);
            canQuery = true;
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
.parent{
    height: calc(~"100% - 30px");
}
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


