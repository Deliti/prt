var T, baidu = T = baidu || {version: '1.5.0'};
baidu.guid = '$BAIDU$';

window[baidu.guid] = window[baidu.guid] || {};
baidu.dom = baidu.dom || {};
baidu.dom.g = function(id) {
    if ('string' == typeof id || id instanceof String) {
        return document.getElementById(id);
    } else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
        return id;
    }
    return null;
};
baidu.g = baidu.G = baidu.dom.g;
baidu.lang = baidu.lang || {};
baidu.lang.isString = function(source) {
    return '[object String]' == Object.prototype.toString.call(source);
};
baidu.isString = baidu.lang.isString;
baidu.dom._g = function(id) {
    if (baidu.lang.isString(id)) {
        return document.getElementById(id);
    }
    return id;
};
baidu._g = baidu.dom._g;
baidu.dom.getDocument = function(element) {
    element = baidu.dom.g(element);
    return element.nodeType == 9 ? element : element.ownerDocument || element.document;
};
baidu.browser = baidu.browser || {};
baidu.browser.ie = baidu.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;
baidu.dom.getComputedStyle = function(element, key) {
    element = baidu.dom._g(element);
    var doc = baidu.dom.getDocument(element),
        styles;
    if (doc.defaultView && doc.defaultView.getComputedStyle) {
        styles = doc.defaultView.getComputedStyle(element, null);
        if (styles) {
            return styles[key] || styles.getPropertyValue(key);
        }
    }
    return '';
};
baidu.dom._styleFixer = baidu.dom._styleFixer || {};
baidu.dom._styleFilter = baidu.dom._styleFilter || [];
baidu.dom._styleFilter.filter = function(key, value, method) {
    for (var i = 0, filters = baidu.dom._styleFilter, filter; filter = filters[i]; i++) {
        if (filter = filter[method]) {
            value = filter(key, value);
        }
    }
    return value;
};
baidu.string = baidu.string || {};


baidu.string.toCamelCase = function(source) {

    if (source.indexOf('-') < 0 && source.indexOf('_') < 0) {
        return source;
    }
    return source.replace(/[-_][^-_]/g, function(match) {
        return match.charAt(1).toUpperCase();
    });
};
baidu.dom.getStyle = function(element, key) {
    var dom = baidu.dom;
    element = dom.g(element);
    key = baidu.string.toCamelCase(key);

    var value = element.style[key] ||
                (element.currentStyle ? element.currentStyle[key] : '') ||
                dom.getComputedStyle(element, key);

    if (!value) {
        var fixer = dom._styleFixer[key];
        if (fixer) {
            value = fixer.get ? fixer.get(element) : baidu.dom.getStyle(element, fixer);
        }
    }

    if (fixer = dom._styleFilter) {
        value = fixer.filter(key, value, 'get');
    }
    return value;
};
baidu.getStyle = baidu.dom.getStyle;
baidu.dom._NAME_ATTRS = (function() {
    var result = {
        'cellpadding': 'cellPadding',
        'cellspacing': 'cellSpacing',
        'colspan': 'colSpan',
        'rowspan': 'rowSpan',
        'valign': 'vAlign',
        'usemap': 'useMap',
        'frameborder': 'frameBorder'
    };

    if (baidu.browser.ie < 8) {
        result['for'] = 'htmlFor';
        result['class'] = 'className';
    } else {
        result['htmlFor'] = 'for';
        result['className'] = 'class';
    }

    return result;
})();
baidu.dom.setAttr = function(element, key, value) {
    element = baidu.dom.g(element);
    if ('style' == key) {
        element.style.cssText = value;
    } else {
        key = baidu.dom._NAME_ATTRS[key] || key;
        element.setAttribute(key, value);
    }
    return element;
};
baidu.setAttr = baidu.dom.setAttr;
baidu.dom.setAttrs = function(element, attributes) {
    element = baidu.dom.g(element);
    for (var key in attributes) {
        baidu.dom.setAttr(element, key, attributes[key]);
    }
    return element;
};
baidu.setAttrs = baidu.dom.setAttrs;
baidu.dom.create = function(tagName, opt_attributes) {
    var el = document.createElement(tagName),
        attributes = opt_attributes || {};
    return baidu.dom.setAttrs(el, attributes);
};
baidu.object = baidu.object || {};
baidu.extend =
baidu.object.extend = function(target, source) {
    for (var p in source) {
        if (source.hasOwnProperty(p)) {
            target[p] = source[p];
        }
    }
    return target;
};
/**
 * 自定义的overlay，显示在小车的上方
 * @param {Point} Point 要定位的点.
 * @param {String} html overlay中要显示的东西.
 * @return 无返回值.
 */
