<template>
    <div class="login-warp">
        <section class="login-box">
            <div class="logo-space">
                <h1 class="company-name">智能飞豆系统轨道编辑器</h1>
                <div class="logo"></div>
                <div class="desc">
                    <p class="detail">
                        江苏添仂智能科技有限公司致力于成为城市智能交通领域的领导者。作为提供的高效便捷和绿色环保的PRT技术供应商之一，公司在缓解城市拥堵、推动城市交通效率方面都有着自己独特的技术解决方案。添仂在感受中国“城镇化”飞速发展进程的同时，不断积极响应国家建设“智能城市”和“智能交通”的政策，进行自身的改革与发展，为客户、员工和社会创造可持续的价值。
                    </p>
                    <!-- <p class="detail">
                        其他信息，例如公司详情，公司简介，产品简介
                    </p>
                    <p class="detail">
                        其他信息，例如公司详情，公司简介，产品简介
                    </p>
                    <p class="detail">
                        其他信息，例如公司详情，公司简介，产品简介
                    </p>-->
                    <p class="name">
                        江苏添仂智能科技有限公司
                    </p> 
                </div>
            </div>
            <div class="login-space">
                <div class="form-wrap">
                    <ul class="form-box">
                        <li>
                            <span class="icon user"></span>
                            <input type="text" placeholder="用户名" v-model="username">
                        </li>
                        <li>
                            <span class="icon pwd"></span>
                            <input type="password" placeholder="密码" v-model="password">
                        </li>
                    </ul> 
                    <div class="login-bottom">
                        <span class="login-btn" @click="login">登录</span>
                        <span class="remenber" 
                              :class="remember?'check':''"
                              @click="toggleCheck"
                                >
                            记住我
                            <i></i>
                        </span>
                    </div>
                    
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import {signin} from '@/service/getData'
import { setStore,getStore } from '@/config/mUtils'
import router from '@/router'
import {mapMutations} from 'vuex'
export default {
    data(){
        return {
            username:'',
            password:'',
            remember:false
        }
    },
    beforeMount(){
        const username = getStore('username');
        const password = getStore('password');
        if(username && password){
            this.remember = true;
            this.username = username;
            this.password = password;
        }
    },
    mounted(){
        document.addEventListener('keydown',this.keyLogin);
    },
    beforeDestroy(){
        document.removeEventListener('keydown',this.keyLogin);
    },
    methods:{
        ...mapMutations(['STOREUSER']),
        keyLogin(e){
            if(e.keyCode==13){
                this.login();
            }
        },
        async login(){
            const params = {
                username:this.username,
                password:this.password
            }
            const data = await signin(params)
            if(data.result != 0){
                this.$message({
                        message: data,
                        type: 'warning',
                        duration: 2000
                })
                return false;
            }
            this.STOREUSER(data.detail)
            setStore('userInfo',data.detail);
            router.push('/')
        },
        toggleCheck(){
            this.remember = !this.remember;
            if(this.remember){
                setStore('username',this.username);
                setStore('password',this.password);
            }else{
                setStore('username','');
                setStore('password',''); 
            }
        },
    }
}
</script>

<style lang="less" scoped>
@screen-md:1200px;
@screen-lg:1800px;

