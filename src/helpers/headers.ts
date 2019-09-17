import { isPlainObject, deepMerge } from './util';
import { Method } from '../types';

/**
 * 将headers里的配置项属性，归一化成指定的命名下
 * @param headers 配置config里的headers配置项
 * @param normalizedName 需要设置的请求头属性
 */
function normalizeHeaderName(headers: any, normalizedName: string): void {
    if (!headers) {
        return
    }

    Object.keys(headers).forEach(name => {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[name];
            delete headers[name];
        }
    });
}

/**
 * 处理请求的headers
 * 如果要发送的对象是普通对象，那么将请求头content-type设置为applications/json;charset=utf-8
 * @param headers 配置config的headers配置项
 * @param data 请求的数据data
 */
export function processHeaders(headers: any, data: any): any {
    normalizeHeaderName(headers, 'Content-Type');

    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8';
        }
    }
    return headers;
}

/**
 * 解析response的headers
 * @param headers response的headers
 */
export function parseHeaders(headers: string): any {
    let parsed = Object.create(null);
    if (!headers) {
        return parsed;
    }

    headers.split('\r\n').forEach(line => {
        let [key, val] = line.split(':');
        key = key.trim().toLowerCase();
        if (!key) {
            return;
        }
        if (val) {
            val = val.trim();
        }
        parsed[key] = val;
    });

    return parsed;
}

export function flatternHeaders(headers: any, method: Method): any {
    if (!headers) {
        return headers;
    }

    headers = deepMerge(headers.common || {}, headers[method] || {}, headers);

    const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];

    methodsToDelete.forEach(method => {
        delete headers[method];
    });

    return headers;
}