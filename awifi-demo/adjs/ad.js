
window.onload = function() {
/**
 * 检测对象是否为数组
 * @param {Object} 用于测试是否为数组的对象
 * @return {boolean}
 * @memberOf _global_
 */
function isArray(variable) {
	return Object.prototype.toString.call(variable) === '[object Array]';
}

function trim(str) {
	return str.replace(/^\s+|\s+$/g, '')
}

/**
 * 创建标签
 * @param {string} 需要创建的标签字符串
 */

function newElement(str){
	return document.createElement(str);
}

/**
 * 插入内联样式
 */
function addStyle(ele,str){
    var s = ele.getAttribute('style'),styles;
    if(str && typeof str === 'string'){
        if(!s){
            ele.style.cssText = str;
        }else{
            if(s == '[object]'){//IE6/7 e.getAttribute(''style'')返回[object]
                s=ele.style.cssText;
            }
            styles= trim(s).split(';');
            for (var i=0,len=styles.length; i<len; i++){
                var style_i=trim(styles[i]);
                var attr=style_i.split(':')[0];
                if(str.indexOf(attr)>-1){
                    styles[i]='';
                }else{
                    styles[i]=style_i;
                }
            }
            ele.style.cssText= styles.join('')+';'+str;
        }
    }
}

var DOMAIN = 'http://evanliao.github.io/awifi-demo/tuniu';
/**
 * 获取js参数 -- ps:不要在方法中调用此方法，否则可能始终获取的是最后一个js的文件的参数，要在方法中使用，请先放到js加载时就会执行的变量中 保存
 * @return {Array} 返回js参数
 */
function getScriptArgs() {
	var scripts = document.getElementsByTagName('script'),
	    script = scripts[scripts.length-1],//因为当前dom加载时后面的script标签还未加载，所以最后一个就是当前的script
	    src = script.src,
	    reg = /(?:\?|&)(.*?)=(.*?)(?=&|$)/g,
	    temp,
	    res = {};
	DOMAIN=src.substr(0,src.lastIndexOf('/'));
    while((temp=reg.exec(src))!=null)
    	res[temp[1]] = decodeURIComponent(temp[2]);
    return res;
}

/**
 * 获取浏览器窗口的宽高值
 * @return {Object} 返回包含浏览器窗口宽、高值得对象
 */
function getWindow() {
	var winWidth, winHeight;
	//获取窗口宽度
	if (window.innerWidth) {
		winWidth = window.innerWidth;
	}else if ((document.body) && (document.body.clientWidth)) {
		winWidth = document.body.clientWidth;
	}
	//获取窗口高度
	if (window.innerHeight) {
		winHeight = window.innerHeight;
	}else if ((document.body) && (document.body.clientHeight)) {
		winHeight = document.body.clientHeight;
	}
	//通过深入Document内部对body进行检测，获取窗口大小
	if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
		winHeight = document.documentElement.clientHeight;
		winWidth = document.documentElement.clientWidth;
	}
	return {width: winWidth, height: winHeight};
}

/**
 * 事件监听
 * @param  {Element} target  事件监听的对象
 * @param  {string} type    事件监听的类型，如 'click'
 * @param  {Function} handler 事件句柄
 */
function bind(target, type, handler) {
	if(target.addEventListener) {
		target.addEventListener(type, handler);
	}else if(target.attachEvent){
		target.attachEvent('on' + type, handler);
	}
}

function isPC() {
	var ua = navigator.userAgent.toLowerCase(),
	    check = function(r){
	        return r.test(ua);
	    },
	    isOpera = check(/opera/),
	    isChrome = check(/chrome/),
	    isWebKit = check(/webkit/),
	    isSafari = !isChrome && check(/safari/),
	    isSafari3 = isSafari && check(/version\/3/),
	    isSafari4 = isSafari && check(/version\/4/),
	    isIE = !isOpera && check(/msie/),
	    isIE7 = isIE && check(/msie 7/),
	    isIE8 = isIE && check(/msie 8/),
	    isIE6 = isIE && !isIE7 && !isIE8,
	    isGecko = !isWebKit && check(/gecko/),
	    isGecko3 = isGecko && check(/rv:1\.9/),
	    isWindows = check(/windows|win32/),
	    isMac = check(/macintosh|mac os x/),
	    isLinux = check(/linux/),
	    isAndroid = check(/android/),
	    isIphone = check(/ip(hone|od)/),
	    isWinphone = check(/windows (ce|phone)/),
	    isSymbian = check(/symbian/);

	return (isAndroid || isSymbian || isWinphone || isIphone) ? false : true;
}

