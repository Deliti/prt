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
                <p v-else>
                    {{data[item.key]}}
                </p>
                <!-- <p v-if="item.key == 'null'">10</p>
                <p v-else-if="item.key == 'createTime'">{{data.createTime}}</p>
                <p v-else>{{item.key}}</p> -->
            </div>
        </li>
         <!-- <dl>模拟器存档</dl>
         <dt>{{data.createTime}}</dt>
         <div v-show="showDel" class="del" @click.stop="delIt"></div> -->
    </ol>
</template>

<script>
export default {
    data(){
        return{
            showDel:false,
            list:[{
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
            
        }
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
        }
    }
}
</script>

<style lang="less" scoped>
@screen-md:1200px;
@screen-lg:1800px;
.item-box{
    display: flex;
    width: 500px;
    margin: 30px auto;
    @media (min-width:@screen-lg) {
        width: 750px;
        margin: 45px auto;
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
        &:nth-child(4){
            .content{
                display: flex;
                line-height: 16px;
                font-size: 14px;
                align-items:center;
                text-align: center;
                @media (min-width:@screen-lg) {
                    height: 150px;
                    font-size: 18px;
                    line-height: 20px;
                }
            }
        }
        &:nth-child(5){
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
            font-size: 45px;
            text-align: center;
            background: rgba(0, 0, 0, .3);
            box-shadow: 0px 6px 4px rgba(0, 0, 0, .5);
            cursor: pointer;
            @media (min-width:@screen-lg) {
                height: 150px;
                font-size: 85px;
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
}
</style>

<style scoped>
.del{
    width: 200px;
    height: 60px ;
    position: absolute;
    left: 0;bottom: 0;
    opacity: .2;
    background: #eee url('../delete.png') no-repeat center;
    background-size: 48px 48px;
}
</style>

