<template>
    <section class="aside-menu-box gray_3 f_origin">
        <ul>
            <li 
                v-for="(item,index) in stationList" 
                :key="index" 
                class="square text"
                @click="focusIt(item.id)" >{{item.name}}</li>
            <li class="add square text" v-show="!mapFlag" @click="linkToNew()"></li>
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
import { getMaterial } from '@/service/getData'

export default {
    data(){
        return {
            stationList:[],
            isHttp:false
        }
    },
    computed:{
        ...mapState(['mapFlag'])
    },
    created(){
        this.getList()
    },
    methods:{
        ...mapMutations(['SETSTAEDITID']),
        async getList(){
            const params = {
                "eventId": this.$route.params.id, //事件id
                "materialType": 2
            }
            this.isHttp = true;
            const stationData = await getMaterial(params)
            if(stationData.result != 0){
                this.$message({
                    message: stationData,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            this.isHttp = false;
            this.stationList = stationData.detail[2];
        },
        goBack(){
            window.history.go(-1);
        },
        linkToNew(){
            this.SETSTAEDITID('add');
            router.push('editStation')
        },
        focusIt(id){  // 选中这条轨迹并进行编辑
            this.SETSTAEDITID(id);
            this.$root.eventHub.$emit('foucsIt','station');
            router.push(`editStation?stop=${id}`)
        }
    }
}
</script>


<style lang="less" scoped>
@screen-md:1200px;
@screen-lg:1800px;

.aside-menu-box{
    box-sizing: border-box;
    padding: 20px 40px 0;
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
        .add{
            background: url('../img/add.png') no-repeat center center;
            background-size: 50% 50%;
            cursor: pointer;
        }
    }
}
</style>

