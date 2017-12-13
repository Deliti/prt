<template>
    <div>
        <header class="app-header">
            <div class="header-wrap left">
                <div class="header-logo"></div>
                <div class="header-name">智能飞豆系统</div>
            </div>
            <div class="left" v-if="inMap">
                <div class="menu" @mouseenter="showMenu" @mouseleave="hideMenu">
                    <span class="btn grey f_origin">菜单栏</span>
                    <menu-item-div :class="{ hide: !isShow }"></menu-item-div>
                </div>
            </div>  
            <div class="left ml60" v-if="inMap">
                <div class="func f_white" @click="changeType()">
                    <span :class="mapFlag?'active':''">模拟状态</span>
                    /
                    <span :class="mapFlag?'':'active'">编辑状态</span>
                </div>
            </div>
        </header>
        <div class="head-holder"></div>
    </div>
    <!-- <header class="gray_3">
        <div class="left title f_white">
             <i></i> 
            <span>添仂智能科技</span>
        </div>
        <div class="left">
            <div class="menu" @mouseenter="showMenu" @mouseleave="hideMenu">
                <span class="btn orange f_white">菜单栏</span>
                <menu-item-div :class="{ hide: !isShow }"></menu-item-div>
            </div>
        </div>
        <div class="left ml60">
            <div class="func f_white" @click="changeType()">
                {{editText}}
            </div>
        </div>
        <div class="right"></div>
        <ul class="nav-list right gray_2 f_white">
            <li class="item" @click="linkArea('handle')">功能页</li>
            <li class="item middle" @click="linkArea('material')">素材页</li>
            <li class="item" @click="linkArea('statistics')">实时统计页</li>
        </ul>
    </header> -->
</template>

<script>
import MenuItemDiv from './menuItem';
import router from '@/router';
import {mapState,mapMutations} from 'vuex'

export default {
    data(){
        return{
            isShow:false
        }
    },
    computed:{
        ...mapState(['mapFlag']),
        editText(){
            return this.mapFlag?'模拟状态':'编辑状态'
        },
        inMap(){
            if(this.$route.name === 'home'){
                return false;
            }
            return true;
        }
    },
    components:{
        MenuItemDiv
    },
    methods:{
        ...mapMutations(['SETMAPFLAG','CHANGERUNSTATUS']),
        showMenu(){
            this.isShow = true
        },
        hideMenu(){
            this.isShow = false;
        },
        changeType(){
            this.SETMAPFLAG();
            this.mapFlag?this.linkArea('handle'):this.linkArea('material');
            this.$root.eventHub.$emit('resetMap');
            this.CHANGERUNSTATUS(0)
        },
        linkArea(path){
            router.push(`/simulator/${this.$route.params.id}/${path}`)
        }
    }
}
</script>

<style lang="less" scoped>
@screen-md:1200px;
@screen-lg:1800px;

.app-header{
    position: fixed;
    left: 0;top: 0;
    z-index: 9999;
    width: 100%;
    background: #25262D;
    height: 45px;
    color: #FCB415;
    .header-wrap{
        padding-left: 25px;
        overflow: hidden;
        .header-logo{
            float: left;
            width: 120px;
            height: 28px;
            margin-top:7px;
            background: url('img/logo.png') no-repeat 0 0;
            background-size: 100% 100%;
        }
        .header-name{
            float: left;
            padding-left: 5px;
            line-height: 45px;
            font-size: 16px;
             @media (min-width:@screen-lg) {
                font-size: 20px;
            } 
        }
    }
    .menu{
        margin-left: 70px;
        text-align: center;
        position: relative;
        cursor: pointer;
        .btn{
            width: 100px;
            height: 45px;
            line-height: 45px;
            display: block;
            box-sizing: border-box;
            padding-left: 40px;
            font-size: 12px;
            background:rgba(255, 255, 255, 0.3) url('img/menu.png') no-repeat 20px center;
            background-size: 20px 20px;
        }
    }
    .ml60{
        margin-left: 160px;
        font-size: 12px;
        .func{
            width: 130px;
            height: 45px;
            box-sizing: border-box;
            line-height: 45px;
            text-align: center;
            background:rgba(255, 255, 255, 0.3); 
            cursor: pointer;
            // width: 195px; 
            .active{
                font-size: 14px;
                color:#FCB415;
                font-weight: bold;
            }
        }
    }
    
    // .nav-list{
    //     display: flex;
    //     width: 280px;
    //     border-left: 1px solid #eee;
    //     cursor: pointer;
    // }
    // .item{
    //         flex: 1;
    //         height: 40px;
    //         text-align: center;
    //         line-height: 40px;
    //     }
    // .middle{
    //     border-left: 1px solid #eee;
    //     border-right: 1px solid #eee;
    // }
}
.head-holder{
    height: 45px;
}
</style>



