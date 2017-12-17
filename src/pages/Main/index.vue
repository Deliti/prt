<template>
    <div class='map-box'>
        <div id="map" class="BMap_mask">
            <div style="display:none">{{delStation}}{{delSave}}</div>
        </div>
        <div v-show="isHttp" class="hide-wrap shade">
            <div class="hide-loading"></div>
            <p>正在加载数据...</p>
        </div>
    </div>
    
    
</template>

<script>
import {MP} from '@/service/map'
import router from '@/router'
import {mouseEnterHandle,mouseOutHandle} from 'common/js/lib/mouse'
import {mapState,mapMutations} from 'vuex'
import {trackColor} from '@/config/env'
import {getParam,transRes,_bind} from '@/config/mUtils'
import { pointDrag,curline,isPointOnPolyline,getPoint } from 'common/js/BMap.getLine'
import savepng from '@/assets/save.png'
import bigIcon from './img/icon-big.png';
import carIcon from './img/car.png';
import { getMaterial,editStorage,addTrack } from '@/service/getData'


let carList = {};  // 所有车辆数组
let carMarkers = []; // 车辆最初carMarker
let drawingManager = null; // 绘图工具
const { normal, broken, crowd } = trackColor;
const dashStyleOptions = {
    strokeColor:normal,    //边线颜色。
    fillColor:normal,      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'dashed' //边线的样式，solid或dashed。
}
const styleOptions = {
    strokeColor:normal,    //边线颜色。
    fillColor:normal,      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。  
}
const dashOptions = {
    strokeColor:normal,    //边线颜色。
    fillColor:normal,      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'dashed' //边线的样式，solid或dashed。 
}
const labelStyle = {
    color : normal,
    fontSize : "12px",
    borderColor: normal,
    height : "20px",
    lineHeight : "20px",
    fontFamily:"微软雅黑"
}
const storageOptions = {
    strokeColor:"blue",    //边线颜色。
    fillColor:"blue",      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'dashed' //边线的样式，solid或dashed。
}
let ALL_PT = {};  // 全局维护的所有的点
let ALL_MARKER = {}; // 全局维护的所有点的实例
let ALL_LINE = {};  // 全局维护的轨道实例
let ALL_STATION = {}; // 全局维护的站台实例
let ALL_STORAGE = {}; // 全局维护的存储实例
export default {
    data(){
        return{
            BMap:null, // 地图对象
            bmap:null,
            mapProjection:null, // 转换地图类型后的地图
            mPoint:null,  // 选择的坐标点
            arriveNum:0,
            carNum:0,
            isHttp:false  // 没有再掉接口
        }
    },
    computed:{
        ...mapState(['lineData','station','save','mapFlag','runStatus']),
        delStation(){
            if(this.station.edit.overlay && this.station.edit.overlay.del){
                this.bmap.removeOverlay(this.station.edit.overlay)
                setTimeout(() => {
                    this.SETEDITSTATION(null);
                },1000)
                return 1;
            }else{
                return 0;
            }
        },
        delSave(){
            if(this.save.edit.overlay && this.save.edit.overlay.del){
                this.bmap.removeOverlay(this.save.edit.overlay)
                setTimeout(() => {
                    this.SETEDITSAVE(null);
                },1000)
                return 1;
            }else{
                return 0;
            }
        }
    },
    props:{

    },
    created(){
        this.$root.eventHub.$on('resetMap',this.resetMap);
        this.$root.eventHub.$on('foucsIt',this.getFoucs);

        this.$root.eventHub.$on('clickPoint',this.setAllowPoint);  // 开启选点模式
        this.$root.eventHub.$on('openDrawer',this.openDrawer); // 开启绘制
        this.$root.eventHub.$on('outputLine',this.outLine);        // 生成轨迹
        this.$root.eventHub.$on('insertLine',this.importLine);     // 插入和更新的时候地图更新
        this.$root.eventHub.$on('deleteEdge',this.deleteEdge); // 删除轨道
        this.$root.eventHub.$on('deleteStation',this.deleteStation); // 删除轨道
        
        this.$root.eventHub.$on('bindMapObj',this.bindMapObj);        // 绑定这条线
        this.$root.eventHub.$on('bindDrag',this.bindDrag);        // 开启拖拽
        this.$root.eventHub.$on('outputStation',this.outputStation);        // 生成站台
        this.$root.eventHub.$on('insertStation',this.importStation);     // 插入和更新的时候地图更新
        this.$root.eventHub.$on('outputStorage',this.outputStorage);        // 生成站台
        this.$root.eventHub.$on('insertStorage',this.importStorage);     // 插入和更新的时候地图更新
        
        this.$root.eventHub.$on('createCarList',this.createCarList);
        this.$root.eventHub.$on('orderCar',this.orderCar);
    },
    mounted(){
        this.SETMAPFLAG(false);
        MP('ndYEn2os3DVI5fW83tzaUkD4').then(BMap => {
            this.BMap = BMap;
            this.mapInit();
        })
    },
    beforeDestroy(){
        this.SETMAPFLAG(false);
        this.clearAll(); 
        this.bmap.clearOverlays();
    },
    methods:{
        ...mapMutations(['SETEDITLINE','INSERTMAPLINE','RESETLINE','SETEDITSTATION','INSERTMAPSTATION','SETEDITSAVE','INSERTMAPSAVE','CHANGERUNSTATUS','SETHASCAR','SETMAPFLAG']),
        mapInit(){
            const bmap = new this.BMap.Map('map',{enableMapClick:false});
            window.map = bmap;
            this.bmap = bmap;
            this.mapProjection = bmap.getMapType().getProjection();
            bmap.centerAndZoom(new this.BMap.Point(116.404, 39.915), 18);
            this.setMapBase();
            this.initAction();
            this.fetchAllData();
        },
        clearAll(){
            ALL_PT = {};  // 全局维护的所有的点
            ALL_MARKER = {}; // 全局维护的所有点的实例
            ALL_LINE = {};  // 全局维护的轨道实例
            ALL_STATION = {}; 
            ALL_STORAGE = {};
            carList = {};  // 所有车辆数组
            carMarkers = []; // 车辆最初carMarker
        },
        resetMap(){
            this.isHttp = true;
            Object.values(carList).map(car => {
                car.stop();
                this.bmap.removeOverlay(car._marker);
                this.bmap.removeOverlay(car._overlay);
            })
            this.bmap.clearOverlays();
            this.clearAll();
            this.carNum = 0;
            this.arriveNum = 0;
            this.SETHASCAR(false);
            this.fetchAllData();
        },
        setMapBase(){
            this.bmap.enableScrollWheelZoom();
            this.bmap.enableAutoResize();
        },
        initAction(){
            this.bmap.addEventListener('mousemove',mouseEnterHandle);
            this.bmap.addEventListener('click',this.mapChoosePt); // 选点
            drawingManager = new BMapLib.DrawingManager(this.bmap, {
                isOpen: false, //是否开启绘制模式
                enableDrawingTool: false, //是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                    offset: new BMap.Size(5, 5), //偏离值
                },
                polylineOptions: dashStyleOptions, //线的样式
                verifyFirst:this.verifyAll,
                verifyAll:this.verifyAll,
                callback:this.drawLine
            });  
            drawingManager._setDrawingMode('polyline');
        },
        async fetchAllData(){  // 最开始获取所有数据
            const params = {
                eventId: this.$route.params.id,
                materialType:0
            }
            const allList = await getMaterial(params);
            this.isHttp = true;
            if(allList.result != 0){
                this.$message({
                    type:'warning',
                    message:allList,
                    duration:2000
                })
                return false;
            }
            if(this.mapFlag){
                this.createPoint(allList.detail[1].vertexList,false);
            }else{
                this.createPoint(allList.detail[1].vertexList,true); 
            }
            console.log('all',JSON.stringify(ALL_STATION))
            setTimeout(() => {
                this.createLine(allList.detail[1].edgeList);
                allList.detail[2].map((item) => {
                    const {id,vertexId,name} = item;
                    this.importStation({id,vertexId,name});
                })
                setTimeout(() => {
                    allList.detail[3].map(item => {
                        const position = {
                            lon:item.longitude,
                            lat:item.latitude
                        }
                        const {
                            id,
                            name,
                            vertexId
                        } = item;
                        this.importStorage({id,vertexId,name,position})
                    })
                    this.isHttp = false;
                },500)
            },500)
            // this.bmap.setViewport(allPoints);
        },
        getFoucs({type,id}){
            let points;
            switch(type){
                case 'line':
                    const linePoints = ALL_LINE[id].line.getPath();
                    this.bmap.setViewport(linePoints);
                    break;
                case 'station':
                    points = this.station.edit.overlay.getPosition();
                    this.bmap.centerAndZoom(points,23)
                    break;
                case 'save':
                    points = this.save.edit.overlay.getPosition();
                    this.bmap.centerAndZoom(points,23)
                    break;
            }
        },
        setAllowPoint(type){
            this.allowPoint = true;
        },

        /**
         * @desc 开启绘制
         */
        openDrawer(){
            drawingManager.open()
        },
        /**@augments e 地图事件
         * @description 验证是否为第一个点
         */
        verifyAll(e,num){
            const allPtArr = Object.keys(ALL_PT);
            let crossPt = "";
            console.log(allPtArr)
            if(allPtArr.length > 0){ 
                for(let i in ALL_PT){
                    let targetPt = new BMap.Point(ALL_PT[i].lon,ALL_PT[i].lat);
                    const dis = this.bmap.getDistance(e.point,targetPt);
                    if(dis < 5){
                        crossPt = i;
                        break;
                    }
                }
                if(num == 0 && !crossPt){
                    this.$message({
                        type:'info',
                        message:'请将地图放大到最大层级进行选择已存在的点'
                    })
                }
                return crossPt?crossPt:false;
            }
            return true;
        },
        /**@augments points 绘制完成点的合集
         * @augments overlay 绘制完成暂时的overlay
         * @description 将所有点传回 点之间的对应关系传回 得到点和线的后台数据
         */
        async drawLine(points,overlay){
            this.isHttp = true;
            const vertexList = [];
            const edgeList = [];
            points.map((item,index) => {
                const vId = overlay.UDF[index]?overlay.UDF[index]:`temp_${index}`; 
                const pointItem = {
                    vertexId:vId,
                    lon:item.lng,
                    lat:item.lat,
                    inGraph:overlay.UDF[index]?1:0
                }
                vertexList.push(pointItem);
                if(index < points.length-1){
                    const nxtId = overlay.UDF[index+1]?overlay.UDF[index+1]:`temp_${index+1}`;
                    const edgeItem = {
                        edgeId:`edge_temp_${index}`,
                        src:vId,
                        dst:nxtId,
                        inGraph:0 
                    } 
                    edgeList.push(edgeItem);
                }
            })
            console.log('vertexList',vertexList);
            console.log('edgeList',edgeList);
            // 与后台交换数据
            const params = {
                eventId:this.$route.params.id,
                vertexList,
                edgeList
            }
            const trackData = await addTrack(params);
            if(trackData.result != 0){
                this.$message({
                    message: trackData,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            const resData = trackData.detail;
            // 模拟后段接口字段
            console.log(resData)
            this.isHttp = true;
            this.createPoint(resData.vertexList,true);
            this.createLine(resData.edgeList);
            this.$root.eventHub.$emit('addCountLine');
            this.bmap.removeOverlay(overlay);
            this.isHttp = false;
        },
        // 根据后端返回的点保存到ALL_PT 并生成marker
        createPoint(resPoints,bool){
            let nowP = '';
            let resAll = [];
            if(resPoints && resPoints instanceof Array){
                nowP = {};
                resPoints.map(function(i,inx){
                    const vertexId = i.vertexId;
                    ALL_PT[vertexId] = {};
                    Object.assign(ALL_PT[vertexId],i);
                    // 是将这次的点单独提出来
                    nowP[vertexId] = {};
                    Object.assign(nowP[vertexId],i);
                })
            }
            const points = nowP || ALL_PT;
            for(let item in points){
                const pt = points[item];
                const mapPt = new BMap.Point(pt.lon,pt.lat);
                resAll.push(mapPt);
                if(!bool){
                    continue;
                }
                if(ALL_MARKER.hasOwnProperty(item)){
                    continue; 
                }
                const marker = new BMap.Marker(mapPt,{
                    icon: new BMap.Icon('http://api.map.baidu.com/library/CurveLine/1.5/src/circle.png', new BMap.Size(16,16))
                })
                marker.UDF = {};
                Object.assign(marker.UDF,pt);
                ALL_MARKER[item] = marker;
                this.bmap.addOverlay(marker);
                marker.enableDragging();
                const _self = this;
                setTimeout(() => {
                    // 拖拽
                    _bind(marker,'dragging',function(e){
                        const that = this;
                        _self.drawDash(e,that)
                    });
                    _bind(marker,'dragend',function(e){
                        const that = this;
                        _self.dragDashEnd(e,that)
                    });
                    // 点击
                    _bind(marker,'click',function(e){
                        const that = this;
                        _self.clcikPoint(e,that);
                    })
                    // 高亮
                    _bind(marker,'mouseover',function(e){
                        this.setIcon(new BMap.Icon(bigIcon, new BMap.Size(20,20))) 
                        // this.setIcon(new BMap.Icon('http://api.map.baidu.com/library/CurveLine/1.5/src/circle.png'), new BMap.Size(20,20));
                    })
                    _bind(marker,'mouseout',function(e){
                        this.setIcon(new BMap.Icon('http://api.map.baidu.com/library/CurveLine/1.5/src/circle.png', new BMap.Size(16,16))) 
                    })
                },1000)
            } 
            this.bmap.setViewport(resAll);
            resAll = null;
        },
        // 根据后端返回的点保存到ALL_LINE 
        createLine(lines){
            console.log('points',ALL_PT);
            console.log('lines',lines)
            lines instanceof Array 
            && lines.map((item,index) => {
                const pts = [];
                const ptA = ALL_PT[item.src];
                const APt = new BMap.Point(ptA.lon,ptA.lat);
                pts.push(APt);
                
                const ptB = ALL_PT[item.dst];
                const BPt = new BMap.Point(ptB.lon,ptB.lat);
                pts.push(BPt);
                if(ALL_LINE.hasOwnProperty(item.edgeId)){
                    return false;
                }
                styleOptions.strokeColor =  item.isBroken == '1'?broken:normal; 
                ALL_LINE[item.edgeId] = {};
                ALL_LINE[item.edgeId].line = new BMap.Polyline(pts,styleOptions);
                map.addOverlay(ALL_LINE[item.edgeId].line);
                const lineLabel = new BMap.Label(item.name,{
                    offset:new BMap.Size(-10,-10),
                    position:new BMap.Point(
                        (ptA.lon+ptB.lon)/2,
                        (ptA.lat+ptB.lat)/2
                    )
                })   
                lineLabel.setStyle(labelStyle);
                ALL_LINE[item.edgeId].label = lineLabel;
                map.addOverlay(lineLabel);
                _bind(ALL_LINE[item.edgeId].line,'mouseover',function(){
                    this.setStrokeWeight(10);
                });
                _bind(ALL_LINE[item.edgeId].line,'mouseout',function(){
                    this.setStrokeWeight(3);
                })
                _bind(ALL_LINE[item.edgeId].line,'click',() => {
                    const linePoints = ALL_LINE[item.edgeId].line.getPath();
                    this.bmap.setViewport(linePoints);
                    router.push(`editLine?track=${item.edgeId}`);
                })
            })
        },
        // 拖拽轨道显示虚线
        drawDash(e,self){
            const thisPt = ALL_PT[self.UDF.vertexId];
            const neighbor = thisPt.neighbor;
            for(var i=0;i<neighbor.length;i++){
                var edgeId = neighbor[i].edgeId; 
                var beLine = ALL_LINE[edgeId].line;
                var dashTrack = []; // 新虚线
                var nextPtId = neighbor[i].vertexId;
                var nextPt = new BMap.Point(ALL_PT[nextPtId].lon,ALL_PT[nextPtId].lat);
                dashTrack.push(e.point,nextPt);
                
                if(beLine.dashLine instanceof BMap.Polyline){
                    beLine.dashLine.setPath(dashTrack);
                }else{
                    beLine.dashLine = new BMap.Polyline(dashTrack,dashOptions);
                    this.bmap.addOverlay(beLine.dashLine); 
                }
                // 如果此点上有站台
                if(thisPt.isStation){
                    const stationId = thisPt.stationId;
                    ALL_STATION[stationId].setPosition(e.point);
                    if(thisPt.storageId){
                        const storagePs = ALL_STORAGE[thisPt.storageId].marker.getPosition();
                        const dashPath = [e.point,storagePs];
                        ALL_STORAGE[thisPt.storageId].dashLine.setPath(dashPath)
                    }
                }
            }
        },
        /**@augments
         *  拖拽轨道完成
         */
        async dragDashEnd(e,self){
            const thisPt = ALL_PT[self.UDF.vertexId];
            const neighbor = thisPt.neighbor;
             // todo 拖动轨道改变了之后把数据传过去，返回更新点的值
            for(var i=0;i<neighbor.length;i++){
                var edgeId = neighbor[i].edgeId; 
                const {
                    line:beLine,
                    label
                } = ALL_LINE[edgeId];
                var nextPtId = neighbor[i].vertexId;
                var nextPt = new BMap.Point(ALL_PT[nextPtId].lon,ALL_PT[nextPtId].lat);
                label.setPosition(new BMap.Point(
                    (ALL_PT[nextPtId].lon+e.point.lng)/2,
                    (ALL_PT[nextPtId].lat+e.point.lat)/2, 
                ))
                var newPath = []; // 新实线
                newPath.push(e.point,nextPt);
                
                beLine.setPath(newPath); 
                // 将变化的线传过去
                this.bmap.removeOverlay(beLine.dashLine); 
                beLine.dashLine = null;
                // 如果此点上有站台
                if(thisPt.isStation){
                    const stationId = thisPt.stationId;
                    ALL_STATION[stationId].setPosition(e.point);
                }
            } 
            const vertexList = [
                {
                    "vertexId":thisPt.vertexId,
                    "lat":e.point.lat,
                    "lon":e.point.lng,
                    "inGraph":"1" //是否被添加到图中 1是 0否（新建的点为0 修改是应为1）
                }
            ]
            const params = {
                eventId:this.$route.params.id,
                vertexList
            }
            this.isHttp = true;
            const trackData = await addTrack(params);
            if(trackData.result != 0){
                this.$message({
                    message: trackData,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            // 更新点的信息
            const newVInfo = trackData.detail.vertexList[0];
            Object.assign(thisPt,newVInfo);
            this.isHttp = false;
        },
        /**@augments
         *  删除轨道
         *  轨道id和孤立的点
         */
        deleteEdge({edgeId,vertexIds}){
            this.bmap.removeOverlay(ALL_LINE[edgeId].line);
            this.bmap.removeOverlay(ALL_LINE[edgeId].label);
            delete ALL_LINE[edgeId];
            vertexIds.map(item => {
                this.bmap.removeOverlay(ALL_MARKER[item]);
                delete ALL_MARKER[item];
                if(ALL_PT[item].isStation){
                    const stationId = ALL_PT[item].stationId;
                    this.bmap.removeOverlay(stationId); 
                    delete ALL_STATION[stationId];
                }
                delete ALL_PT[item]; 
            })
        },
        /**@augments
         *  删除站台
         *  站台id和依附的点id
         */
        deleteStation({stationId,vertexId}){
            this.bmap.removeOverlay(ALL_STATION[stationId]);
            delete ALL_STATION[stationId];
            ALL_PT[vertexId].isStation = false;
            ALL_PT[vertexId].stationId = "";
        },
        clcikPoint(e,self){
            const {vertexId} = self.UDF;
            if(!this.allowPoint){
                return false;
            }
            this.allowPoint = false;
            this.$root.eventHub.$emit('givePoint',ALL_PT[vertexId]);
        },
        mapChoosePt(e){
            if(!this.allowPoint){
                return false;
            }
            this.allowPoint = false;
            const point = e.point;

            const pointMsg = {
                result:0,
                msg:''
            }
            this.bmap.removeOverlay(this.mPoint);
            this.mPoint = new BMap.Marker(new BMap.Point(
                point.lng,point.lat
            ), {
                icon: new BMap.Icon('http://api.map.baidu.com/library/CurveLine/1.5/src/circle.png', new BMap.Size(16,16))
            });
            this.bmap.addOverlay(this.mPoint);
            this.$root.eventHub.$emit('getMapPoint',point);
        },
        /**@argument
         * 根据参数在地图上生成轨道轨迹点
         * @return points
         */
        outTrack(opts){
            // const pB = getPoint(opts.startPoint,this.bmap,opts.dirAngle,opts.len);
            
            const pointA = new BMap.Point(
                opts.startPoint.lng,
                opts.startPoint.lat
            )
            const pointB = new BMap.Point(
                    opts.endLongitude,
                    opts.endLatitude
                )
            let points = [pointA,pointB];
            if(opts.lineFlag == 1 || opts.lineFlag == 3){
                points = [pointA,pointB];
            }else{
                const cureOpts1 = [{
                    angle1:opts.dirAngle,
                    angle2:opts.centralAngle,
                    len:opts.len,
                    direction:opts.dir
                }];
                points = curline(points,cureOpts1);
            }
            return points;
        },
        outLine(opts){
            this.bmap.removeOverlay(this.mPoint);
            const color = opts.isBroken?'red':'blue';
            const trackPoints = this.outTrack(opts);
            const trackLine = new BMap.Polyline(trackPoints,{strokeColor:color, strokeWeight:opts.wid, strokeOpacity:0.5});

            trackLine.del = false;
            trackLine.type = 'line'; // 素材标志]
            trackLine.startPoint = opts.startPoint;
            trackLine.flag = opts.lineFlag;  // 轨道类型
            trackLine.dragFlag = false; // 拖拽默认关闭
            trackLine.speed = opts.speed;
            trackLine.addEventListener('click',function(){
                // console.log('hahah')
            })
            if(opts.id){
                this.bmap.removeOverlay(this.lineData.mapList[opts.id])
                const bindOpts = Object.assign({},opts,{mapOverlay:trackLine});
                this.bindMapObj(bindOpts);
            }else{
                this.bmap.removeOverlay(this.lineData.edit.overlay);
                setTimeout(() => {
                    this.SETEDITLINE(trackLine);
                },0)  
            }
            this.bmap.addOverlay(trackLine)
            if(!arguments[1])
                this.bmap.setViewport(trackPoints);
        },
        importLine(opts){
            const importOpts = {
                id:opts.id,
                type:'line',
                name:opts.name,
                lineFlag:opts.type,  // 1 直线，2 曲线 3.坡线
                startPoint:{
                    lng:opts.startLongitude,
                    lat:opts.startLatitude
                },    // 起始点坐标 lng lat
                len:opts.length,  // 两点之间绝对距离
                wid:opts.width,  // 轨道宽度
                dirAngle:opts.arcAngle,  // AB点与x轴夹角 xy坐标
                centralAngle:opts.radius,  // 圆心角
                dir:opts.arcDirection == 1?true:false,  // 弧度方向
                slope:opts.slope,   // 斜率
                speed:opts.limitSpeed,   // 速度
                isBroken:opts.isBroken, // 是否损坏
                endLongitude:opts.endLongitude,
                endLatitude:opts.endLatitude
            }
            this.outLine(importOpts,arguments[1])
        },
        outputStation(id,vertexId,name){
            const vPoint = ALL_PT[vertexId];
            const point = new BMap.Point(vPoint.lon,vPoint.lat);
            const marker = new BMap.Marker(point);  // 创建标注
            marker.del = false;
            marker.type = 'station';
            marker.setLabel(new BMap.Label(name,{
                offset:new BMap.Size(20,0)
            }))
            marker.name = name;
            ALL_STATION[id] = marker;
            // 更新点的数据
            ALL_PT[vertexId].isStation = true;
            ALL_PT[vertexId].stationId = id;
            this.bmap.addOverlay(marker);
            _bind(marker,'click',() => {
                const nowStaPt = ALL_STATION[id].getPosition();
                this.bmap.centerAndZoom(nowStaPt,23);
                router.push(`editStation?stop=${id}`);
            })
        },
        /**@augments
         * id  站台id
         * vertexId  对应的点 id
         */
        importStation({id,vertexId,name}){
            console.log(!ALL_STATION[id])
            if(!ALL_STATION[id]){
                this.outputStation(id,vertexId,name);
            }
            // if(opts.eventTrackId){
            //     this.fetchAllData();
            //     return false;
            // }

            // opts.name = opts.name?opts.name:opts.NAME;
            // const importOpts = {
            //     id:opts.id,
            //     type:'station',
            //     name:opts.name,
            //     startPoint:{
            //         lng:opts.longitude,
            //         lat:opts.latitude
            //     },
            //     eventTrackId:opts.eventTrackId,
            //     isBroken:opts.isBroken // 是否损坏
            // }
            // this.outputStation(importOpts,arguments[1])
        },
        getPoints(opts){
            const staInfo = opts.stationInfo;
            const lineInfo = this.lineData.dataList[staInfo.lineId];
            const angle = parseInt(lineInfo.data.dirAngle.val);
            const saveAngle =opts.anthorSide?angle+90:angle-90;
            const dis = opts.minDis;
            const pointB = getPoint(staInfo.startPoint,this.bmap,saveAngle,dis);
            return new BMap.Point(
                pointB.lng,
                pointB.lat    
            )
        },
        outputStorage(id,vertexId,name,position){
            this.bmap.removeOverlay(this.mPoint);
            const point = new BMap.Point(
                position.lon,
                position.lat    
            )
            const basePoint = new BMap.Point(
                ALL_PT[vertexId].lon,
                ALL_PT[vertexId].lat
            )
            const icon = new BMap.Icon(savepng, new BMap.Size(70,44));  // 创建标注
            const marker = new BMap.Marker(point,{
                icon
            });  // 创建标注
            marker.del = false;
            marker.type = 'save';
            const dashLine = new BMap.Polyline([point,basePoint],storageOptions);
            ALL_STORAGE[id] = {marker,dashLine,vertexId};
            ALL_PT[vertexId].storageId = id;
            marker.UDFId = id;
            // 更新点的数据
            this.bmap.addOverlay(marker);
            marker.enableDragging(); 
            this.bmap.addOverlay(dashLine);
            marker.setLabel(new BMap.Label(name,{
                offset:new BMap.Size(30,0)
            }))
            const _self = this;
            setTimeout(() => {
                _bind(marker,'click',() => {
                    const nowStaPt = marker.getPosition();
                    this.bmap.centerAndZoom(nowStaPt,23);
                    router.push(`editSave?save=${id}`) 
                })
                // 拖拽
                _bind(marker,'dragging',function(e){
                    const that = this;
                    const storageId = this.UDFId;
                    const {dashLine,vertexId} = ALL_STORAGE[storageId];
                    const stoPath = [e.point,ALL_MARKER[vertexId].getPosition()];
                    dashLine.setPath(stoPath);
                });
                _bind(marker,'dragend',function(e){
                    const that = this;
                    _self.sto_dragDashEnd(e,that);
                });
            },1000)
            
        },
        importStorage({id,vertexId,name,position}){
             if(!ALL_STORAGE[id]){
                this.outputStorage(id,vertexId,name,position);
            }
        },
        /**@augments
         *  拖拽轨道完成
         */
        async sto_dragDashEnd(e,self){
            const storageId = self.UDFId;
            console.log(storageId)
            const params = {
                eventId:this.$route.params.id,
                id: storageId, //事件存储设施id
                longitude: e.point.lng,//经度
                latitude: e.point.lat,//纬度
            }
            this.isHttp = true;
            const editData = await editStorage(params);
            if(editData.result != 0){
                this.$message({
                    message: trackData,
                    type: 'warning',
                    duration: 2000
                })
                return false;
            }
            // 更新点的信息
            // const newVInfo = trackData.detail.vertexList[0];
            // Object.assign(thisPt,newVInfo);
            this.isHttp = false;
        },
        /**@argument
         * type: line 类型
         * key: 索引
         * mapOverlay: 绑定的map对象
         * 新建的时候 手动添加 导入的时候 自动添加
         */
        bindMapObj(opts){
            const type = opts.type;
            const id = opts.id;
            let mapOverlay;
            switch(type){
                case 'line':
                    mapOverlay = opts.mapOverlay;
                    mapOverlay.id = id;
                    mapOverlay.name = opts.name;
                    this.INSERTMAPLINE({id,mapOverlay});
                    break;
                case 'station':
                    mapOverlay = opts.mapOverlay;
                    mapOverlay.id = id;
                    mapOverlay.name = opts.name;
                    this.INSERTMAPSTATION({id,mapOverlay});  // 插入map数据
                    break;
                case 'save':
                    mapOverlay = opts.mapOverlay;
                    mapOverlay.id = id;
                    mapOverlay.name = opts.name;
                    this.INSERTMAPSAVE({id,mapOverlay});  // 插入map数据
                    break;
            }
        },
        /**@argument
         * 开启拖拽
         */
        bindDrag(mType,boo){
            switch(mType){
                case 'line':
                    const _self = this.lineData.edit.overlay;
                    const polyLinePoints = _self.getPath();
                    boo == true?_self.dragFlag = false:_self.dragFlag = !_self.dragFlag;  
                    pointDrag(polyLinePoints,_self,this.bmap);  
                    break;
                default:
                    break;
            }
        },
        /**@argument
         * 系统生成乘客
         */
        createCarList(list){
            carMarkers = [];
            list instanceof Array && list.map(item => {
                const { 
                    eventVehicleId:vId,
                    startStationId:startStaId ,
                    endStationId:endStaId,
                    path:pathInfo 
                } = item;
                let stPosition = ALL_STATION[startStaId].getPosition();
                const startName = ALL_STATION[startStaId].name; 
                const endName = ALL_STATION[endStaId].name;
                let marker = new BMap.Marker(stPosition,{
                    icon: new BMap.Icon(carIcon, new BMap.Size(52,26), {anchor: new BMap.Size(27, 13)})
                });
                this.carNum++;
                this.bmap.addOverlay(marker);
                carMarkers.push(marker);
                if(this.mapFlag == 1){
                    console.log('创建个小车');
                    const opts = [];
                    for(let i=0;i<pathInfo.length-1;i++){
                        const { vertexId:stId } = pathInfo[i];
                        const { vertexId:edId } = pathInfo[`${i+1}`];
                        const stPt = new BMap.Point(ALL_PT[stId].lon,ALL_PT[stId].lat);
                        const edPt = new BMap.Point(ALL_PT[edId].lon,ALL_PT[edId].lat);
                        const path = [stPt,edPt];
                        const {
                            limitSpeed
                        } = pathInfo[i];
                        const speed = (limitSpeed/3.6).toFixed(2);
                        opts.push({path,speed})
                    }
                    const car = this.createCar({startName,endName,path:opts});
                    car.id = vId;
                    carList[vId] = car;
                }
            })
            if(list.length > 0){
                this.$message({
                    message:`模拟已生成小车`,
                    type: 'success',
                    duration: 2000
                })
            }
        },
        /**@argument
         * 生成路书
         * [{
         *   path:path,
         *   speed:speed
         * }]
         */
        createCar(opts){
            console.log('opts',opts)
            const lushu = new BMapLib.LuShu(this.bmap, opts.path, {
                landmarkPois:[],
                defaultContent: `起始站${opts.startName} 到 终点站${opts.endName}`,//覆盖物内容，这个填上面的特殊点文字才会显示
                // speed: 600,//路书速度
                icon: new BMap.Icon(carIcon, new BMap.Size(52,26), {anchor: new BMap.Size(27, 13)}),//覆盖物图标，默认是百度的红色地点标注
                autoView: false,//自动调整路线视野
                enableRotation: true,//覆盖物随路线走向
                callback:() => {
                   this.arriveNum ++;
                   if(this.arriveNum == this.carNum){
                       this.CHANGERUNSTATUS(0);
                       this.SETHASCAR(false); 
                       this.arriveNum = 0;
                       this.carNum = 0;
                    //    this.$message({
                    //         message:`模拟已结束`,
                    //         type: 'success',
                    //         duration: 2000 
                    //    })
                   } 
                }
            });
            return lushu;
        },
        /**@argument
         * 
         */
        orderCar(order){
            console.log('order',order)
            switch(order){
                case 0:
                    carMarkers.map(item => {
                        this.bmap.removeOverlay(item)
                    })
                    carMarkers = [];
                    Object.values(carList).map(car => {
                        car.start();
                    })
                    break;
                case 1:
                    Object.values(carList).map(car => {
                        car.pause();
                    })
                    break;
                case 2:
                    Object.values(carList).map(car => {
                        car._againMove();
                    })
                    break;
                case 3:
                    Object.values(carList).map(car => {
                        car.stop();
                    })
                    this.CHANGERUNSTATUS(0);
                    this.SETHASCAR(false);
                    this.arriveNum = 0;
                    this.carNum = 0;
                    break;
                default:
                    break;
            }
        }
    }
}
</script>

<style lang="less" scoped>
.map-box{
    position: relative;
    float: left;
}
#map{
    /* width: 770px; */
    /* height: 600px; */
    width: 100%;
    height: 100%;
}
.shade{
    position: absolute;
    left: 0;top:0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    p{
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 40%;
        font-size: 26px;
        line-height: 30px;
        text-align: center;
    }
    /* background:url('./img/loading.png') rgba(255, 255, 255, .3); */
}
</style>


