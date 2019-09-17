import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "../types";
import xhr from "./xhr";
import { buildURL } from "../helpers/url";
import { flatternHeaders } from "../helpers/headers";
import transform from "./transform";

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    throwIfCancellationRequested(config);
    processConfig(config);
    return xhr(config).then(res => {
        return transformResponseData(res);
    });
}

function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config);
    // 因为处理headers的时候，依赖了data，所以要先处理headers，再能处理data
    config.data = transform(config.data, config.headers, config.transformRequest);
    config.headers = flatternHeaders(config.headers, config.method!);
}

function transformURL(config: AxiosRequestConfig): string {
    const { url, params } = config;
    return buildURL(url!, params);
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
    res.data = transform(res.data, res.headers, res.config.transformResponse);
    return res;
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
    }
}