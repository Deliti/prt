// 对每个点进行绑定拖拽
export const pointDrag = (points,obj,map) => {
    if(obj.dragFlag){
        obj.dragMarkers = [];
        points = points || obj.getPath();
        console.log('points里面的',points)
        for(var i = 0 ; i < points.length ; i++ ){
            var marker = new BMap.Marker(points[i], {
                icon: new BMap.Icon('http://api.map.baidu.com/library/CurveLine/1.5/src/circle.png', new BMap.Size(16,16)),
                enableDragging: true,
                raiseOnDrag: true
            });
            marker.addEventListener('dragstart', function(e){
                this.startPoint = this.getPosition();
            })
            marker.addEventListener('dragend', function(e){
                var nowPoint = e.point;
                var addLng = nowPoint.lng - this.startPoint.lng;
                var addLat = nowPoint.lat - this.startPoint.lat;
                for (var i = 0; i < points.length; i++) {
                    points[i].lng += addLng;
                    points[i].lat += addLat;
                    // 消除之前的
                    map.removeOverlay(obj.dragMarkers[i]);
                }
                obj.setPath(points);
                // 重新绑定
                pointDrag(points,obj,map);
            });
            marker.index = i;
            obj.dragMarkers.push(marker);
            map.addOverlay(marker)
        }
    }else{
        if(obj.dragMarkers){
            for(var i = 0 ; i < points.length ; i++){
                map.removeOverlay(obj.dragMarkers[i]);
            }
            obj.dragMarkers = null;
        }
        
    }
}


// 返回曲线的path
export const curline = (points,circleArr) => {
    let curveCoordinates = [];
    function getCirclePoints(points,circleArr){
        for (var i = 0; i < points.length - 1; i++) {
            var p = getCircleByTwoPoints(points[i], points[i + 1],circleArr[i]);
            if (p && p.length > 0) {
                curvePoints = curvePoints.concat(p);
            }
        }
        return curvePoints;
    }
    /**
   * 根据两点获取曲线坐标点数组
   * @param Point 起点
   * @param Point 终点
   * @param angle1 两点与x轴夹角
   * @param len 两点距离
   * @param angle2 圆心弧度
   */
  function getCircleByTwoPoints(obj1, obj2 ,opts) {
    if (!obj1 || !obj2 || !(obj1 instanceof BMap.Point) || !(obj2 instanceof BMap.Point)) {
      return null;
    }

    var trunToPi = function(angle){
      return angle*Math.PI/180;
    }

    var getB = function(x,y,len,agl){
      var xy = {};
      xy.x = x+len*Math.cos(agl);
      xy.y = y+len*Math.sin(agl);
      return xy;
    }

    var getO = function(x,y,r,agl,dir){
      var xy = {};
      if(dir){
        xy.x = x+r*Math.cos(agl);
        xy.y = y-r*Math.sin(agl);
      }else{
        xy.x = x-r*Math.cos(agl);
        xy.y = y+r*Math.sin(agl);
      }
      
      return xy;
    }

    curveCoordinates = [];

    var count=30; // 曲线是由一些小的线段组成的，这个表示这个曲线所有到的折线的个数
    var isFuture=false;
    var t, h, h2, lat3, lng3, j, t2;
    var LnArray = [];
    var i = 0;
    var inc = 0;

    if (typeof(obj2) == "undefined") {
      if (typeof(curveCoordinates) != "undefined") {
        curveCoordinates = [];
      }
      return;
    }

    var lat1 = parseFloat(obj1.lat);
    var lat2 = parseFloat(obj2.lat);
    var lng1 = parseFloat(obj1.lng);
    var lng2 = parseFloat(obj2.lng);


//     // 转换地图类型   
    self._projection = window.map.getMapType().getProjection();
    var PtA = new BMap.Point(lng1,lat1)
    var PsA = self._projection.lngLatToPoint(PtA);
    console.log(PsA)
    var PtB = new BMap.Point(lng2,lat2)
    var PsB = self._projection.lngLatToPoint(PtB);
    console.log(PsB)
    console.log(opts)
    var r =  (opts.len/2)/Math.sin(trunToPi(opts.angle2/2)); 
    console.log(r)
    var angle3 = trunToPi(90-opts.angle1-opts.angle2/2);

    if(opts.direction){
      var pixelO = getO(PsA.x,PsA.y,r,angle3,opts.direction);
    }else{
      var pixelO = getO(PsB.x,PsB.y,r,angle3,opts.direction);
    }
    

    var oc = self._projection.pointToLngLat(new BMap.Pixel(pixelO.x, pixelO.y))
        
    // 实验结束
    for (i = 0; i <= count; i++) {
        inc = i*parseFloat(opts.angle2/count);
        if(opts.direction){
          var cx = pixelO.x - r*Math.cos(trunToPi(inc+90-opts.angle1-opts.angle2/2));
          var cy = pixelO.y + r*Math.sin(trunToPi(inc+90-opts.angle1-opts.angle2/2));
        }else{
          var cx = pixelO.x + r*Math.cos(trunToPi(-inc+90-opts.angle1+opts.angle2/2));
          var cy = pixelO.y - r*Math.sin(trunToPi(-inc+90-opts.angle1+opts.angle2/2));
        }
        
        var pc = self._projection.pointToLngLat(new BMap.Pixel(cx, cy))
        curveCoordinates.push(new BMap.Point(
            pc.lng,
            pc.lat
        ));
        
    }
    return curveCoordinates;
  }
    var curvePoints = [];
    curvePoints = getCirclePoints(points,circleArr);
    return curveCoordinates;
}


