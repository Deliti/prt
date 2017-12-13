# map

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

优化点：
    1. 小车跑完之后自动重制  已解决
    2. 站点自定义命名       已解决
    3. 选择轨道起始点 所有全局轨道的始终点 全部显示 如果点重合就不显示 在拉轨道数据的时候 就进行判断



一期结束优化点
   ## 编辑状态
    1. 新建轨道，点击开始绘制，在地图上一边点击一边生成轨道，双击结束，实时保存
        结束回调 将新建轨道的数组传输后台保存，后台返回保存后的值

        新建轨道就作为一个轨道list页面 全局按钮存在，
        点击即可新建轨道，不进入详细的编辑页面

    2. 轨道点作为唯一标志，存储位置信息，站台信息，轨道信息
        (问题1)
    3. 拖拽轨道点 出现与相邻轨道点的虚线轨迹 拖拽完成 虚线变实线，
       将更新后的轨迹点传到后台，如果该点是站台，更新站台位置

    4. 鼠标划到轨道时，轨道高亮，点击进入详细编辑页面

   ## 模拟状态
    

   ## 问题1
    轨道信息包括 在哪条轨道上和在此轨道上的序号 
    问题在于 如何将新建的轨道点 与 存在轨道重合的轨道点 判定为同一个点 
        从而将重合信息发送到后台