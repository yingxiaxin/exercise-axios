import { isDate, isPlainObject } from "./util";

/**
 * 对url字符串进行编码。但是同时，对其中一些字符不进行编码，要转换回来
 * 注意：编码结果里有英文字母的，正则中要跟上i标记，忽略大小写
 * @param val url字符串
 */
function encode(val: string): string {
    return encodeURIComponent(val)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']');
}

export function buildURL(url: string, params?: any): string {
    if (!params) {
        return url;
    }

    // 开始处理参数的所有属性
    const parts: string[] = [];
    Object.keys(params).forEach(key => {
        let val = params[key];

        // 1、第一种情况，如果参数值为null或undefined，则在url中省略
        if (val === null || typeof val === 'undefined') {
            return;
        }

        // 将参数值是数组、不是数组的情况都统一放入数组中遍历处理
        let values: string[];
        if (Array.isArray(val)) {
            values = val;
            key = key + '[]';
        } else {
            values = [val];
        }
        values.forEach(val => {
            // 2、如果参数值是日期类型
            if (isDate(val)) {
                val = val.toISOString();
            } else if (isPlainObject(val)) {
                // 3、如果参数值是普通对象
                val = JSON.stringify(val);
            }
            // 生成参数字符串时，需要对内容进行encode
            parts.push(`${encode(key)}=${encode(val)}`);
        });
    });

    // 将所有的参数字符串拼接
    let serializedParams = parts.join('&');

    // 判断url中是否有hash符#，如果有，那么截取#号及其后面的内容
    if (serializedParams) {
        const markIndex = url.indexOf('#');
        if (markIndex !== -1) {
            url = url.slice(0, markIndex);
        }

        // url如果本来已经带了?号，说明本身有参数，后面拼接&符号；如果没有?号，那么拼接?号再拼接参数
        url = url + ((url.indexOf('?') === -1) ? '?' : '&') + serializedParams;
    }

    return url;
}