import { message } from 'antd';

/**
 * 检测身份证是否合法
 * @param  {[type]} idNumber [description]
 * @return {[type]}          [description]
 */
export const testIdNumber = idNumber => {
	const idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	if(!idNumber) {
		message.error('身份证号不能为空');
		return false;
	} else if(!idReg.test(idNumber)) {
		message.error('请输入正确的身份证号');
		return false;
	} else {
		return true;
	}
}

/**
 * 检测手机号是否合法
 * @param  {[type]} phone [description]
 * @return {[type]}       [description]
 */
export const testPhone = phone => {
	const phoneReg = /^((1[3-9]{1}[0-9]{1})+\d{8})$/;
	if(!phone) {
		message.error('手机号不能为空');
		return false;
	} else if(!phoneReg.test(phone)) {
		message.error('请输入正确的手机号');
		return false;
	} else {
		return true;
	}
}

/**
 * 检测邮箱是否合法
 * @param  {[type]} email [description]
 * @return {[type]}       [description]
 */
export const testEmail = email => {
	const emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	if(!email) {
		message.error('邮箱不能为空');
		return false;
	} else if(!emailReg.test(email)) {
		message.error('请输入正确的邮箱账号');
		return false;
	} else {
		return true;
	}
}

/**
 * 检测用户名是否合法
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export const testUsername = str => {
	if(!str) {
		message.error('用户名不能为空');
		return false;
	} else if(getStrlen(str) < 2 || getStrlen(str) > 20) {
		message.error('用户名不合法');
		return false;
	} else {
		return true;
	}
}

/**
 * 检测登录密码是否合法
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export const testPassword = str => {
	const passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
	if(!str) {
		message.error('密码不能为空');
		return false;
	} else if(!passwordReg.test(str)) {
		message.error('密码应为8-20位的数字字母组合');
		return false;
	} else {
		return true;
	}
}

/**
 * 检测资金密码是否合法
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export const testFundPassword = str => {
	const passwordReg = /^(\d{6})$/;
	if(!str) {
		message.error('密码不能为空');
		return false;
	} else if(!passwordReg.test(str)) {
		message.error('密码应为6位数字');
		return false;
	} else {
		return true;
	}
}

/**
 * 获取字符长度
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export const getStrlen = str => {
	var len = 0;
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			len++
		} else {
			len+=2
		}
	}
	return len
}


/**
 * 获取url中的参数
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
export const getQueryString = name => {
	let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
	let r = window.location.search.substr(1).match(reg)
	if (r != null) return decodeURI(r[2])
	return null
}


/**
 * 函数去抖
 * @param  {[type]} method [description]
 * @return {[type]}        [description]
 */
export const debounce = method => {
	if (method.timeout) {
		clearTimeout(method.timeout);
	}
	method.timeout = setTimeout(() => {
		method();
	}, 500);
}


/**
 * 求两个数组的交集,非对象数组
 * ES7  let intersection = allData.filter(v => editData.includes(v));
 * @param  {[type]} arr1 [description]
 * @param  {[type]} arr2 [description]
 * @return {[type]}      [description]
 */
export const findArrayIntersection = (arr1, arr2) => {
	if (
		Object.prototype.toString.call(arr1) === '[object Array]' &&
		Object.prototype.toString.call(arr2) === '[object Array]'
	) {
		return arr1.filter(function (v) {
			return arr2.indexOf(v) !== -1;
		});
	}
};


/**
 * 对象数组的交集,  数据结构必须相同
 * @param  {[type]}  list1   [description]
 * @param  {[type]}  list2   [description]
 * @param  {[type]}  key     [description]
 * @param  {Boolean} isUnion [description]
 * @return {[type]}          [description]
 */
export const findArrayIntersectionOfObject = (list1, list2, key,isUnion = true) => {
	if (list2 !== undefined && list2 !== undefined) {
		return list1.filter(a => isUnion === list2.some(b => a[key] === b[key]));
	} else {
		return [];
	}
};



/**
 * 根据 key在  object中 获取指定子 object
 * @param  {[type]} data  [description]
 * @param  {[type]} key   [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
export const findSubObjectInObject = (data, key, value) => {
	let target = {};
	for (let item in data) {
		const object = data[item];

		if (
			String(object[key]).includes(value) ||
			String(value).includes(object[key])
		) {
			target = object;
		}
	}
	// if (!isObjectValid(target)) {
	// 	message.error(`无法获取${key}与${value}的映射`);
	// }

	return target;
};


/**
 * 自动调整宽高
 * @param  {[type]} Img       [description]
 * @param  {[type]} maxWidth  [description]
 * @param  {[type]} maxHeight [description]
 * @return {[type]}           [description]
 */
export const autoSizeImg = (Img, maxWidth, maxHeight) => {
	const image = new Image();
	//原图片原始地址（用于获取原图片的真实宽高，当<img>标签指定了宽、高时不受影响）
	image.src = Img.src;
	// 当图片比图片框小时不做任何改变
	if (image.width < maxWidth && image.height < maxHeight) {
		Img.width = image.width;
		Img.height = image.height;
	} else {
		//原图片宽高比例 大于 图片框宽高比例,则以框的宽为标准缩放，反之以框的高为标准缩放
		if (maxWidth / maxHeight <= image.width / image.height) {
			//原图片宽高比例 大于 图片框宽高比例
			Img.width = maxWidth; //以框的宽度为标准
			Img.height = maxWidth * (image.height / image.width);
		} else {
			//原图片宽高比例 小于 图片框宽高比例
			Img.width = maxHeight * (image.width / image.height);
			Img.height = maxHeight; //以框的高度为标准
		}
	}

	return Img;
};