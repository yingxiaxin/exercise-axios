import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "./types";
import xhr from "./xhr";
import { buildURL } from "./helpers/url";
import { transformRequest, transformResponse } from "./helpers/data";
import { processHeaders } from "./helpers/headers";

function axios(config: AxiosRequestConfig): AxiosPromise {
    processConfig(config);
    return xhr(config).then(res => {
        return transformResponseData(res);
    });
}

function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config);
    // 因为处理headers的时候，依赖了data，所以要先处理headers，再能处理data
    config.headers = transformHeaders(config)
    config.data = transformRequestData(config);
}

function transformURL(config: AxiosRequestConfig): string {
    const { url, params } = config;
    return buildURL(url, params);
}

function transformRequestData(config: AxiosRequestConfig): any {
    return transformRequest(config);
}

function transformHeaders(config: AxiosRequestConfig): any {
    const {headers = {}, data} = config;
    return processHeaders(headers, data);
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
    res.data = transformResponse(res.data);
    return res;
}

export default axios;