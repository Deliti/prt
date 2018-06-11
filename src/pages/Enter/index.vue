<template>
    <div class="enter-wrap">
        <Nav-top></Nav-top>
        <div class="welcome orange">
            {{welcomeWord}}
        </div>
        <div class="add-event f_origin" 
                @click="addEvent"
        >添加场景</div>
        <div class="content-wrap">
            <section class="list-content">
                <listItem 
                    v-for="(item,index) in eventList"
                    :key="index"
                    @enter="enterPRT(item)"
                    :data="item"
                    :num="index"
                    @delEvent="delEvent(item.eventId)"
                    ></listItem>
            </section>
        </div> 
        <div class="coverwrap" v-show="addFlag">
            <div class="cover"></div>
            <section class="addForm">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="活动名称" >
                        <el-input v-model="form.eventName"></el-input>
                    </el-form-item>
                    <el-form-item label="活动区域">
                        <el-cascader
                            expand-trigger="hover"
                            :options="cities"
                            v-model="form.cityId"
                            @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">立即创建</el-button>
                        <el-button @click="cancelAdd">取消</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
    </div>
</template>

<script>
import router from '@/router'
import {mapState,mapMutations} from 'vuex'
import { getJosnStore } from '@/config/mUtils'
import { createEvent,getEventList,getCities,delEvent } from '@/service/getData'
import listItem from './children/list'
import NavTop from 'components/nav'

export default {
    data(){
        return{
            eventList:[],
            addFlag: false,
            cities: [],
            form: {
                eventName: '',
                cityId: []
            }
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
        this.getCities()
    },
    components:{
        NavTop,
        listItem
    },
    methods:{
        ...mapMutations(['SETBIGDATA','SETLNG','SETLAT']),
        addEvent(){
            this.addFlag = true

            // this.$prompt('请输入名称', '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     inputPattern:/\S/, 
            // }).then(async ({ value }) => {
            //     const addData = await createEvent(value);
            //     if(addData.result != 0){
            //         this.$message({
            //             message: addData,
            //             type: 'warning',
            //             duration: 2000
            //         })
            //         return false;
            //     }
            //     const {id} = addData.detail;
            //     router.push(`/bigsimulator/${id}`) 
            //     // router.push(`/simulator/${id}`);
            // }).catch(() => {
                      
            // });
        },
        handleChange (prov){
            // console.log('prov', prov)
        },
        async onSubmit(){
            console.log(this.form)
            if (!this.form.cityId[1]){
                this.$message({
                    message: '请选择城市',
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            if (this.form.eventName.length > 5){
                this.$message({
                    message: '事件名称少于5位',
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            const params = {
                cityId: this.form.cityId[1],
                eventName: this.form.eventName
            }
            const addData = await createEvent(params);
            if(addData.result != 0){
                this.$message({
                    message: addData,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            const { id,latitude,longitude } = addData.detail;
            localStorage.setItem('addEventLng', longitude)
            localStorage.setItem('addEventLat', latitude)
            router.push(`/bigsimulator/${id}`) 
            
            // router.push(`/simulator/${id}`);
        },  
        cancelAdd (){
            this.form = {
                eventName: '',
                cityId: []
            }
            this.addFlag = false
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
        async getCities(){
            const data = await getCities({
                cityName: ''
            });
            if(data.result != 0){
                this.$message({
                    message: data,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            this.cities = data.detail.cities;
        },
        enterPRT(eventItem){
            const {
                trackNum,
                eventId,
                latitude,
                longitude
            } = eventItem
            if (latitude && longitude){
                localStorage.setItem('addEventLng', longitude)
                localStorage.setItem('addEventLat', latitude)
            }else {
                localStorage.setItem('addEventLng', 0)
                localStorage.setItem('addEventLat', 0)
            }
            if(true){
                localStorage.setItem('bigData',true);
                // router.push(`/bigsimulator/${eventId}`) 大数据版本1.0
                router.push(`/coolsimulator/${eventId}`)
            }else{
                localStorage.setItem('bigData',""); 
                router.push(`/simulator/${eventId}`);
            }
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
    .add-event{
        cursor: pointer;
        width: 145px;
        height: 55px;
        margin: 20px auto 0;
        box-sizing: border-box;
        line-height: 55px;
        padding-left: 55px;
        text-align: center;
        background: url('add-icon.png') no-repeat 0 0;
        background-size: 100% 100%;
        @media (min-width:@screen-lg) {
            // padding-top: 110px;
        }
    }
    .content-wrap{
        // padding-top: 40px;
        box-sizing: border-box;
        width: 100%;
        height: calc(~"100% - 175px");
        margin: 0 auto;
        overflow-y: auto;
        @media (min-width:@screen-lg) {
            padding-top: 65px;
        }
        .list-content{
            margin: 0 auto;
        }
    }
    .coverwrap{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;top: 0;
        bottom: 0;right: 0;
        .cover{
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;top: 0;
            bottom: 0;right: 0;
        }
    }
    .addForm{
        position: absolute;
        left: 50%;top: 180px;
        margin-left: -200px;
        width: 400px;
        height: 220px;
        background: #ffffff;
        padding: 40px 0 0 30px;
    }
    
}


</style>