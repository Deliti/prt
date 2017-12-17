<template>
    <section class="aside-menu-box gray_3 f_origin">
        <div class="mt20 posi-area"  v-show="!$route.query.stop">
            <div  
                @click="startMapPoint()"  
                class="start-point-btn func_btn">选择站台位置</div>
            <div class="posi-text">{{positionText}}</div>
        </div>
        <div class="form_wrap">
            <dl v-for="(item,index) in base" :key="index"
                class="form_item"
                v-if="index != 'isBroken'">
                <dd class="left form_key">{{item.name}}</dd>
                <dt class="right form_val">
                    <input type="text"
                        :disabled="mapFlag?true:false" 
                        :class="mapFlag?'disabled':''"
                         v-model="item.val">
                </dt>
            </dl>
            <dl v-else
                class="form_item" >
                <dd class="left form_key">是否损坏</dd>
                <dt class="right form_check" :class="{'active':item.val}" @click="toggleBroken()">
                    <!-- <input type="checkbox" v-model="base.isBroken.val"> -->
                </dt>
            </dl>
        </div>
        <!-- <div v-show="station.edit.flag!='show'" class="mt20 func-area">
            <div class="start-point-btn func_btn" 
                @click="draw()" >生成</div>
        </div> -->
        <div class="mt20 func-area">
             <div class="func_btn submit_btn" @click="insertStation()">确定</div>
             <div class="func_btn del_btn"
                  :class="mapFlag?'disabled':''"  
                  @click="giveUp()">{{giveUpText}}</div>
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
import { addStation,delStation,stationDetail,editStation } from '@/service/getData' 
let addDis;
export default {
    data(){
        return{
            startPoint:{
                lon:'',
                lat:''
            },
            vertexId:'',
            base:{
                userDefineName:{
                    name:'自定义名称',
                    val: "",
                    test: 'string'
                },
                berths:{    
                    name:'站台泊位数',
                    val: "",
                    test: 'number'
                },
                asidelen:{    
                    name:'匝道长度',
                    val: "",
                    test: 'number'
                },
                len:{    
                    name:'站台长度',
                    val: 0,
                    test: 'number'
                },
                isBroken:{        
                    name:'是否损坏',
                    val: false
                }
            },
            lineId:'',
            del:false
        }
    },
    computed:{
        ...mapState(['station','mapFlag']),
        giveUpText(){
            console.log(this.$route)
            return this.$route.query.stop?
                '删除':'放弃'
        },
        positionText(){
            if(this.startPoint.lon && this.startPoint.lat){
                return `${this.startPoint.lon} / ${this.startPoint.lat}`
            }
            return '站台位置坐标'
        }
    },
    created(){
        this.$root.eventHub.$on('givePoint', this.setStartPoint);
        this.$root.eventHub.$on('staAndLine', this.setLineInfo);
    },
    mounted(){
        this.bindEdit();
        this.$route.query.stop && this.getDetail();
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': 'getDetail'
    },
    methods:{
        bindEdit(){
            const id = this.$route.query.stop;
            if(id){
                this.$root.eventHub.$emit('foucsIt',{
                type:'station',
                id
            });
            }
        },
        goBack(){
            window.history.go(-1);
        },
        setStartPoint(Info){
            console.log(Info);
            const {isStation} = Info;
            if(isStation){
                this.$message({
                    message: '此点已存在站台，请重新选择',
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            this.vertexId = Info.vertexId;
            this.startPoint.lon = Info.lon;
            this.startPoint.lat = Info.lat;
        },
        startMapPoint(){  // 选择轨道起始点
            this.$message('请点击已存在的点');
            this.$root.eventHub.$emit('clickPoint','station');
        },
        setLineInfo(id,dis){
            this.lineId = id;
            addDis = dis.toFixed(4);
        },
        async getDetail(){
            const params = {
                eventStationId:this.$route.query.stop
            }
            const data = await stationDetail(params);
            if(data.result!=0){
                this.$message({
                    message: data,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            const detail = data.detail;
            
            this.vertexId = detail[0].vertexId; 
            this.base.userDefineName.val = detail[0].userDefineName;
            this.base.berths.val = detail[0].berths;
            this.base.asidelen.val = detail[0].rampLength;
            this.base.len.val = detail[0].stationLength;
            this.base.isBroken.val = detail[0].isBroken == 1?true:false;
            this.lineId = detail[0].eventTrackId;
        },
        draw(){  // 生成站台
            // 一堆判断条件
            const checkValid = this.checkInput();
            console.log('check',checkValid)
            if(!checkValid)
                return false;
            const baseData = this.base;
            const params = {
                startPoint:this.startPoint,    // 起始点坐标 lng lat
                count:baseData.berths.val,  // 泊位数
                asideLen:baseData.asidelen.val,  // 匝道长度
                len:baseData.len.val,  // 站台长度
                isBroken:baseData.isBroken.val,  // 是否损坏
                eventTrackId:this.lineId
            }
            this.$root.eventHub.$emit('outputStation',params)
        },
        async insertStation(){ // 确定插入站台
            const checkValid = this.checkInput();
            if(!checkValid)
                return false;

            const baseData = this.base;
            const params = {
                userDefineName:baseData.userDefineName.val, // 自定义名称
                vertexId:this.vertexId,//地图中的顶点id
                berths:baseData.berths.val,  // 泊位数
                rampLength:baseData.asidelen.val,  // 匝道长度
                stationLength:baseData.len.val,  // 站台长度
                isBroken:baseData.isBroken.val?1:0  // 是否损坏
            }
            if(this.$route.query.stop){
                Object.assign(params,{
                    "id":this.$route.query.stop, //事件站台id
                })
                const editData = await editStation(params);
                if(editData.result != 0){
                    this.$message({
                        message: editData,
                        type: 'warning',
                        duration: 2000
                    })
                    return false;
                }
                this.$message({
                    message: '修改站台成功',
                    type: 'success',
                    duration: 2000
                })
            }else{
                // 确定请求接口 返回id和编号 
                Object.assign(params,{
                    eventId:this.$route.params.id,
                })
                const addData = await addStation(params);
                if(addData.result != 0){
                    this.$message({
                        message: 'addData',
                        type: 'warning',
                        duration: 2000
                    })
                    return false;
                }
                const {id,vertexId,name} = addData.detail;
                this.$root.eventHub.$emit('insertStation',{id,vertexId,name})
                this.$message({
                    message: '新建站台成功',
                    type: 'success',
                    duration: 2000
                })
            }
            setTimeout(() => {
                this.goBack();
            },100)
        },
        async giveUp(){  // 放弃删除
            if(this.mapFlag){
                return false;
            }
            this.$confirm(`确定${this.giveUpText}此站台?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(async () => {
                if(this.$route.query.stop){
                    const eventStationId = this.$route.query.stop;
                    const params = {
                        eventStationId
                    }
                    const data = await delStation(params);
                    if(data.result!=0){
                        this.$message({
                            message: data,
                            type: 'warning',
                            duration: 2000
                        })
                        return false;
                    }
                    console.log(this.vertexId)
                    this.$root.eventHub.$emit('deleteStation',{
                        stationId:eventStationId,
                        vertexId:this.vertexId
                    });
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    })
                }
                this.goBack();
            })
        },
        toggleBroken(){
            this.base.isBroken.val = !this.base.isBroken.val
        },
        checkInput(){
            let message = '';
            if(!this.vertexId){
                this.$message('必须选择站台位置');
                return false;
            }
            for(let i in this.base){
                const key = this.base[i];
                if(key.test != undefined){
                    let { test,val,name } = key;
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
    .mt20{
        margin-top:20px;
    }
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


<style scoped>
.sel-wrap{
    width: 100%;
    height: 40px;
    display: flex;
    line-height: 40px;
    position: relative;
}
.sel-wrap .sel-title{
    flex: 1;
    text-align: center;
}
.sel-wrap .sel-box{
    flex: 4;
    background: #fff;
    position: relative;
    cursor: pointer;
}
.sel-box .sel-show{
    padding: 0 10px;
    height: 40px;
    color:#000;
}
.sel-box .sel-icon{
    position: absolute;
    right: 0;top: 0;
    width: 40px;
    height: 40px;
}
.sel-wrap .sel-opts{
    width: 80%;
    position: absolute;
    right: 0;top: 45px;
    background: #fff;
    color:#aaa;
    cursor: pointer;
}
.sel-opts .opts-item{
    padding-left: 10px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #eee;
}
</style>