var sArgs = getScriptArgs();


/**
 * 获取客户端设备类型，移动（手机、平板）或电脑
 * @return {string} 返回类型，'isM' or 'isPC', 默认返回'isM'
 */
function getDeviceType(args) {
	var type = args['d_type'];
	if(type) {
		return (type === 2) ? 'isPC' : 'isM';
	}else {
		return isPC() ? 'isPC' : 'isM';
	}
}

/**
 * 获取广告位置，目前支持： 居中，头部，底部
 * @return {string} 返回位置，'isCenter' 、'isTop' 、 'isBottom', 默认返回'isCenter'
 */
function getAdPos(args) {
	var pos = args['ad_pos'];
	if(pos) {
		return (pos === 'top') ? 'isTop' : (pos === 'bottom') ? 'isBottom' : 'center';
	}else {
		return 'isCenter';
	}
}

/**
 * 获取广告尺寸，目前支持： 全屏，头部，底部
 * @return {string} 返回尺寸， 默认返回{width: 'full', height: 'full'}
 */
function getAdSize(args) {
	var width = args['ad_w'],
		height = args['ad_h'],
		size = {width: '100%', height: '100%'};
	if(!(width === 'full' && height === 'full')) {
		if(width) {
			size.width = parseInt(width, 10);
		}
		if (height) {
			size.height = parseInt(height, 10);
		}
	}
	return size;
}

/**
 * 获取广告地址
 * @return {string} 返回url
 */
function getAdUrl(args) {
	var url = args && args['ad_url'];
	return (url) ? url : DOMAIN + '?';
}

/**
 * 获取网关ID
 * @return {string} 返回网关ID
 */
function getGwId(args) {
	var gwId = args && args['gw_id'] || '';
	return gwId;
}

