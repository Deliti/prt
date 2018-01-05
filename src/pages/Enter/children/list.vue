<template>
    <ol class="item-box" @mouseenter='show' @mouseleave='hide' @click="enter">
        <li class="item"
            v-for="(item,index) in list"
            :key="index">
            <div class="item-top">
                {{item.name}}
            </div>
            <div class="content">
                <p v-if="item.key == 'image'">
                    <img :src="data[item.key]" alt="">
                </p>
                <p v-else-if="item.key == 'eventName'">
                    {{substr(data[item.key])}}
                </p>
                <p v-else>
                    {{data[item.key]}}
                </p>
            </div>
        </li>
        <li class="item number">
            <div class="item-top">
                序号
            </div>
            <div class="content">
                <p>
                  {{num}}  
                </p>
            </div>
        </li>
        <li v-show="showDel" class="del-box" @click.stop="delIt"></li>
    </ol>
</template>

<script>
import {Tooltip,Button} from 'element-ui'
export default {
    data(){
        return{
            showDel:false,
            list:[{
                name:'名称',
                key:'eventName'
            },{
                name:'存档',
                key:'image'
            },
            {
                name:'轨道数',
                key:'trackNum'
            },
            {
                name:'站台数',
                key:'stationNum'
            },
            {
                name:'时间，日期',
                key:'createTime'
            },
            {
                name:'是否可运行',
                key:'runnable'
            }]
        }
    },
    props:{
        data:{
            
        },
        num:Number
    },
    components:{
        elTooltip:Tooltip,
        elButton:Button
    },
    methods:{
        show(){
            this.showDel = true;
        },
        hide(){
            this.showDel = false;
        },
        enter(){
            this.$emit('enter')
        },
        delIt(){
            this.$emit('delEvent')
        },
        substr(string){
            return string.length>5?`${string.substr(0,3)}..`:string;
        }
    }
}
</script>

<style lang="less" scoped>
@screen-md:1200px;
@screen-lg:1800px;
.item-box{
    display: flex;
    width: 600px;
    margin: 30px auto;
    padding-left: 100px;
    position: relative;
    @media (min-width:@screen-lg) {
        width: 900px;
        margin: 45px auto;
        padding-left: 150px;
    }
    .number{
        position: absolute;
        left: 0;
        top: 0; 
        text-align: center;
    }
    .item{
        flex: 1;
        width: 100px;
        @media (min-width:@screen-lg) {
            width: 150px;
        }
        // &:nth-child(2),&:nth-child(3){
        //     .content{
        //         font-size: 60px;
        //     }
        // }
        &:nth-child(5){
            .content{
                display: flex;
                line-height: 16px;
                font-size: 12px;
                align-items:center;
                text-align: center;
                @media (min-width:@screen-lg) {
                    height: 150px;
                    font-size: 16px;
                    line-height: 20px;
                }
            }
        }
        &:nth-child(6){
            .content{
                line-height: 16px;
                font-size: 14px;
                line-height: 100px;
                text-align: center;
                @media (min-width:@screen-lg) {
                    height: 150px;
                    font-size: 18px;
                    line-height: 150px;
                }
            }
        }
        .item-top{
            height: 36px;
            font-size: 12px;
            line-height: 36px;
            background: rgba(255, 255, 255, .5);
            color:#000;
            text-align: center;
            @media (min-width:@screen-lg) {
                height: 45px;
                font-size: 18px;
                line-height: 45px;
            }
        }
        .content{
            color: #FCB415;
            height: 100px;
            line-height: 100px;
            font-size: 20px;
            text-align: center;
            background: rgba(0, 0, 0, .3);
            box-shadow: 0px 6px 4px rgba(0, 0, 0, .5);
            cursor: pointer;
            @media (min-width:@screen-lg) {
                height: 150px;
                font-size: 25px;
                line-height: 150px;
            }
            p{
                width: 100%;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }   
    }
    .del-box{
        position: absolute;
        left: 100%;top:36px;
        width: 100px;
        height: 100px;
        background:  url('../delete.png') no-repeat center;
        background-size: 48px 48px;
        cursor: pointer;
        @media (min-width:@screen-lg) {
            top:45px;
            width: 150px;
            height: 150px;
            background-size: 60px 60px; 
        }
    }
}
</style>
