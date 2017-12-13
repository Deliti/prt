<template>
    <section class="aside-menu-box gray_3 f_origin">
        <ul>
            <li 
                v-for="(item,index) in lineList" 
                :key="index" 
                class="square text"
                @click="focusLine(item.edgeId)" >{{item.name}}</li>
            <li class="text square add" v-if="!mapFlag" @click="addNew()"></li>
        </ul>
        <div class="right" @click="goBack()">
            返回
            <i class="return-btn"></i>
        </div>
        <div v-show="isHttp" class="hide-wrap">
            <div class="hide-loading"></div>
        </div>
    </section>
</template>

<script>
import router from '@/router'
import {mapState,mapMutations} from 'vuex';
import { getMaterial,addTrack,editTrack } from '@/service/getData'

export default {
    data(){
        return {
            lineList:[],
            isHttp:false
        }
    },
    computed:{
        ...mapState(['mapFlag'])
    },
    created(){
        this.getList();
        this.$root.eventHub.$on('addCountLine',this.addCountLine);
    },
    methods:{
        ...mapMutations(['SETEDITID']),
        async getList(){
            const params = {
                "eventId": this.$route.params.id, //事件id
                "materialType": 1
            }
            this.isHttp = true;
            const trackList = await getMaterial(params)
            if(trackList.result != 0){
                this.$message({
                        message: trackList.message,
                        type: 'warning',
                        duration: 2000
                })
                return false;
            }
            this.isHttp = false;
            this.lineList = trackList.detail[1].edgeList;
        },
        goBack(){
            window.history.go(-1);
        },
        addNew(){
            this.$message('请在地图上绘制轨道');
            this.$root.eventHub.$emit('openDrawer');
        },
        focusLine(id){  // 选中这条轨迹并进行编辑 
            this.$root.eventHub.$emit('foucsIt',{
                type:'line',
                id
            });
            router.push(`editLine?track=${id}`)
        },
        addCountLine(lines){
            this.getList(); 
        }
    }
}
</script>

<style lang="less"  scoped>
@screen-md:1200px;
@screen-lg:1800px;

.aside-menu-box{
    box-sizing: border-box;
    padding: 20px 40px 0;
    overflow-y: auto;
    ul{
        overflow-x: hidden;
        overflow-y: auto;
        padding: 5px 5px 0;
        li{
            width: 100px;
            height: 100px;
            margin-bottom:20px; 
            @media (min-width:@screen-lg) {
                 width: 150px;
                 height: 150px;
                 line-height: 150px;
            }
        }
        li:nth-child(even){
            float:right;
            position: relative;
        }
        li:nth-child(odd){
            float: left;
        }
    }
    .right{
        line-height: 30px;
        @media (min-width:@screen-lg) {
            line-height: 45px;
        }
        i{
            display: inline-block;
        }
    }
}
.text{
    text-align: center;
    line-height: 80px;
}
.add{
    background: url('../img/add.png') no-repeat center center;
    background-size: 50% 50%;
    cursor: pointer;
}
</style>

