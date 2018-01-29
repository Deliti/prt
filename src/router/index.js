import Vue from 'vue';
import Router from 'vue-router';
import Login from 'pages/Login/login';

// 入口页面
import Enter from 'pages/Enter';

// 模拟器页面
import Home from 'pages/Home';
import BigHome from 'pages/Home/BigHome';
import Design from 'pages/Design';
import Handle from 'pages/Handle'; // 功能区域
import Statistics from 'pages/Statistics'; // 功能区域
import Material from 'pages/Material'; // 素材区域
import LineList from 'pages/Material/Line/index';  // 轨道list
import EditLine from 'pages/Material/Line/EditLine';  // 新增编辑页面
import StaList from 'pages/Material/Station/index';  // 车站list
import EditSta from 'pages/Material/Station/EditStation';  // 新增编辑页面
import SaveList from 'pages/Material/Save/index';  // 车站list
import EditSave from 'pages/Material/Save/EditSave';  // 新增编辑页面

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '',
      name: 'home',
      component: Enter
    },
    {
      path: '/simulator/:id',
      name: 'simulator',
      component: Home,
      children:[
        {
          path: '',
          redirect: 'material'
        },
        {
          path: 'handle',
          component: Handle
        },
        {
          path: 'statistics',
          component: Statistics
        },
        {
          path: 'material',
          component: Material,
          name:'material',
        },
        {
          path: 'line',
          name: 'line',
          component: LineList
        },
        {
          path: 'editLine',
          component: EditLine
        },
        {
          path: 'station',
          name:'station',
          component: StaList
        },
        {
          path: 'editStation',
          component: EditSta
        },
        {
          path: 'save',
          name: 'save',
          component: SaveList
        },
        {
          path: 'editSave',
          component: EditSave
        }
      ]
    },
    {
      path: '/bigsimulator/:id',
      name: 'bigsimulator',
      component: BigHome,
      children:[
        {
          path: '',
          redirect: 'material'
        },
        {
          path: 'handle',
          component: Handle
        },
        {
          path: 'statistics',
          component: Statistics
        },
        {
          path: 'material',
          component: Material,
          name:'material',
        },
        {
          path: 'line',
          name: 'line',
          component: LineList
        },
        {
          path: 'editLine',
          component: EditLine
        },
        {
          path: 'station',
          name:'station',
          component: StaList
        },
        {
          path: 'editStation',
          component: EditSta
        },
        {
          path: 'save',
          name: 'save',
          component: SaveList
        },
        {
          path: 'editSave',
          component: EditSave
        }
      ]
    },
    {
      path: '/designed',
      name: 'Design',
      component: Design
    }
  ]
})

