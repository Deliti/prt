import fetch from '../config/fetch'

export const signin = data => fetch('post','/user/login',data)   // 注册&登录
/**
 * 新建模拟事件
 */
export const createEvent = (eventName) => fetch('post','/event/createNewEvent',{eventName})

/**
 * 模拟事件列表
 */
export const getEventList = data => fetch('post','/event/overview',data)

/**
 * 删除模拟事件
 */
export const delEvent = data => fetch('post','/event/delete',data)


/**
 *  所有素材list
 */
export const getMaterial = data => fetch('post','/event/detail',data)


/**
 *  大数据素材list
 */
export const getMaterialV2 = data => fetch('post','/event/detailV2',data)

/**
 * 后台根据参数算出终点
 */
export const getTargetLngLat = data => fetch('post','/distance/getTrackEndLocation',data)

/**
 *  合并点
 */
export const mergePt = data => fetch('post','/track/mergeVertex',data);

/**
 * 新建轨道
 */
export const addTrack = data => fetch('post','/track/addTrack',data);

/**
 * 编辑轨道
 */
export const updateTrack = data => fetch('post','/track/update',data);

/**
 * 轨道详情
 */
export const trackDetail = data => fetch('post','/track/detail',data);

/**
 * 删除轨道
 */
export const trackDel = data => fetch('post','/track/delete',data);


/**
 * 导轨另存为前调取接口
 */
export const saveTrack = data => fetch('post','/track/saveAsTrack',data);

/**
 * 导轨导入
 */
export const importTrack = (id,data) => fetch('post',`/track/importTrack?eventId=${id}`,data);

/**
 * 新建站台
 * @param {*} data
 */
export const addStation = data => fetch('post','/station/addStationDetail',data);


/**
 * 站台详情
 */
export const stationDetail = data => fetch('post','/station/detail',data);

/**
 * 编辑站台
 */
export const editStation = data => fetch('post','/station/editStationDetail',data);

/**
 * 删除站台
 */
export const delStation = data => fetch('post','/station/delete',data);

/**
 * 得到车辆存储设施的坐标
 */
export const getStorageLngLat = data => fetch('post','/distance/getStorageEndLocation',data);

/**
 * 站台名是否合法
 */
export const getStationId = data => fetch('post','/event/queryMaterialName',data);


/**
 * 新建存储设施
 * @param {*} error
 */
export const addStorage = data => fetch('post','/storage/addStorageDetail',data);

/**
 * 存储设施详情
 */
export const storageDetail = data => fetch('post','/storage/detail',data);

/**
 * 编辑存储设施
 */
export const editStorage = data => fetch('post','/storage/editStorageDetail',data);


/**
 * 删除存储设施
 */
export const delStorage = data => fetch('post','/storage/delete',data);




// 以下是运行状态
export const addRunCar = data => fetch('post','/event/run',data);



export const showError = error =>
{
    switch(error.code)
    {
        case error.PERMISSION_DENIED:
            console.log("用户拒绝对获取地理位置的请求。" )
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("位置信息是不可用的。" )
            break;
        case error.TIMEOUT:
            console.log("请求用户地理位置超时。" )
            break;
        case error.UNKNOWN_ERROR:
            console.log("未知错误。" )
            break;
    }
}


// 获取当前地理位置
export const getLocation = (callBack,errBack) => {
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(callBack,errBack)
	}else{
        errBack();
	}
}

export const getGoodsTypeList = () => fetch('post','mall.app.getGoodsTypeList');   //首页商品分类
