import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from "./types";
import { parseHeaders } from "./helpers/headers";
import { createError } from "./helpers/error";

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {

        const { url, data = null, method = 'get', headers, responseType, timeout } = config;

        const request = new XMLHttpRequest();

        if (responseType) {
            request.responseType = responseType;
        }

        if (timeout) {
            request.timeout = timeout;
        }

        request.open(method.toUpperCase(), url, true);

        request.onreadystatechange = function handleLoad() {

            // readyState的含义
            // 0 - (未初始化)还没有调用send()方法
            // 1 - (载入)已调用send()方法，正在发送请求
            // 2 - (载入完成)send()方法执行完成
            // 3 - (交互)正在解析响应内容
            // 4 - (完成)响应内容解析完成，可以在客户端调用了
            if (request.readyState !== 4) {
                return;
            }

            // 当出现网络错误或者超时错误的时候，该值都为 0
            if (request.status === 0) {
                return;
            }

            const responseHeaders = parseHeaders(request.getAllResponseHeaders());
            const responseData = responseType && responseType !== 'text' ? request.response : request.responseText;
            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            };
            handleResponse(response);
        }

        function handleResponse(response: AxiosResponse) {
            if (response.status >= 200 && response.status < 300) {
                resolve(response);
            } else {
                reject(createError(
                    `Request failed with status code ${response.status}`,
                    config,
                    null,
                    request,
                    response
                ));
            }
        }

        // 网络异常处理
        request.onerror = function handleError() {
            reject(createError(
                'Network Error',
                config,
                null,
                request,
            ));
        }

        // 超时异常处理
        request.ontimeout = function handleTimeout() {
            reject(createError(
                `Timeout of ${timeout} ms exceeded`,
                config,
                'ECONNABORTED',
                request
            ));
        }

        // 设置请求头headers
        Object.keys(headers).forEach(name => {
            if (data === null && name.toLowerCase() === 'content-type') {
                delete headers[name];
            } else {
                request.setRequestHeader(name, headers[name]);
            }
        });

        request.send(data);
    });
}