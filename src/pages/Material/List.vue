<template>
    <section class="list-wrap">
        <Nav-Title :name="name"></Nav-Title>
        <section class="aside-menu-box gray_3 f_origin">
            <ul>
                <li 
                    v-for="(item,index) in list" 
                    :key="index" 
                    class="square text"
                    @click="itemHandle(item)" >{{item.name}}</li>
                <li class="text square add" v-if="!mapFlag" @click="addHandle"></li>
            </ul>
            <div class="right" @click="goBack()">
                返回
                <i class="return-btn"></i>
            </div>
        </section>
        <div v-show="isHttp" class="hide-wrap">
            <div class="hide-loading"></div>
        </div>
    </section>
</template>

<script>
import {mapState} from 'vuex';
import NavTitle from './Title'
export default {
    props:{
        name:String,
        isHttp:Boolean,
        list:{
            type:Array,
            required:true
        }
    },
    computed:{
         ...mapState(['mapFlag'])
    },
    components:{
        NavTitle
    },
    methods:{
        itemHandle(id){
            this.$emit('itemHandle',id);
        },
        addHandle(){
            this.$emit('addHandle');
        },
        goBack(){
            window.history.go(-1);
        }
    }
}
</script>


<style lang="less" scoped>
@screen-md:1200px;
@screen-lg:1800px;

.list-wrap{
    height: 100%;
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
        .add{
            background: url('./img/add.png') no-repeat center center;
            background-size: 50% 50%;
            cursor: pointer;
        }
    }
}
</style>

