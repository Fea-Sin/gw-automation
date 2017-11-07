/*
*
* 实用工具
*
*/

/**
 * 处理jquery.css() 返回属性
 * "xxxpx" => "xxx"
 * 1. 将"px"去掉
 * 2. 将字符串转化为整数
 */
function getCssValU (val) {
	if( typeof val === "string" ) {
		var len = val.length;
		var str = val.substring(0, len-2)
		return ~~str;
	}
}

/**
 * 
 *  节流函数
 *  throttle 函数接收两个参数
 *  第一个参数为需要被延迟执行的函数
 *  第二个参数为延迟执行的时间
 */
function throttleU( fn, interval ) {
	var _self = fn,    // 保存需要被延迟执行的函数引用
		timer,         // 定时器
		firstTime = true;   // 是否是第一次调用
		
	return function() {
		var args = arguments,
			_me = this;
		
		if( firstTime ) {
			_self.apply(_me, args);    // 如果是第一次调用不需要延迟执行
			return firstTime = false;
		}
		
		if(timer) {    // 如果定时器还在，说明前一次延迟执行还没有完成
			return false;
		}
		
		timer = setTimeout(function() {    // 延迟一段时间执行
			clearTimeout(timer);
			timer = null;
			_self.apply(_me, args);
		}, interval || 500);
	};
};

/**
 * 
 *  获取浏览器视口的宽高度
 * 
 */
function winWH() {
	var winH = window.innerHeight 
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;
		
	var winW = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;
	var obj = {
		winH: winH,
		winW: winW
	}
	return obj;
}

/**
 * 
 * 判断DOM节点是否存在
 * 
 */
function DomExistU(objele) {
	if( typeof objele != undefined && objele.length >= 1) {
		return true;
	}
	return false;
}

/**
 * 
 * 返回日期 - 时间 字符串
 * 
 */
	function moniGetDateU() {
		var now = new Date();
		var sYear = now.getFullYear().toString();
		var sMonth = (now.getMonth() + 1).toString() < 10 ? '0'+(now.getMonth() + 1).toString() : (now.getMonth() + 1).toString();
		var sWeek = now.getDay().toString();
		var sDay = now.getDate().toString() < 10 ? '0'+now.getDate().toString() : now.getDate().toString();
		var shours = now.getHours().toString();
		var sMinute = now.getMinutes().toString();
		var sSecond = now.getSeconds().toString()
		
		var obj = {
			year: sYear,
			mouth: sMonth,
			week: sWeek,
			day: sDay,
			hour: shours,
			minute: sMinute,
			second: sSecond,
			allDay: sYear + "-" + sMonth + "-" + sDay,
			time: shours + ":" + sMinute + ":" + sSecond
		};
		
		return obj; 
	}
	
// 将时间戳转化为格式时间：
/*
 *  将时间戳转化为  格式 yyyy-MM-dd hh:mm:ss 时间
 *  参数为时间戳
 */
function getNormalTime( stamp ) {
	var normalTime = "",
	date = new Date( stamp ),
	Y = date.getFullYear() + '-',
	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
	D = date.getDate() + ' ',
	h = date.getHours() + ':',
	m = date.getMinutes() + ':',
	s = date.getSeconds();
	normalTime = Y+M+D+h+m+s;
	return normalTime;
}
// 将时间戳转化为  格式yyyy-mm-dd 
function getNormalDate( stamp ) {
	var normalTime = "",
	date = new Date( stamp ),
	Y = date.getFullYear() + '-',
	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
	D = date.getDate();
	normalTime = Y+M+D;
	return normalTime
}


