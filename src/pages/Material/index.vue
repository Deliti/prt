<template>
    <section class="parent">
        <div class="tips-title gray_2 f_origin">
            基础素材 
        </div>
        <section class="aside-menu-box gray_3 f_white">
            <ul>
                <li class="square icon-1 text" @click="linkTo('line')">轨道</li>
                <li class="square icon-2 text" @click="linkTo('station')" >站台</li>
                <li class="square icon-3 text" @click="linkTo('save')">车辆存储</li>
            </ul>
        </section>
        <!-- <router-view class="child"></router-view> -->
    </section>
</template>

<script>
import router from '@/router'
export default {
    methods:{
        linkTo(path){
            router.push(`${path}`);
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
    @media (min-width:@screen-lg) {
        padding: 35px 50px;
    }
    ul{
        overflow: hidden;
        padding: 5px 5px 0;
        li{
            width: 100px;
            height: 100px;
            margin-bottom:20px; 
            box-sizing: border-box;
            padding-top: 45px;
            color: #FCB415;
            @media (min-width:@screen-lg) {
                width: 150px;
                height: 150px;
                padding-top: 80px;
                font-size: 18px;
            }
        }
        li:nth-child(odd){
            float:left;
        }
        li:nth-child(even){
            float: right;;
        }
        .icon-1{
            background: url('img/icon-1.png') center center no-repeat;
            background-size: 65px 23px;
            @media (min-width:@screen-lg) {
                background-size: 90px 40px;
            }
        }
        .icon-2{
            background: url('img/icon-2.png') center center no-repeat;
            background-size: 55px 50px;
            @media (min-width:@screen-lg) {
                background-size: 80px 80px;
            }
        }
        .icon-3{
            background: url('img/icon-3.png') center center no-repeat;
            background-size: 70px 50px;
            @media (min-width:@screen-lg) {
                background-size: 100px 45px;
            }
        }
    }
}

.parent{
    position: relative;
    height: 100%;
}
// .child{
//     position: absolute;
//     left: 0;top:30px;
//     bottom: 0;right: 0;
//     box-sizing:  border-box;
//     width: 100%;
//     height: calc(~'100% - 30px');
// }

.text{
    text-align: center;
    line-height: 80px;
}
</style>