.login-warp{
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    padding:150px 0 0 0;
    background: url('../../common/images/bg.png') 0 0 no-repeat;
    background-size: 100% 100%;
    color: #FCB415;
    .login-box{
        width: 800px;
        height: 540px;
        margin:0 auto;
        display: flex;
        box-shadow: 0 4px 25px 4px rgba(0,0,0,.44);
        @media (min-width:@screen-lg) {
            width: @screen-md;
            height: @screen-md/1.5;
        }
        .logo-space{
            flex: 5;
            height: 100%;
            background:url('./logo-bg.png') 0 0;
            background-size: 100% 100%;
            box-sizing: border-box;
            padding: 130px 0 0 100px;
            position: relative;
            @media (min-width:@screen-lg) {
                width: 750px;
                padding: 130px 0 0 130px;
            }
            .company-name{
                height: 28px;
                font-size: 26px;
                line-height: 28px;
                padding-bottom:32px; 
                @media (min-width:@screen-lg) {
                    font-size: 42px;
                    height: 45px;
                    line-height: 45px;
                }
            }
            .logo{
                width: 294px;
                height: 60px;
                background: url('./logo.png') no-repeat 0 0;
                background-size: 100% 100%;
                margin-bottom: 60px;
                @media (min-width:@screen-lg) {
                    width: 420px;
                    height: 55px;
                    margin-bottom: 50px;
                }
            }
            .desc{
                .detail{
                    font-size: 12px;
                    line-height: 20px;
                    width: 294px;
                    @media (min-width:@screen-lg) {
                        font-size: 14px;
                    }
                }
                .name{
                    font-size: 14px;
                    line-height: 24px;
                    position: absolute;
                    left: 100px;bottom: 30px;
                    @media (min-width:@screen-lg) {
                        font-size: 18px;
                        line-height: 20px;
                        left: 130px;bottom: 90px;
                    }
                }
            }
        }
        .login-space{
            flex: 3;
            height: 100%;
            box-sizing: border-box;
            background: url('./login-bg.png') 0 0;
            background-size: 100% 100%;
            padding: 135px 0 0 0;
            @media (min-width:@screen-lg) {
                padding-top: 240px;
            }
            .form-wrap{
                .form-box{
                    li{
                        padding: 16px 0 4px 0px ;
                        overflow: hidden;
                        border-bottom: 1px solid #FCB415;
                        .user{
                            background: url('./user.png') no-repeat 0 0;
                        }
                        .pwd{
                            background: url('./lock.png') no-repeat 0 0;
                        }
                        .icon{
                            width: 24px;
                            height: 24px;
                            float: left;
                            background-size: 100% 100%;
                            margin-left: 26px;
                            margin-right: 10px;
                            @media (min-width:@screen-lg) {
                                width: 28px;height: 28px;
                                margin-right: 20px;
                            }
                        }
                        input{
                            float: left;
                            height: 24px;
                            font-size: 14px;
                            border:none;
                            width: 200px;
                            background: rgba(0, 0, 0, 0);
                            color: #FCB415;
                            @media (min-width:@screen-lg) {
                                font-size: 16px;
                            } 
                        }
                        input::-webkit-input-placeholder{
                            font-size: 14px;
                        }
                        
                    }
                    margin-bottom: 40px;
                }
                .login-bottom{
                    height: 23px;
                    line-height: 23px;
                    overflow: hidden;
                    @media (min-width:@screen-lg) {
                        height: 30px;
                        line-height: 30px;
                    }
                    span{
                        float: left;
                    }
                    .login-btn{
                        width: 127px;
                        height: 100%;
                        background: url('./login-btn-bg.png') no-repeat 0 0;
                        background-size: 100% 100%;
                        box-sizing: border-box;
                        padding-left: 55px;
                        font-size: 16px;
                        color: #ffffff;
                        margin-right: 25px;
                        @media (min-width:@screen-lg) {
                            width: 145px;
                            padding-left: 65px;
                            margin-right: 35px;
                            font-size: 18px;
                        } 
                    } 
                    .remenber{
                        line-height: 23px;
                        font-size: 12px;
                        cursor: pointer;
                        @media (min-width:@screen-lg) {
                            font-size: 14px;
                            line-height: 30px;
                        } 
                        i{
                            margin:3px 0 0 5px;
                            position: relative;
                            width: 10px;height: 10px;
                            background: #ffffff;
                            @media (min-width:@screen-lg) {
                                width: 15px;
                                height: 15px;
                            } 
                        }
                    }
                    .check{
                        i:after{
                            content: '';
                            display: block;
                            position: absolute;
                            left:0;top:0;
                            width: 100%;
                            height: 100%;
                            background: url('./yes.png') 0 0 no-repeat;
                            background-size: 100% 100%;
                        }
                    }
                }
            }
        }
    }
}

</style>