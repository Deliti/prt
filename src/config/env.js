/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * appid: 爱贝支付id
 * defaultPosition: 默认经纬度
 */
let baseUrl;
let routerMode;
let basePath;
const imgBaseUrl = '';
const trackColor = {
	normal:'#00a651',
	broken:'#524fa1',
  crowd:'#b72467',
  0:'rgb(69,119,30)',  // 畅通
  1:'rgb(160,198,50)', // 基本畅通
  2:'rgb(255,255,62)', // 轻度拥堵
  3:'rgb(227,114,37)', // 中度拥堵
  4:'rgb(255,0,0)'     // 严重拥堵
}
const defaultPosition = {
	latitude:'32.028937',
	longitude:'118.787164'
}
if (process.env.NODE_ENV == 'development') {
	basePath = ''
	baseUrl = '/api';

}else{
	basePath = '';
	baseUrl = 'http://106.15.93.184:8087';
}

export {
	baseUrl,
	basePath,
	routerMode,
	imgBaseUrl,
	trackColor,
	defaultPosition
}