function init() {
	var url = getAdUrl(sArgs),
		gwId = getGwId(sArgs),
		prarm = '',
		src = url + prarm,
		id = '4free-iframe',
		adId = '4free-ad',
		div,
		close,
		html = document.getElementsByTagName('html')[0],
		newIframe,
		htmlHeight,
		divHeight,
		divWidth,
		htmlStyle = '',
		style,
		resized,
		scale = 50 / 320; // 广告图片比例

	var divStr = '-webkit-tap-highlight-color: rgba(0,0,0,0);background-color:#fff;background-color:rgba(255,255,255,.5);position: fixed; left:0; right: 0; bottom: 0;height:50px;overflow: hidden;z-index:99999999999;_position:absolute; _margin-top: 0; _left:0; _top:expression(documentElement.scrollTop+(documentElement.clientHeight-this.offsetHeight))',
		iframeStr = 'display: block; width: 100%; height:100%; border:0; vertical-align: top;',
		cDivStr = 'overflow:hidden;width:100%;height:100%;margin:0 auto;position:relative;top:0;left:0;',
		closeStr = 'font-family: Arial;font-size: 20px;position: absolute;top: -30px;right: -30px;display: inline-block;width: 60px;height: 60px;overflow: hidden;cursor: pointer;line-height: 86px;text-align: left;color: #fff;background-color:#000;background-color: rgba(0,0,0,.5);border-radius: 50%;text-indent: 12px;*text-indent: 10px;border:1px solid #666;border: 1px solid rgba(255,255,255,.25);';

	if(!window.frameElement && window.top && !window.top.document.getElementById(id)) {
		div = newElement('div');
		cDiv = newElement('div');
		close = newElement('div');
		newIframe = newElement('iframe');
		newIframe.id = id;
		newIframe.frameBorder = '0';
		newIframe.marginWidth = '0';
		newIframe.marginHeight = '0';
		newIframe.scrolling = 'no';
		newIframe.width = '100%';
		newIframe.height = '100%';
		newIframe.name = 'frame';
		newIframe.src = 'http://evanliao.github.io/awifi-demo/tuniu';
		div.id = adId;
		div.style.visibility = 'hidden';
		close.id = '4free-chose';
		close.innerHTML = '×';
		document.body.appendChild(div);
		div.appendChild(cDiv);
		cDiv.appendChild(close);
		cDiv.appendChild(newIframe);

		addStyle(div, divStr);
		addStyle(cDiv, cDivStr);
		addStyle(newIframe, iframeStr);
		addStyle(close, closeStr);

		divWidth = div.offsetWidth;
		divHeight = scale * divWidth;

		bind(close, 'click', function(e) {
			html.style.paddingBottom = '';
			html.setAttribute('style', htmlStyle);
			div.parentNode.removeChild(div);
		});

		var args = {};

		var getParerOfBm = window.getParerOfBm = window.getParerOfBm || function(data) {
			if(data && data.ip) {
				args = data;
				var src = getAdUrl(data);
				for(var key in data) {
					src += (key + '=' + data[key] + '&');
				}
				setPos(args);
				newIframe.src = src + '&time=' + new Date().getTime();
			}else {
				div.style.display = 'none';
				throw(new Error('没有广告哦！'));
			}
		}
        /**
		var script = document.createElement('script');
	  	script.src = DOMAIN + '/index/get_clientInfo?callback=getParerOfBm' + '&gw_id=' + gwId + '&time=' + new Date().getTime();
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(script, s);
		*/
		bind(newIframe, 'load', function() {
			div.style.visibility = 'visible';
		});
	}

	function setPos(args) {
		var size = getAdSize(args),
			type = getDeviceType(args),
			pos = getAdPos(args);

		if(pos === 'isTop') {
			div.style.bottom = 'auto';
		}else if(pos === 'isBottom') {
			div.style.top = 'auto';
		}

		if(type === 'isM') { //移动端广告
			setHtmlStyle(pos);

			if(!(size.width == '100%' && size.height == '100%')){
				setDivHeight(pos);
			}

			bind(document, 'touchstart', function() {
				clearTimeout(resized);
			});

			bind(document, 'touchend', function() {
				setDivHeight(pos);
				resized = setTimeout(function() {
					setDivHeight(pos);
				}, 5);
			});

			bind(window, 'resize', function() {
				setDivHeight(pos);
			});

		}else {	//PC端广告
			setPCDivHeight(size);
			if(!(size.width == '100%' && size.height == '100%')){
				div.style.height = divHeight + 'px';
				setHtmlStyle(pos);
				bind(window, 'resize', function() {
					setPCDivHeight(size);
					div.style.height = divHeight + 'px';
				});
			}
		}
	}

	function setHtmlStyle(pos) {
		htmlStyle = html.getAttribute('style') || '';
		if(pos === 'isBottom') {
			html.style.paddingBottom = divHeight + 'px';
		}else if(pos === 'isTop') {
			html.style.paddingTop = divHeight + 'px';
		}
	}

	function setPCDivHeight(size) {
		var winW = getWindow().width;
		if(winW < size.width) {
			cDiv.style.width = winW + 'px';
			divHeight = (winW / size.width) * size.height;
		}else {
			cDiv.style.width = size.width + 'px';
			divHeight = size.height;
		}
	}

	function setDivHeight(pos) {
		html.setAttribute('style', htmlStyle);
		divHeight = scale * window.innerWidth;
		div.style.height = divHeight + 'px';
		if(pos === 'isBottom') {
			html.style.paddingBottom = divHeight + 'px';
		}else if(pos === 'isTop') {
			html.style.paddingTop = divHeight + 'px';
		}
	}

}

/**
 * 过滤网址白名单
 * @param  {Array} list 白名单列表
 * @return {boolean} 若当前主机网址在白名单列表中，则返回true，否则返回false
 */

function filterDomain(list) {
	if(!isArray(list)) {
		return false;
	}
	var domain = location.host,
		len = list.length,
		i = 0,
		reg;

	for(; i < len; i++) {
		reg = new RegExp(whiteList[i]);
		if(reg.test(domain)) {
			return true;
			break;
		}
	}
	return false;
}

var whiteList = [];

if(!filterDomain(whiteList)) {
	init();
}

};