function CustomOverlay(point,html) {
    this._point = point;
    this._html = html;
}
CustomOverlay.prototype = new BMap.Overlay();
CustomOverlay.prototype.initialize = function(map) {
    var div = this._div = baidu.dom.create('div', {style: 'border:solid 1px #ccc;width:auto;min-width:50px;text-align:center;position:absolute;background:#fff;color:#000;font-size:12px;border-radius: 10px;padding:5px;white-space: nowrap;'});
    div.innerHTML = this._html;
    map.getPanes().floatPane.appendChild(div);
    this._map = map;
    return div;
}
CustomOverlay.prototype.draw = function() {
    this.setPosition(this.lushuMain._marker.getPosition(), this.lushuMain._marker.getIcon().size);
}
baidu.object.extend(CustomOverlay.prototype, {
    //设置overlay的position
    setPosition: function(poi,markerSize) {
        // 此处的bug已修复，感谢 苗冬(diligentcat@gmail.com) 的细心查看和认真指出
        var px = this._map.pointToOverlayPixel(poi),
            styleW = baidu.dom.getStyle(this._div, 'width'),
            styleH = baidu.dom.getStyle(this._div, 'height'),
            overlayW = parseInt(this._div.clientWidth || styleW, 10),
            overlayH = parseInt(this._div.clientHeight || styleH, 10);
        this._div.style.left = px.x - overlayW / 2 + 'px';
        this._div.style.bottom = -(px.y - markerSize.height) + 'px';
    },
    //设置overlay的内容
    setHtml: function(html) {
        this._div.innerHTML = html;
    },
    //跟customoverlay相关的实例的引用
    setRelatedClass: function(lushuMain) {
        this.lushuMain = lushuMain;
    }
});
export default class Prt {
    constructor(map,pathList,opts){
        this._map = map;
        this.pathList = pathList;
        //存储一条路线
        this._pathIndex = 0;
        this.i = 0;
        this._path = pathList[0].path;
        this.speed = this.pathList[0].speed;
        this.coe = 1; // 速度系数

        this.nowPt = this._path[0];
         //进行坐标转换的类
        this._projection = this._map.getMapType().getProjection();
        // 暂停标志
        this._fromPause = false; 
        // 结束标志
        this._fromStop = false;
        this._opts = {
            icon: null,
            //默认速度 米/秒
            speed: 4000,
            defaultContent: '',
            callback:null
        }
        this._setOptions(opts);
        this.init();
    }

    init(){
        this._addMarker();
        this.setRotation(this.nowPt,this._path[1]);
    }

    _addMarker(){
        if (this._marker) {
            this._map.removeOverlay(this._marker);
        }
        //移除之前的overlay
        this._overlay && this._map.removeOverlay(this._overlay);
        var marker = new BMap.Marker(this._path[0]);
        this._opts.icon && marker.setIcon(this._opts.icon);
        this._map.addOverlay(marker);
        // marker.setAnimation(BMAP_ANIMATION_DROP);
        this._marker = marker;
        this._addInfoWin();
    }

    /**
     * 添加上方overlay
     * @return 无返回值.
     */
    _addInfoWin() {
        const me = this;
        const overlay = new CustomOverlay(me._marker.getPosition(), me._opts.defaultContent);

        //将当前类的引用传给overlay。
        overlay.setRelatedClass(this);
        this._overlay = overlay;
        this._map.addOverlay(overlay);
    }

     /**
     * 设置小车上方infowindow的内容，位置等
     * @param {Point} pos 经纬度坐标点.
     * @return 无返回值.
     */
    _setInfoWin(pos){
        //设置上方overlay的position
        const me = this;
        me._overlay.setPosition(pos, me._marker.getIcon().size);
        // var index = me._troughPointIndex(pos);
        // if (index != -1) {
        //     clearInterval(me._intervalFlag);
        //     me._overlay.setHtml(me._opts.landmarkPois[index].html);
        //     me._overlay.setPosition(pos, me._marker.getIcon().size);
        //     me._pauseForView(index);
        // }else {
        //     me._overlay.setHtml(me._opts.defaultContent);
        // }
    }

