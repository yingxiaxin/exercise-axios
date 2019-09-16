export type Method = 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'put' | 'PUT'
    | 'post' | 'POST'
    | 'patch' | 'PATCH';

export type XMLHTTPResponseType = '' | 'arraybuffer' | 'blob' | 'document' | 'json' | 'text';

export interface AxiosRequestConfig {
    url: string;
    method?: Method;
    data?: any;
    params?: any;
    headers?: any;
    responseType?: XMLHTTPResponseType;
    timeout?: number;
}

export interface AxiosResponse {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosRequestConfig;
    request: any;
}

export interface AxiosPromise extends Promise<AxiosResponse> {

}

export interface AxiosError extends Error {
    config: AxiosRequestConfig;
    code?: string;
    request?: any;
    response?: any;
    isAxiosError: boolean;
}