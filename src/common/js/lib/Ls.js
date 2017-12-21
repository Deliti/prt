class Prt {
    constructor(props){
        super(props);
        const { map,pathList,opts } = props;
        this.map = map;
        this.pathList = pathList;
        //存储一条路线
        this._pathIndex = 0;
        this.i = 0;
        this._path = pathList[0].path;
        this.speed = this.pathList[0].speed;
         //进行坐标转换的类
        this._projection = this._map.getMapType().getProjection();
        // 暂停标志
        this._fromPause = false; 
        // 结束标志
        this._fromStop = false;
        // this._setOptions(opts);
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

    /**
     * @description 开始运动
     * @param none
     * @return 无返回值.
     *
     * @example 
     * lushu.start();
     */
    start(){
        const me = this,
            len = me._path.length;
        //不是第一次点击开始,并且小车还没到达终点
        if (me.i && me.i < len - 1) {
            //没按pause再按start不做处理
            if (!me._fromPause) {
                return;
            }else if(!me._fromStop){
	            //按了pause按钮,并且再按start，直接移动到下一点
	            //并且此过程中，没有按stop按钮
                //防止先stop，再pause，然后连续不停的start的异常
	            me._moveNext(++me.i);
            }
        }else {
            //第一次点击开始，或者点了stop之后点开始
            me._addMarker();
            //等待marker动画完毕再加载infowindow
            // me._timeoutFlag = setTimeout(function() {
                   
            // },400);
            me._addInfoWin();
        }
    }

    _moveNext(){
        const me = this;
        if (me.i < this._path.length - 1) {
            me._move(me._path[index], me._path[index + 1], me._tween.linear);
        }else{
            if(me._pathIndex < me._pathList.length - 1){
                me._pathIndex++;
                me._resetPath(me._pathList[me._pathIndex])
                if(me._path.length == 2){
                    me._move(me._path[0], me._path[1], me._tween.linear);
                }else{
                    me._moveNext(++me.i);
                }
            }else{
                this.stop(true);
            }
        }
    }

    _move(){

    }
}