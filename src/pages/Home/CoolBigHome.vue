<template>
  <div class="main-container">
      <nav-div @resetMap="resetMap" @selfFresh="selfFresh"></nav-div>
      <div class="main">
        <section v-show="mapFlag" class="charts-area">
            <div class="charts chart-l-1">
                <h3 class="h3title">车辆总数</h3>
                <b class="count">{{levelData['carCount']?levelData['carCount']:0}}</b>
            </div>
            <div class="charts chart-l-2" id="roadStatus"></div>
            <div class="charts chart-l-3" id="roadSpeed"></div>
        </section>
        <map-div class="map" ref="map"></map-div>
        <section v-show="mapFlag" class="charts-area">
            <div class="charts chart-l-1">
                <h3 class="h3title">轨道总数</h3>
                <b class="count">{{levelData['edgeCount']?levelData['edgeCount']:0}}</b>
            </div>
            <div class="charts chart-l-2" id="roadCar"></div>
            <div class="charts chart-l-3" id="carSpeed"></div>
        </section>
        <aside v-if="!mapFlag" class="handle-area gray_3">
            <router-view class="child"></router-view>
        </aside>
      </div>
  </div>
</template>

<script>
import NavDiv from 'components/nav'
import MapDiv from 'pages/Main/CoolBigDataMap'
import { mapState, mapMutations, install } from 'vuex'
var echarts = require('echarts')
import { roadStatusOptions, roadSpeedOptions, roadCarOptions, carSpeedOptions } from '@/config/echarts'
export default {
    data(){
        return {
            roadStatus: null, // 左二
            roadSpeed: null, // 左三
            roadCar: null,
            carSpeed: null,
            tableData: [
                {
                    position: 'left'
                }
            ]
        }
    },
    computed: {
        ...mapState(['mapFlag', 'levelData'])
    },
    methods:{
        ...mapMutations(['SETMAPFLAG']),
    },
    mounted(){
        window.addEventListener('beforeunload',this.sendMsg);
    },
    beforeDestroy(){
        window.removeEventListener('beforeunload',this.sendMsg)
    },
    components:{
      NavDiv,
      MapDiv
    },
    methods:{
        chartsInit(cb){
            this.$nextTick(() => {
                this.roadStatus = echarts.init(document.querySelector('#roadStatus'))
                this.roadSpeed = echarts.init(document.querySelector('#roadSpeed'))
                this.roadCar = echarts.init(document.querySelector('#roadCar'))
                this.carSpeed = echarts.init(document.querySelector('#carSpeed'))  
                cb()     
            })
            // 绘制图表
            
        },
        sendMsg(){
            return '您确定离开此页面吗'
        },
        resetMap(){
            console.log(this.$refs.map)
            this.$refs.map.reLoadMap();
        },
        selfFresh(){
            this.$refs.map.selfRefreshTile()
        },
        // 将后台数据转换成echats数据
        transCharts(type){ 
            switch(type){
                case 'roadStatus':
                    if(this.levelData.roadStatus){
                        return Object.values(this.levelData.roadStatus).map(item => item.length)
                    }else{
                        return []
                    }
                case 'roadSpeed':
                    if(this.levelData.edgeOrderBySpeed && this.levelData.edgeOrderBySpeed instanceof Array){
                        const xAxis = []
                        const yAxis = []
                        for(let i = 0;i<this.levelData.edgeOrderBySpeed.length;i++){
                            if (i >= 5){
                                break;
                            }
                            xAxis.push(this.levelData.edgeOrderBySpeed[i].name)
                            yAxis.push(this.levelData.edgeOrderBySpeed[i].carSpeed)
                        }
                        return {
                            xAxis,
                            yAxis
                        }
                    }else{
                        return {
                            xAxis:[],
                            yAxis:[]
                        }
                    }
                case 'roadCar':
                    if(this.levelData.edgeOrderByCarCount && this.levelData.edgeOrderByCarCount instanceof Array){
                        const xAxis = []
                        const yAxis = []
                        for(let i = 0;i<this.levelData.edgeOrderByCarCount.length;i++){
                            if (i >= 5){
                                break;
                            }
                            xAxis.push(this.levelData.edgeOrderByCarCount[i].name)
                            yAxis.push(this.levelData.edgeOrderByCarCount[i].carCount)
                        }
                        return {
                            xAxis,
                            yAxis
                        }
                    }else{
                        return {
                            xAxis:[],
                            yAxis:[]
                        }
                    }
                case 'carSpeed':
                    if(this.levelData.carSpeedSectorDiagia){
                        const xAxis = []
                        const yAxis = []
                        Object.keys(this.levelData.carSpeedSectorDiagia).map(item => {
                            xAxis.push(item)
                            yAxis.push({
                                name: `${item} - ${item-0+20}占比`,
                                value: this.levelData.carSpeedSectorDiagia[item]
                            })
                        })
                        console.log('xA',xAxis)
                        console.log('ya',yAxis)
                        return {
                            xAxis,
                            yAxis
                        }
                    }else{
                        return {
                            xAxis:[],
                            yAxis:[]
                        }
                    }
            }
        }
    },
    watch: {
        levelData (nval) {
            if(this.mapFlag){
                const s = this.transCharts('roadStatus')
                const roadSpeedxyAxis = this.transCharts('roadSpeed')
                const roadCarxyAxis = this.transCharts('roadCar')
                const carSpeedxyAxis = this.transCharts('carSpeed')
                if(!this.roadStatus){
                    this.chartsInit(() => {
                        this.roadStatus.setOption(roadStatusOptions(s));
                        this.roadSpeed.setOption(roadSpeedOptions(roadSpeedxyAxis.xAxis, roadSpeedxyAxis.yAxis));
                        this.roadCar.setOption(roadSpeedOptions(roadCarxyAxis.xAxis, roadCarxyAxis.yAxis));
                        this.carSpeed.setOption(carSpeedOptions(carSpeedxyAxis.xAxis, carSpeedxyAxis.yAxis));
                    })
                }else{
                    this.roadStatus.setOption(roadStatusOptions(s));
                    this.roadSpeed.setOption(roadSpeedOptions(roadSpeedxyAxis.xAxis, roadSpeedxyAxis.yAxis));
                    this.roadCar.setOption(roadSpeedOptions(roadCarxyAxis.xAxis, roadCarxyAxis.yAxis));
                    this.carSpeed.setOption(carSpeedOptions(carSpeedxyAxis.xAxis, carSpeedxyAxis.yAxis));
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
@screen-md:1200px;
@screen-lg:1800px;
.main-container{
    width: 100%;
    height: 100%;
    .main{
        overflow: hidden;
        height: calc(~"100% - 40px");
        display: flex;
    }
    .map{
        min-width: 660px;
        width: calc(~'100% - 300px') ;
        height: 100%; 
        @media (min-width:@screen-lg) {
            width: calc(~"100% - 450px")
        }
    }
    .charts-area{
        width: 300px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .charts{
            height: 30%;
            border-style: solid;
            border-width: 14px 10px;
            border-image-source: url(../../common/images/mapv-panel-border-style1.png);
            border-image-slice: 14 10;
            .h3title{
                width: 100%;
                margin: 30px 0 10px 0;
                text-align: center;
                font-size: 24px;
                color: rgb(248, 188, 56);
            }
            .count{
                font-size: 22px;
                color: yellow;
            }
        }
        .chart-l-1{
            height: 160px;
            text-align: center;
        }
    }
    .handle-area{
        width: 300px;
        height: 100%;
        position: relative;
        @media (min-width:@screen-lg) {
            width: 450px;
        }
        .child{
            width: 100%;
            height: 100%;
            position: relative;
        }
    }
}




</style>

