<template>
    <section class="parent">
        <div class="tips-title gray_2 f_origin">
            基础功能键
        </div>
        <section class="aside-menu-box gray_3 f_origin">
            <ul>
                <li class="square text"
                    @click="startAndPause"
                    :class="runStatus == 0 || runStatus == 2?(hasCar?'start-icon':'start-hide'):'pause-icon'" 
                    >
                    {{runText}}
                </li>
                <li class="square text"
                    @click="stopRun"
                    :class="hasCar && runStatus != 0?'stop-icon':'stop-hide'"
                    >
                    停止
                </li>
                <li class="square text"
                    :class="hasCar?'passenger-hide':'passenger-icon'"
                    @click="autoCreate">
                    系统生成乘客
                </li>
                <li class="square reset-icon text"
                    @click="reset">
                    重置
                </li>
            </ul>
        </section>
    </section>
</template>

<script>
import router from '@/router'
import {mapState,mapMutations} from 'vuex'
import { addRunCar } from '@/service/getData'
export default {
    computed:{
        ...mapState(['mapFlag','runStatus','hasCar']),
        runText(){
            if(this.runStatus == 0){
                return '开始'
            }else if(this.runStatus == 1){
                return '暂停'
            }else if(this.runStatus == 2){
                return '继续'
            }
            return ''
        }
    },
    methods:{
        ...mapMutations(['CHANGERUNSTATUS','SETHASCAR']),
        checkIsRun(isCar){
            let message = '';
            if(this.mapFlag == 0){
                message = '需要切换到模拟运行状态'
            }else if(isCar && !this.hasCar){
                message = '还没有车辆'
            }else if(this.runStatus == 3){
                message = '车辆已停止'
            }
            if(message){
                this.$message({
                    message,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            return true;
        },
        startAndPause(){
            if(!this.checkIsRun(true)){
                return false;
            }
            if(this.runStatus == 0){
                this.CHANGERUNSTATUS(1);
                this.$root.eventHub.$emit('orderCar',0);
            }else if(this.runStatus == 1){
                this.CHANGERUNSTATUS(2);
                this.$root.eventHub.$emit('orderCar',1);
            }else if(this.runStatus == 2){
                this.CHANGERUNSTATUS(1);
                this.$root.eventHub.$emit('orderCar',2);
            }
        },
        stopRun(){
            if(!this.checkIsRun() || this.runStatus == 0){
                return false;
            }
            this.CHANGERUNSTATUS(3);
            this.$root.eventHub.$emit('orderCar',3);
        },
        async autoCreate(){
            let message = '';
            if(this.mapFlag == 0){
                message = '需要切换到模拟运行状态'
            }else if(this.hasCar){
                message = '需要重新模拟才可点击'
            }
            if(message){
                this.$message({
                    message,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            const params = {
                eventId:this.$route.params.id
            }
            const data = await addRunCar(params);
            if(data.result != 0){
                this.$message({
                    message:data,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            if(data.detail.length == 0){
                this.$message({
                    message:'请重新生成乘客',
                    type: 'Info',
                    duration: 2000
                }) 
                return false;
            } 
            this.$root.eventHub.$emit('createCarList',data.detail);
            data.detail.length>0 && this.SETHASCAR(true);
        },
        reset(){
            if(!this.checkIsRun()){
                return false;
            }
            this.SETHASCAR(false);
            this.$root.eventHub.$emit('resetMap');
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
    padding: 20px 35px 0;
    position: relative;
    ul{
        overflow: hidden;
        li{
            width: 100px;
            height: 100px;
            margin-bottom:20px; 
            @media (min-width:@screen-lg) {
                width: 150px;
                height: 150px;
                margin-bottom:35px;
            }
            &:nth-child(odd){
                float:left;
            }
            &:nth-child(even){
                float: right;;
            }
        }
        .start-icon{
            background:url('./run.png') no-repeat center center;
            background-size: 50px 50px;
        }
        .start-hide{
            background:url('./start_hide.png') no-repeat center center;
            background-size: 50px 50px;  
        }
        .pause-icon{
            background:url('./pause.png') no-repeat center center;
            background-size: 50px 50px; 
        }
        .stop-icon{
            background: url('./stop.png') no-repeat center center;
            background-size: 50px 50px;
        }
        .stop-hide{
            background: url('./stop_hide.png') no-repeat center center;
            background-size: 50px 50px; 
        }
        .passenger-icon{
            background: url('./passenger.png') no-repeat center center;
            background-size: 50px 50px;
        }
        .passenger-hide{
            background: url('./passenger_hide.png') no-repeat center center;
            background-size: 50px 50px;  
        }
        .reset-icon{
            background: url('./reset.png') no-repeat center center;
            background-size: 50px 50px; 
        }
        .text{
            text-align: center;
            box-sizing: border-box;
            padding-top: 80px;
            font-size: 14px;
            line-height: 20px;
            @media (min-width:@screen-lg) {
                padding-top: 120px; 
                font-size: 18px;
                line-height: 30px;
            }
        }
    }
} 
</style>


