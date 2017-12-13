<template>
  <div>
      <div class="handbox">
            <button @click="startPlay" :style="{background:isStart?'#ccc':'#fff'}">开始</button>
            <button @click="pausePlay">{{pauseStatus}}</button>
            <button @click="stopPlay">停止</button><br/>
            <span>{{lat}}</span><br/>
            <span>{{lon}}</span><br/>
            <button @click="dwm('polyline')">画线</button>
      </div>
      <div id="allmap" class="mapbox"></div>
  </div>
</template>

<script>
import {MP} from '@/service/map'
export default {
    data(){
        return {
            BMap:null,
            lat:0,
            lon:0,
            bodyH:'0px',
            bmap:null,
            bDwm:null,
            index:0,
            points:[],  // 路线点
            lushu:null, // 路书
            interval:null, // 全局唯一  定时器
            marker:null,  // 地图icon
            markers:[],
            isStart:false, // 开始
            isPause:false   // 暂停
        }
    },
    computed:{
        pauseStatus(){
            if(this.isPause){
                return '继续'
            }else{
                return '暂停'
            }
        }
    },
    beforeMount(){
        const body = document.querySelector('body');
        this.bodyH = body.clientHeight;
    },
    mounted(){
        MP('ndYEn2os3DVI5fW83tzaUkD4').then(BMap => {
            this.BMap = BMap;
            this.mapInit();
        })
    },
    methods:{
        mochaData(){
            const track = [ [117.270591,23.812975],
                        [117.227819,23.814327],
                        [117.171452,23.800036],
                        [117.132368,23.791609],
                        [117.076919,23.764658],
                        [117.024827,23.754510],
                        [116.981047,23.739533],
                        [116.939091,23.717617],
                        [116.900199,23.699399],
                        [116.885031,23.689196],
                        [116.874584,23.679668],
                        [116.811841,23.626940],
                        [116.759632,23.604713],
                        [116.725061,23.587160],
                        [116.651402,23.566650],
                        [116.595323,23.545934],
                        [116.565463,23.533553],
                        [116.552337,23.519046],
                        [116.544596,23.508704],
                        [116.537630,23.464337],
                        [116.528264,23.443634],
                        [116.518571,23.425543],
                        [116.502256,23.414608],
                        [116.429954,23.388459]
                        ];
            track.map((v,i) => {
                const point = new this.BMap.Point(v[0],v[1]);
                this.points.push(point);
            })
            const polyline = new this.BMap.Polyline(this.points,{
                strokeColor:'#ff00ff', 
                strokeWeight:3, 
                strokeOpacity:1
            })
            polyline.dataId = '012345'
            polyline.addEventListener('click',function(e){
                console.log(this.dataId);
            })
            this.bmap.addOverlay(polyline);
        },
        mapInit(){
            const mapDom = document.querySelector('#allmap');
            mapDom.style.height = this.bodyH+'px';
            const bmap = new this.BMap.Map('allmap');
            this.bmap = bmap;
            this.mochaData();
            bmap.centerAndZoom(new this.BMap.Point(116.404, 39.915), 13);
            bmap.setViewport(this.points);
    //         bmap.addEventListener("click",(e) => {
    // // console.log("鼠标单击地方的经纬度为：",e.point.lng + "," + e.point.lat);
    //             this.lat = e.point.lat;
    //             this.lon = e.point.lng;
    //         });
            this.iconInit();
            this.playTrack();
            // 实例化画线工具
            const styleOptions = {
                strokeColor:"red",    //边线颜色。
                fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 3,       //边线的宽度，以像素为单位。
                strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
                fillOpacity: 1,      //填充的透明度，取值范围0 - 1。
                strokeStyle: 'solid' //边线的样式，solid或dashed。
            }
            this.bDwm = new BMapLib.DrawingManager(bmap, {
                 isOpen: false, //是否开启绘制模式
                enableDrawingTool: true, //是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                    offset: new this.BMap.Size(5, 5), //偏离值
                },
                circleOptions: styleOptions, //圆的样式
                polylineOptions: styleOptions, //线的样式
                polygonOptions: styleOptions, //多边形的样式
                rectangleOptions: styleOptions //矩形的样式
            })
        },
        dwm(mode){
            const DrawingType = {
                BMAP_DRAWING_MARKER:false,// 画点 
                BMAP_DRAWING_CIRCLE:false, // 画圆 
                BMAP_DRAWING_POLYLINE:true, //  画线 
                BMAP_DRAWING_POLYGON:false,// 画多边形 
                BMAP_DRAWING_RECTANGLE:false // 画矩形
            }
            this.bDwm.setDrawingMode(DrawingType);
            this.bDwm.open();
        },
        iconInit(){
            // const myIcon = new this.BMap.Icon("http://api.map.baidu.com/lbsapi/cloud/cms/Mario.png",
            // {width:128,height:128},{anchor:new this.BMap.Size(65,128)});
            // const arr = [1,4]; // 接口返回位置初始值
            //  this.marker = new this.BMap.Marker(this.points[0],{icon:myIcon})
            //     this.bmap.addOverlay(this.marker)
            // arr.map((v) => {
            //     marker = new BMap.Icon(this.points[v])
            //     this.bmap.addOverlay(marker)
            //     this.markers.push(marker)
            // })

            this.markers = [
                this.points[7],//饶平站
                this.points[15],//潮汕站
                this.points[23],//潮阳站
            ];
            const icon1 = new BMap.Icon('http://source.fooleap.org/marker.png', new BMap.Size(19,25),{anchor: new BMap.Size(9, 25)});//地点
            this.markers.map((v) => {
                marker = new BMap.Marker(v,{icon:icon1})
                this.bmap.addOverlay(marker)
                this.markers.push(marker)
            })
        },
        // playTrack(){
        //     const myIcon = new this.BMap.Icon("http://api.map.baidu.com/lbsapi/cloud/cms/Mario.png",
        //     {width:128,height:128},{anchor:new this.BMap.Size(65,128)});
        //     if(this.index >= this.points.length-2){
        //         // clearInterval(this.interval);
        //         this.index = 0;
        //     }
        //     this.index++;
        //     this.bmap.removeOverlay(this.marker);
        //     this.marker = new this.BMap.Marker(this.points[this.index],{icon:myIcon})
        //     this.bmap.addOverlay(this.marker)
        // },
        // startPlay(){
        //     if(!this.isStart){
        //         this.isStart = true;
        //         this.interval = setInterval(this.playTrack,1000);
        //     }
        // },
        // pausePlay(){
        //     this.isPause = !this.isPause;
        //     if(this.isPause){
        //         clearInterval(this.interval);
        //     }else{
        //         this.interval = setInterval(this.playTrack,1000);
        //     }
        // },
        // stopPlay(){
        //     this.index = 0;
        //     clearInterval(this.interval);
        //     this.bmap.removeOverlay(this.marker);
        //     this.isPause = false;
        //     this.isStart = false;
        //     this.iconInit();
        // }
        playTrack(){
            const myIcon = new BMap.Icon('http://source.fooleap.org/power-car.png', new BMap.Size(30, 30), {anchor: new BMap.Size(15, 15)});//动车
            // const myIcon = new this.BMap.Icon("http://api.map.baidu.com/lbsapi/cloud/cms/Mario.png",
            // {width:128,height:128},{anchor:new this.BMap.Size(65,128)});
            this.lushu = new BMapLib.LuShu(this.bmap,this.points,{
                icon:myIcon,
                landmarkPois:[
                    {lng:this.markers[0].lng,lat:this.markers[0].lat,html:'饶平站到了',pauseTime:1},
                    {lng:this.markers[1].lng,lat:this.markers[1].lat,html:'<img src="http://source.fooleap.org/chaoshan.jpg?imageView2/2/w/150" />潮汕站到了',pauseTime:2},
                    {lng:this.markers[2].lng,lat:this.markers[2].lat,html:'潮阳站到了',pauseTime:1},
                    {lng:this.markers[3].lng,lat:this.markers[3].lat,html:'普宁站到了',pauseTime:1},
                    {lng:this.markers[4].lng,lat:this.markers[4].lat,html:'葵潭站到了',pauseTime:1}
                ],//显示的特殊点，似乎是必选参数，可以留空，据说要和距原线路10米内才会暂停，这里就用原线的点
                defaultContent: '动车继续前行',//覆盖物内容，这个填上面的特殊点文字才会显示
                speed:'1000'
            });
        },
        startPlay(){
            // if(!this.isStart){
            //     this.isStart = true;
                
            // }
            this.lushu.start();
        },
        pausePlay(){
            this.isPause = !this.isPause;
            if(this.isPause){
               this.lushu.pause();
            }else{
                this.lushu.start();
            }
        },
        stopPlay(){
            this.lushu.stop();
        }
    }
}
</script>

<style scoped>
    .mapbox{
        width:80%;
        float: right;
    }
    .handbox{
        float:left;
        width:20%;
        height: 600px;
    }
</style>


