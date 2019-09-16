import { isPlainObject } from "./util";

/**
 * 转换请求request的data数据
 * @param data 请求的data数据
 */
export function transformRequest(data: any): any {
    if (isPlainObject(data)) {
        return JSON.stringify(data);
    }
    return data;
}

/**
 * 转换响应response的data数据
 * @param data 返回的data数据
 */
export function transformResponse(data: any): any {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (e) {
            // do nothing
        }
    }
    return data;
}