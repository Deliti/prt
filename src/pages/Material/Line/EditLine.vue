<template>
    <section class="aside-menu-box gray_3 f_origin">
        <div class="type-box">
            <aside class="icon">轨道类</aside>
            <div class="track-type">{{focus.name}}</div>
        </div>
        <div class="form_wrap">
            <dl v-for="(item,index) in inputList" :key="index"
                class="form_item" v-if="item != 'isBroken' && item != 'dir'">
                <dd class="left form_key">{{base[item].name}}</dd>
                <dt class="right form_val">
                    <input type="text" 
                        :disabled="mapFlag?item != 'speed':false" 
                        :class="mapFlag && item != 'speed'?'disabled':''" 
                        v-model="base[item].val">
                </dt>
            </dl>
            <dl v-else
                class="form_item" >
                <dd class="left form_key">{{base[item].name}}</dd>
                <dt class="right form_check" :class="{'active':base[item].val}" @click="toggleBroken(item)">
                    <!-- <input type="checkbox" v-model="base.isBroken.val"> -->
                </dt>
            </dl>
        </div>
        <section>
            <div class="mt20 func-area f_black">
                <div class="func_btn submit_btn" @click="update()">确定</div>
                <div class="func_btn del_btn"
                    :class="mapFlag?'disabled':''"
                     @click="giveUp()">删除</div>
            </div>
        </section>
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
import { addTrack,updateTrack,trackDetail,trackDel,getTargetLngLat } from '@/service/getData'
export default {
    data(){
        return{
            showOpts:false,  // 下拉框显示
            focus:{
                id:1,
                name:'直轨'
            },
            selectData : [  // 下拉框数据
                {
                    id:1,
                    name: '直轨'
                },
                {
                    id:2,
                    name: '弯轨'
                },
                {
                    id:3,
                    name: '坡轨'
                }
            ],
            startPoint:{
                lng:'',
                lat:''
            },
            base: {
                len:{    
                    name:'长度（米）',
                    val: 0,
                    test: 'number'
                },
                dirAngle:{    
                    name:'方向(与x轴夹角0 - 360度)',
                    val: 0,
                    test: 'number'
                },
                dir:{
                    name:'弧线朝向',
                    val: true
                },
                centralAngle:{            
                    name:'圆心角',
                    val: 0,
                    test: 'number'
                },
                slope:{    
                    name:'斜率',
                    val: 0,
                    test: 'number'
                },
                speed:{   
                    name:'设计时速(km/h)',
                    val: 0,
                    test: 'numberNoZero'
                },
                isBroken:{        
                    name:'是否损坏',
                    val: false
                }
            },
            del:false
        }
    },
    computed:{
        ...mapState(['lineData','mapFlag']),
        isEdit(){
            return !this.$route.query.track && this.showOpts;
        },
        inputList(){
            let inputArr = ['len','speed'];
            switch(this.focus.id){
                case 1:
                    break;
                case 2:
                    inputArr.push(...['centralAngle','dir']);
                    break;
                case 3:
                    inputArr.push('slope')
                    break;
            }
            inputArr.push('isBroken');
            return inputArr;
        }
    },
    created(){
        this.$root.eventHub.$on('givePoint', this.setStartPoint);  
    },
    mounted(){
        this.$route.query.track && this.getDetail();
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': 'getDetail'
    },
    methods:{
        ...mapMutations(['SETEDITID','DELLINE','INSERTLINE','SETEDITLINE']),
        goBack(){
            window.history.go(-1);
        },
        setStartPoint(obj){
            this.startPoint.lng = obj.lng;
            this.startPoint.lat = obj.lat;
        },
        async getDetail(){
            const params = {
                eventTrackId:this.$route.query.track
            }
            const trackData = await trackDetail(params);
            if(trackData.result!=0){
                this.$message({
                    message: trackData,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            const detail = trackData.detail.track;
            
            this.base.len.val = detail[0].length;
            this.base.dirAngle.val = detail[0].arcAngle;
            this.base.dir.val = detail[0].arcDirection == 1?true:false;
            this.base.centralAngle.val = detail[0].radius;
            this.base.slope.val = detail[0].slope;
            this.base.speed.val = detail[0].limitSpeed;
            this.base.isBroken.val = detail[0].isBroken == 1?true:false;
            this.hasStation = trackData.detail.station == 1?true:false;
        },
        async reDraw(){
            const params = {
                eventTrackId:this.$route.query.track
            }
            const trackData = await trackDetail(params);
            if(trackData.result!=0){
                this.$message({
                    message: trackData,
                    type: 'warning',
                    duration: 2000
                })
                console.log(trackData);
                return false;
            }
            const detail = trackData.detail.track;
            this.lineData.edit.overlay && this.DELLINE();
            this.$root.eventHub.$emit('insertLine',detail[0])
        },
        async update(){ // 更新轨道
            const baseData = this.base;
            const params = {
                "id":this.$route.query.track, //事件轨道id
                "type":this.focus.id,  //轨道类型 1直轨 2弯轨  3坡轨
                "isBroken":baseData.isBroken.val?1:0,  //是否损坏 1是 0否
                "length":baseData.len.val,  //长度
                "radius":baseData.centralAngle.val,//圆心角 度（°）
                "slope":baseData.slope.val,//斜率
                "limitSpeed":baseData.speed.val, //限速
                "arcAngle":baseData.dirAngle.val, //弯轨AB点与水平线X轴的夹角 逆时针0-360度
                "arcDirection":baseData.dir.val?1:0,//弯轨弧度朝向 1 是逆时针 0 是顺时针
            }
            const editData = await updateTrack(params);
            if(editData.result != 0){
                this.$message({
                    message: editData,
                    type: 'warning',
                    duration: 2000
                })
                console.log(editData);
                return false;
            }
            this.$message({
                message: '更新轨道成功',
                type: 'success',
                duration: 2000
            })
            this.$root.eventHub.$emit('updateTrack',editData.detail[0]); 
            console.log('更新轨道成功');   
            this.goBack();
        },
        giveUp(){  // 放弃删除
            if(this.mapFlag){
                return false;
            }
            this.$confirm('确定删除此轨道?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const eventTrackId = this.$route.query.track;
                const params = {
                    eventTrackId
                }
                const data = await trackDel(params);
                if(data.result!=0){
                    this.$message({
                        message: data,
                        type: 'warning',
                        duration: 2000
                    })
                    return false;
                }
                this.$root.eventHub.$emit('deleteEdge',{
                    edgeId:eventTrackId,
                    vertexIds:data.detail
                });
                this.$message({
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                })
                // 删除轨道和对应的点
                this.goBack();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        toggleBroken(key){
            this.base[key].val = !this.base[key].val;
        }
    }
}
</script>


<style lang="less" scoped>
@screen-md:1200px;
@screen-lg:1800px;


.aside-menu-box{
    box-sizing: border-box;
    width: 100%;
    padding: 20px 35px 0;
    position: absolute;
    left: 0;top: 0; 
    @media (min-width:@screen-lg) {
        padding: 45px 50px 0;
    }
    .type-box{
        display: flex;
        height: 100px;
        color: #FCB415;
        text-align: center;
        line-height: 100px;
        padding-bottom: 20px;
        @media (min-width:@screen-lg) {
            padding-bottom: 35px;
            height: 150px;
            line-height: 150px;
        }
        .icon{
            flex: 10;
            height: 100%;
            background:rgba(255,255,255,.3) url('../img/icon-1.png') center center no-repeat;
            background-size: 65px 25px;
            box-sizing: border-box;
            padding-top: 50px;
            font-size: 12px;
            line-height: 50px;
            @media (min-width:@screen-lg) {
                background-size: 95px 40px; 
                padding-top: 100px;
                font-size: 18px;
            }
        }
        .track-type{
            flex: 13;
            background: rgba(255,255,255,.15);
            height: 100%;
            font-size: 18px;
            @media (min-width:@screen-lg) {
                font-size: 30px;
            }
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
                @media (min-width:@screen-lg) {
                    font-size: 18px;
                }
            }
            .form_val{
                width: 50%;
                height: 30px;
                box-sizing: border-box;
                input{
                    width: 100%;
                    height: 100%;
                    border:none;
                    text-align: right;
                    box-sizing: border-box;
                    padding-right: 10px;
                    box-shadow: 0 0 1px 3px rgba(0,0,0,.8) inset;
                    border-radius: 8px;
                    @media (min-width:@screen-lg) {
                        font-size: 18px;
                    }
                }
            }
            .form_check{
                width: 65px;
                height: 20px;
                box-sizing: border-box;
                background: url('../img/no-check.png') no-repeat;
                background-size: 100% 100%;
                cursor: pointer;
            }
            .active{
                background: url('../img/check.png') no-repeat;
                background-size: 100% 100%;
            }
        }   
    }
    .mt20{
        margin-top:20px;
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
            background: #FCB415;
            &:hover,&:active{
                background: #FEF0D0
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