    /**
     * 根据用户输入的opts，修改默认参数_opts
     * @param {Json Object} opts 用户输入的修改参数.
     * @return 无返回值.
     */
    _setOptions(opts){
        if (!opts) {
            return;
        }
        for (const p in opts) {
            if (opts.hasOwnProperty(p)) {
                this._opts[p] = opts[p];
            }
        }
    }
    
    move(){
        // 运行结束
        console.log('notRun',this._fromPause || this._fromStop)
        if(this._fromPause || this._fromStop){
            return false;
        }
        if(this._pathIndex >= this.pathList.length){
            this._fromStop = true;
        }
        // this.setRotation(this.nowPt,this._path[1]);
        const nextPoint = this._getNextPt();
        if(nextPoint){
            this._marker.setPosition(nextPoint);
            this._setInfoWin(nextPoint);
            this.nowPt = nextPoint;
        }
    }
    

    /**
     * 计算两点间的距离
     * @param {Point} poi 经纬度坐标A点.
     * @param {Point} poi 经纬度坐标B点.
     * @return 无返回值.
     */
    _getDistance(pxA, pxB){
        return Math.sqrt(Math.pow(pxA.x - pxB.x, 2) + Math.pow(pxA.y - pxB.y, 2));
    }

    // 获取下一个点的坐标
    _getNextPt(){
        const me = this;
        if(me.nowPt.lng == me._path[1].lng && me.nowPt.lat == me._path[1].lat){
            me._pathIndex ++;
            if(me._pathIndex == me.pathList.length){
                me.stop();
                return false;
            }else{
                // 重新规划路线后重新获取下一个点
                me._resetPath();
                return me._getNextPt();
            }
        }else{
             //当前坐标
            const initPos = me._projection.lngLatToPoint(me.nowPt),
                targetPos = me._projection.lngLatToPoint(me._path[1]),
             //获取结束点的(x,y)坐标
                posXY = me._effect(initPos,targetPos);
                // y = me._effect(initPos.y, 'y');

            const pos = me._projection.pointToLngLat(new BMap.Pixel(posXY.x,posXY.y));
            const oldDis = me._getDistance(initPos,targetPos);
            const newDis = me._getDistance(initPos,posXY);
            return newDis>=oldDis?me._path[1]:pos;
        }
    }

    /**
     * 
     * @param {*} x x|y轴坐标
     * @param {*} flag 'x' | 'y'
     */
    _effect(initPos,target){
        const timer = 50;
        const s = this.speed*this.coe / (1000 / timer);
        const count = Math.round(this._getDistance(initPos, target) / s);
        // const a = Math.PI/10*this._angle;
        return {
            x:(target.x - initPos.x) / count + initPos.x,
            y:(target.y - initPos.y) / count + initPos.y
        }
    }

    // 获取当前轨道与x的夹角
    setRotation(f, m){
        var j = this;
        var e = 0;
        f = j._map.pointToPixel(f);
        m = j._map.pointToPixel(m);
        let angle = 0;
        // console.log('initPos', f)
        // console.log('rotation', m)
        if (m.x != f.x) {
            var k = (m.y - f.y) / (m.x - f.x),
            g = Math.atan(k);
            e = g * 360 / (2 * Math.PI);
            if (m.x < f.x) {
                e = -e + 90 + 90
            } else {
                e = -e
            }
            angle = -e;
            // console.log('rotation', - e)
            // j._marker.setRotation( - e)
        } else {
            var h = m.y - f.y;
            var i = 0;
            if (h > 0) {
                i = -1
            } else {
                i = 1
            }
            angle = -i*90;
        }
        this._angle = angle;
        j._marker.setRotation(angle)
        return angle;
    }

    // 重新规划路线
    _resetPath(){
        this._path = this.pathList[this._pathIndex].path;
        this.speed = this.pathList[0].speed; 
        this.setRotation(this._path[0],this._path[1]);
    }

    pause(){
        this._fromPause = true; 
    }

    // 手动停止
    stop(){
        // this.speed = 0;
        this._fromStop = true;
        this._map.removeOverlay(this._marker);
        this._map.removeOverlay(this._overlay);
    }

    again(){
        this._fromPause = false; 
    }

    setCoe(n){
        console.log('ls n',n)
        this.coe = n;
    }

}