// 判断点是否在线上
export const isPointOnPolyline = (point, polyline) => {
    //检查类型
    if(!(point instanceof BMap.Point) ||
        !(polyline instanceof BMap.Polyline)){
        return false;
    }
  
    //首先判断点是否在线的外包矩形内，如果在，则进一步判断，否则返回false
    var lineBounds = polyline.getBounds();
    console.log('在不在外包里面',lineBounds.containsPoint(point))
    if(!isPointInRect(point, lineBounds)){
        return false;
    }
    //判断点是否在线段上，设点为Q，线段为P1P2 ，
    //判断点Q在该线段上的依据是：( Q - P1 ) × ( P2 - P1 ) = 0，且 Q 在以 P1，P2为对角顶点的矩形内
    var pts = polyline.getPath();
    var msg = false;
    for(var i = 0; i < pts.length - 1; i++){
        var curPt = pts[i];
        var nextPt = pts[i + 1];
        //首先判断point是否在curPt和nextPt之间，即：此判断该点是否在该线段的外包矩形内
        if (point.lng >= Math.min(curPt.lng, nextPt.lng) && point.lng <= Math.max(curPt.lng, nextPt.lng) &&
            point.lat >= Math.min(curPt.lat, nextPt.lat) && point.lat <= Math.max(curPt.lat, nextPt.lat)){
            //判断点是否在直线上公式
            var precision = (curPt.lng - point.lng) * (nextPt.lat - point.lat) - 
                (nextPt.lng - point.lng) * (curPt.lat - point.lat);                
            if(precision < 2e-7 && precision > -2e-7){//实质判断是否接近0
                msg = true;
            }                
        }
            // if (point.lng >= Math.min(curPt.lng, nextPt.lng) && point.lng <= Math.max(curPt.lng, nextPt.lng) &&
            //     point.lat >= Math.min(curPt.lat, nextPt.lat) && point.lat <= Math.max(curPt.lat, nextPt.lat)){
            //     //判断点是否在直线上公式
                               
            // }
        // var precision = (curPt.lng - point.lng) * (nextPt.lat - point.lat) - 
        //     (nextPt.lng - point.lng) * (curPt.lat - point.lat);                
        // if(precision < 2e-4 && precision > -2e-4){//实质判断是否接近0
        //     msg = true;
        // } 
    }
    
    return msg;
}

const isPointInRect = (point, bounds) => {
    //检查类型是否正确
    if (!(point instanceof BMap.Point) || 
        !(bounds instanceof BMap.Bounds)) {
        return false;
    }
    var sw = bounds.getSouthWest(); //西南脚点
    var ne = bounds.getNorthEast(); //东北脚点
    return (point.lng >= sw.lng && point.lng <= ne.lng && point.lat >= sw.lat && point.lat <= ne.lat);
}


// 根据一个点和角度 返回另一个点的坐标
export const getPoint = (point,map,angle,len) => {
    const mapProjection = map.getMapType().getProjection();
    const PsA = mapProjection.lngLatToPoint(point);
    const dirAngle = angle*Math.PI/180;
    const addLng = len*Math.sin(dirAngle)
    const addLat = len*Math.cos(dirAngle);
    const psbx = PsA.x+addLat;
    const psby = PsA.y+addLng;
    const pb = mapProjection.pointToLngLat(new BMap.Pixel(psbx, psby))
    return pb;
}