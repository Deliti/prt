<template>
    <div class="enter-wrap">
        <Nav-top></Nav-top>
        <div class="welcome orange">
            {{welcomeWord}}
        </div>
        <div class="content-wrap">
            <section class="list-content">
                <listItem 
                    v-for="(item,index) in eventList"
                    :key="index"
                    @enter="enterPRT(item.eventId)"
                    :data="item"
                    @delEvent="delEvent(item.eventId)"
                    ></listItem>
            </section>
            <div class="add-event f_origin" 
                @click="addEvent"
                >添加场景</div>
        </div> 
    </div>
    <!-- <div>
        <header class="gray_3">
            <div class="left title f_white">
                <i></i> 
                <span>添仂智能科技</span>
            </div>
        </header>
        <div class="welcome orange">
            <h1>{{welcomeWord}}</h1>
            <p class="help">点击查看使用手册</p>
        </div>
        <div class="content">
            <ul class="list-content">
                <listItem 
                    v-for="(item,index) in eventList"
                    :key="index"
                    @enter="enterPRT(item.id)"
                    :data="item"
                    @delEvent="delEvent(item.eventId)"
                    ></listItem>
                <li class="add-event" 
                    @click="addEvent"
                    ></li>
            </ul>
        </div>
    </div> -->
</template>

<script>
import router from '@/router'
import {mapState} from 'vuex'
import { getJosnStore } from '@/config/mUtils'
import { createEvent,getEventList,delEvent } from '@/service/getData'
import listItem from './children/list'
import NavTop from 'components/nav'

export default {
    data(){
        return{
            eventList:[]
        }
    },
    computed:{
        ...mapState(['userInfo']),
        welcomeWord(){
            const nowTime = new Date();
            const hours = parseInt(nowTime.getHours());
            const { username } = getJosnStore('userInfo');
            let timeGreeting;
            if(hours<11){
                timeGreeting = '早上好';
            }else if(hours<13 && hours>=11){
                timeGreeting = '中午好';
            }else if(hours<18 && hours>=13){
                timeGreeting = '下午好';
            }else{
                timeGreeting = '晚上好';
            }
            return `${timeGreeting}，${username}，欢迎使用添仂智能科技PRT模拟器`
        }
    },
    mounted(){
        this.getEventList();
    },
    components:{
        NavTop,
        listItem
    },
    methods:{
        async addEvent(){
            const addData = await createEvent();
            if(addData.result != 0){
                this.$message({
                    message: addData,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            const {id} = addData.detail;
            router.push(`/simulator/${id}`);
        },
        async getEventList(){
            const data = await getEventList();
            if(data.result != 0){
                this.$message({
                    message: data,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            this.eventList = data.detail;
        },
        enterPRT(id){
            router.push(`/simulator/${id}`);
        },
        delEvent(eventId){
            this.$confirm('确定删除该场景?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const params = {
                    eventId
                }
                const data = await delEvent(params);
                if(data.result != 0){
                    this.$message({
                        message: data,
                        type: 'warning',
                        duration: 2000
                    })
                    return false;
                }
                this.$message({
                    message: '删除事件成功',
                    type: 'success',
                    duration: 2000
                })
                this.getEventList();
            })
            
        }
    }
}
</script>


<style lang="less" scoped>
@screen-md:1200px;
@screen-lg:1800px;
.enter-wrap{
    height: 100%;
    box-sizing: border-box;
    background: url('../../common/images/bg.png') 0 0 no-repeat;
    background-size: 100% 100%;
    .welcome{
        padding-left: 150px;
        line-height: 45px;
        border: 1px solid #000;
        font-size: 14px;
        color: #ffffff;
        @media (min-width:@screen-lg) {
            font-size: 18px; 
            padding-left: 150px;
        }
    }
    .content-wrap{
        padding-top: 40px;
        box-sizing: border-box;
        width: 800px;
        height: calc(~"100% - 100px");
        margin: 0 auto;
        overflow-y: auto;
        @media (min-width:@screen-lg) {
            padding-top: 65px;
        }
        .list-content{
            margin: 0 auto;
        }
        .add-event{
            cursor: pointer;
            position: absolute;
            right: 100px;
            top: 50%;
            margin-top:-25px;
            width: 100px;
            padding-top: 50px;
            text-align: center;
            background: url('add.png') no-repeat center 0;
            background-size: 50px 50px;
            @media (min-width:@screen-lg) {
                // padding-top: 110px;
            }
        }
    }
}

</style>

<style scoped>
/* 
header{
    width: 100%;
    height: 40px;
    position: relative;
}
.title{
    cursor: pointer;
}
.title i{
    float: left;
    width: 50px;
    height: 40px; 
    background: url('./nav.png') no-repeat 0 0;
    background-size: 50px 40px; 
}
.title span{
    float: left;
    width: 90px;
    height: 40px;
    text-align:center;
    line-height: 40px;
} 
.welcome{
    padding: 30px 0 20px 100px;
    border: 1px solid #000;
}
.welcome h1{
    font-size: 24px;
    margin-bottom: 10px;
}
.help{
    color:cornflowerblue;
}
.content{
    overflow: auto;
}
.list-content{
    overflow: hidden;
}
.list-content .item{
    float: left;
    width: 140px;
    height: 120px;
    font-weight: bold;
    color: #000;
    font-size: 16px;
    margin:0 30px 20px 0;
    padding: 80px 0 0 60px;
    position: relative;
    cursor: pointer;
}
.list-content .item .del{
    width: 200px;
    height: 60px ;
    position: absolute;
    left: 0;bottom: 0;
    opacity: .2;
    background: #eee url('./delete.png') no-repeat center;
    background-size: 48px 48px;
}
.add-event{
    float: left;
    width: 70px;
    height: 200px;
    background: url('./add.png') no-repeat center;
    background-size: 50px 50px; 
    cursor: pointer;
} */
</style>

