import { type } from "os";

export default {
	SETLEVEL(state,obj){
		state.levelData = obj;
	},
	SETHASCAR(state,boo){
		state.hasCar = boo
	},
	SETBIGDATA(state,boo){
		state.bigData = boo
	},
	SETGEOLOCATION(state,geo){
		state.latitude = geo.latitude;
		state.longitude = geo.longitude;
	},
	STOREUSER(state,info){
		state.userInfo = info
	},
	SETMAPFLAG(state,flag){
		if(typeof flag == 'boolean'){
			state.mapFlag = flag;
		}else{
			state.mapFlag = state.mapFlag?false:true
		}
		
	},
	/**
	 * 设置轨道为正在编辑的轨道
	 * @param {*} state 
	 * @param {*} lineObj 
	 */
	SETEDITID(state,id){
		if(id == 'add'){
			state.lineData.edit.flag = 'add';
			state.lineData.edit.id = "";
			state.lineData.edit.overlay = null;
		}else{
			state.lineData.edit.id = id;
			state.lineData.edit.flag = 'edit';
			state.lineData.edit.overlay = state.lineData.mapList[id];
		}
	},
	SETEDITLINE(state,lineObj){
		state.lineData.edit.overlay = lineObj;
		if(!lineObj){
			state.lineData.edit.id = "";
			state.lineData.edit.flag = '';
			state.lineData.edit.data = null;
		}
	},
	RESETLINE(state,points){
		state.lineData.edit.overlay.setPath(points);
	},
	/**
	 * 删除正在被编辑的轨道
	 * @param {*} state 
	 */
	DELLINE(state){
		state.lineData.edit.overlay.del = true;
		// const id = state.lineData.edit.overlay.id;
		// if(id){
		// 	delete state.lineData.mapList[id];
		// }
	},
	/**
	 * 插入或者更新全局轨道原始数据
	 * @param {*} state 
	 * @param {*} key 
	 * @param {*} val 
	 */
	INSERTLINE(state,opt){
		state.lineData.dataList[opt.id] = opt.vals;
	},
	/**
	 * 插入或者更新全局轨道
	 */
	INSERTMAPLINE(state,opt){
		state.lineData.mapList[opt.id] = opt.mapOverlay;
	},
	// 车站
	/**
	 * 设置轨道为正在编辑的轨道
	 * @param {*} state 
	 * @param {*} lineObj 
	 */
	SETSTAEDITID(state,id){
		if(id == 'add'){
			state.station.edit.flag = 'add';
			state.station.edit.id = "";
			state.station.edit.overlay = null;
		}else{
			state.station.edit.id = id;
			state.station.edit.flag = 'edit';
			state.station.edit.overlay = state.station.mapList[id];
		}
	},
	DELSTATION(state){
		state.station.edit.overlay.del = true;
		const id = state.station.edit.overlay.id;
		if(id){
			delete state.station.dataList[id];
			delete state.station.mapList[id];
		}
	},
	SETEDITSTATION(state,obj){
		state.station.edit.overlay = obj;
		if(!obj){
			state.station.edit.id = "";
			state.station.edit.flag = '';
			state.station.edit.data = null;
		}
	},
	/**
	 * 插入或者更新全局轨道原始数据
	 * @param {*} state 
	 * @param {*} key 
	 * @param {*} val 
	 */
	INSERTSTATION(state,opt){
		state.station.dataList[opt.id] = opt.vals;
	},
	/**
	 * 插入或者更新全局轨道
	 */
	INSERTMAPSTATION(state,opt){
		state.station.mapList[opt.id] = opt.mapOverlay;
	},
	// 存储设施
	/**
	 * 设置轨道为正在编辑的轨道
	 * @param {*} state 
	 * @param {*} lineObj 
	 */
	SETSAVEEDITID(state,id){
		if(id == 'add'){
			state.save.edit.flag = 'add';
			state.save.edit.id = "";
			state.save.edit.overlay = null;
			state.save.edit.data = null;
		}else{
			state.save.edit.id = id;
			state.save.edit.flag = 'edit';
			state.save.edit.overlay = state.save.mapList[id];
			state.save.edit.data = state.save.dataList[id];
		}
	},
	DELSAVE(state){
		state.save.edit.overlay.del = true;
		const id = state.save.edit.overlay.id;
		if(id){
			delete state.save.dataList[id];
			delete state.save.mapList[id];
		}
	},
	SETEDITSAVE(state,obj){
		state.save.edit.overlay = obj;
		if(!obj){
			state.save.edit.id = "";
			state.save.edit.flag = '';
			state.save.edit.data = null;
		}
	},
	/**
	 * 插入或者更新全局轨道原始数据
	 * @param {*} state 
	 * @param {*} key 
	 * @param {*} val 
	 */
	INSERTSAVE(state,opt){
		state.save.dataList[opt.id] = opt.vals;
	},
	/**
	 * 插入或者更新全局轨道
	 */
	INSERTMAPSAVE(state,opt){
		state.save.mapList[opt.id] = opt.mapOverlay;
	},

	/**
	 * 改变地图车辆运行状态
	 */
	CHANGERUNSTATUS(state,status){
		state.runStatus = status;
	}
}