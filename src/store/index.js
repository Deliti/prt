import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import action from './action'

Vue.use(Vuex);

const state = {
	userInfo:{},
	mapFlag:0, // 0 编辑 1 运行
	lineData:{
		edit:{
			flag:'', // add 新增 edit 编辑 show 展示
			id:'',  // 后台保存的id
			overlay:null,  // 当前编辑的轨道
			data:null // 当前编辑的数据
		},
		dataList:{}, // 所有的数据集合
		mapList:{}  // 所有地图轨道集合
	},
	station:{
		edit:{
			flag:'', // add 新增 edit 编辑 show 展示
			id:'',
			overlay:null,  // 当前编辑的轨道
			data:null // 当前编辑的数据
		},
		dataList:{},// 车站所有数据集合
		mapList:{}, // 所有地图车站集合
	},
	save:{
		edit:{
			flag:'', // add 新增 edit 编辑 show 展示
			id:'',
			overlay:null,  // 当前编辑的轨道
			data:null // 当前编辑的数据
		},
		dataList:{},// 车站所有数据集合
		mapList:{}, // 所有地图车站集合
	},
	// 以下是运行功能键
	runStatus: 0, // 0 还未开始，1 运行，2 暂停，3 停止
	hasCar:false
}

export default new Vuex.Store({
	state,
	mutations,
	action
})