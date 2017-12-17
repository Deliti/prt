<template>
    <section class="aside-menu-box gray_3 f_origin">
        <!-- <div class="mt20" 
             v-show="!$route.query.save"  
             @click="startMapPoint()" >
            <div class="start-point-btn func_btn">选择站台位置</div>
            站台坐标{{position.lon}},{{position.lat}}
        </div> -->
        <div class="mt20 posi-area"  v-show="!$route.query.save">
            <div  
                @click="startMapPoint()"  
                class="start-point-btn func_btn">选择存储位置</div>
            <div class="posi-text">{{positionText}}</div>
        </div>
        <div class="mt20 form_wrap">
            <dl v-for="(item,index) in base" :key="index"
                class="form_item"
                v-if="index != 'isBroken'"
                >
                <dd class="left form_key">{{item.name}}</dd>
                <dt class="right form_val">
                    <input 
                        type="text"
                        v-model="item.val"
                        v-if="index == 'station'"
                        :disabled="mapFlag || $route.query.save" 
                        :class="mapFlag || $route.query.save?'disabled':''" 
                        @change="checkStation(item.val)"
                        >
                    <input v-else type="text" v-model="item.val">
                </dt>
            </dl>
             <dl v-else
                class="form_item" >
                <dd class="left form_key">{{item.name}}</dd>
                <dt class="right form_check" :class="{'active':item.val}" @click="toggleBroken(item)">
                </dt>
            </dl> 
        </div>
        <div class="mt20 func-area">
             <div class="func_btn submit_btn" @click="insertSave()">确定</div>
              <div class="func_btn del_btn" 
                    :class="mapFlag?'disabled':''"
                 @click="giveUp()">{{giveUpText}}</div>
             <!-- <div v-show="$route.query.save || mapFlag" >删除</div> -->
        </div>
        <div class="right" @click="goBack()">
            返回
            <i class="return-btn"></i>
        </div>
    </section>
</template>

<script>
import router from '@/router'
import { validExp } from '@/config/mUtils'
import {mapState,mapMutations} from 'vuex'
import { addStorage,delStorage,editStorage,storageDetail,getStorageLngLat,getStationId } from '@/service/getData' 

