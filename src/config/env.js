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
	crowd:'#b72467'
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
	baseUrl = 'http://101.132.98.201:8087';
}

export {
	baseUrl,
	basePath,
	routerMode,
	imgBaseUrl,
	trackColor,
	defaultPosition
}