export default {
    data(){
        return{
            name:"",
            position:{
                lon:'',
                lat:''
            },
            base:{
                capacity:{    
                    name:'设施容量',
                    val: "",
                    test: 'number'
                },
                station:{
                    name:'输入站台编号',
                    val:''
                },
                isBroken:{        
                    name:'是否损坏',
                    val: false
                }
            },
            del: false
        }
    },
    computed:{
        ...mapState(['save','mapFlag']),
        positionText(){
            if(this.position.lon && this.position.lat){
                return `${this.position.lon} / ${this.position.lat}`
            }
            return '存储设施位置坐标'
        },
        giveUpText(){
            return this.$route.query.save?
                '删除':'放弃'
        }
    },
    created(){
        this.bindEdit();
        this.$root.eventHub.$on('getMapPoint', this.getMapPoint);
    },
    mounted(){
        this.$route.query.save && this.getDetail();
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': 'getDetail'
    },
    methods:{
        ...mapMutations(['DELSAVE','INSERTSAVE','SETEDITSAVE','SETSAVEEDITID']),
        getMapPoint(point){
            this.position.lon = point.lng;
            this.position.lat = point.lat;
        },
        bindEdit(){
            const id = this.$route.query.save;
            if(id){
                this.$root.eventHub.$emit('foucsIt',{
                    type:'save',
                    id
                });
            }
        },
        goBack(){
           window.history.go(-1);
        },
        startMapPoint(){
            this.$message('请在站台附近点击选择位置');
            this.$root.eventHub.$emit('clickPoint');
        },
        async checkStation(val){
            const params = {
                "eventId": this.$route.params.id,
                "name": val,
                "materialType": 2
            }
            const data = await getStationId(params);
            if(data.result!=0){
                this.$message({
                    message: '请填写正确的站台名',
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
        },
        async getDetail(){
            const params = {
                eventStorageId:this.$route.query.save
            }
            const data = await storageDetail(params);
            if(data.result!=0){
                this.$message({
                    message: data,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            const detail = data.detail;
            this.name = detail[0].name;
            this.position.lon = detail[0].longitude;
            this.position.lat = detail[0].latitude;
            this.base.capacity.val = detail[0].capacity;
            this.base.station.val = detail[0].stationName;
            this.base.isBroken.val = detail[0].isBroken == 1?true:false;
        },
        async draw(){  // 生成存储设施
            // 一堆判断条件
            const baseData = this.base;
            const params = {
                capacity:baseData.capacity.val,  // 设施容量
                isBroken:baseData.isBroken.val // 是否损坏
            }
            const pointParams = {
                "minDistance":baseData.minDis.val, //最小距离
            }
            const data = await getStorageLngLat(pointParams)
            if(data.result != 0){
                this.$message({
                    message: data,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            this.position.lon=data.detail.lon;
            this.position.lat=data.detail.lat;
            // 掉接口
            params.startPoint = {
                lat:data.detail.lat,
                lng:data.detail.lon
            }
            this.$root.eventHub.$emit('outputStorage',params)
        },
        async reDraw(){
            const params = {
                eventStorageId:this.$route.query.save
            }
            const data = await storageDetail(params);
            if(data.result!=0){
                this.$message({
                    message: data,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            const detail = data.detail;
            this.save.edit.overlay && this.DELSAVE();
            this.$root.eventHub.$emit('insertStorage',detail[0])
        },
        async insertSave(){ // 确定插入存储设施
            const baseData = this.base;
            const params = {
                longitude: this.position.lon,
                latitude: this.position.lat,
                capacity:baseData.capacity.val,  // 设施容量
                isBroken:baseData.isBroken.val?1:0,  // 是否损坏
            }
            if(this.$route.query.save){
                Object.assign(params,{
                    "id":this.$route.query.save, //事件站台id
                })
                const editData = await editStorage(params);
                if(editData.result != 0){
                    this.$message({
                        message: editData,
                        type: 'warning',
                        duration: 2000
                    })
                    return false;
                }
                this.$message({
                    message: '更新存储设施成功',
                    type: 'success',
                    duration: 2000
                })
            }else{
                // 确定请求接口 返回id和编号 
                Object.assign(params,{
                    stationName:baseData.station.val,  // 站台名
                    eventId:this.$route.params.id
                })
                const addData = await addStorage(params);
                if(addData.result != 0){
                    console.log(addData);
                    return false;
                }
                const {id,name,vertexId} = addData.detail;
                this.$root.eventHub.$emit('insertStorage',{id,name,vertexId,position:this.position})
                this.$message({
                    message: '新建存储设施成功',
                    type: 'success',
                    duration: 2000
                })
            }
            this.goBack();
        },
        async giveUp(){  // 放弃删除
            if(this.mapFlag){
                return false;
            }
            this.$confirm(`确定${this.giveUpText}此存储设施?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                if(this.$route.query.save){
                    const params = {
                        eventStorageId:this.$route.query.save
                    }
                    const data = await delStorage(params);
                    if(data.result!=0){
                        console.log(data);
                        return false;
                    }
                    this.del = true;
                    console.log('删除成功');
                }
                this.goBack();
                this.DELSAVE();
            })
        },
        checkInput(){
            let message = '';
            if(this.stationId == ""){
                message = '请填写正确的站台名';
                this.$message({
                    message,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            for(let i in this.base){ 
                const val = this.base[i];
                if(val.test != undefined){
                    let { test,val,name } = val;
                    test in validExp?
                    (validExp[test](val)?null:message = `请填写正确的${name}`):null
                    if(message){
                        break;
                    }
                }
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
        toggleBroken(item){
            item.val = !item.val
        }
    }
}
</script>


<style lang="less" scoped>
.aside-menu-box{
    box-sizing: border-box;
    width: 100%;
    padding: 20px 35px 0;
    position: absolute;
    left: 0;top: 0; 
    .posi-area{
        .func_btn{
            width: 100px;
            height: 30px;
            border-radius: 4px;
            font-size: 12px;
            line-height: 30px;
            text-align: center;
            color: #000000;
            background: #FCB415;
            margin-bottom: 10px;
            &:hover,&:active{
                background: #FEF0D0;
            }
        } 
        .posi-text{
            width: 100%;
            height: 30px;
            border-radius: 4px;
            font-size: 12px;
            line-height: 30px;
            text-align: center;
            color: #000000;
            background: #FCB415;
        }
    }
    .mt20{
        margin-top:20px;
        
    }
    .form_wrap{
        .form_item{
            overflow: hidden;
            margin-bottom:5px;
            color: #FCB415;
            .form_key{
                width: 50%;
                height: 30px;
                text-align: center;
                font-size: 12px;
                line-height: 30px;
            }
            .form_val{
                width: 50%;
                height: 30px;
                box-sizing: border-box;
                input{
                    width: 100%;
                    height: 100%;
                    border:none;
                    box-sizing: border-box;
                    padding-right: 10px;
                    text-align: right;
                    box-shadow: 0 0 1px 3px rgba(0,0,0,.8) inset;
                    border-radius: 8px;
                }
            }
            .form_check{
                width: 65px;
                height: 30px;
                box-sizing: border-box;
                background: url('../img/no-check.png') no-repeat center 5px;
                background-size: 100% 20px;
                cursor: pointer;
            }
            .active{
                background-image: url('../img/check.png');
            }
        }   
    }
    /*下方功能键  */
    .func-area{
        overflow: hidden;
        margin-bottom: 15px;
        .func_btn{
            width: 100px;
            height: 30px;
            border-radius: 4px;
            font-size: 12px;
            line-height: 30px;
            text-align: center;
            color: #000000;
            background: #FCB415;
            &:hover,&:active{
                background: #FEF0D0;
            }
        }
        .submit_btn{
            float: left;
        }
        .del_btn{
            float: right;
        }
    }
}

</style>

