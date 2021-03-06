// localStorage的封装类
// const localStorage = typeof window === 'undefined' ? null : window.localStorage;
export default class Cache {
    constructor() {
        this.storage = new Map();
    }
    
    static getInstance() {
        if (!this.instance) {
            this.instance = new Cache();
        }
        return this.instance;
    }
    
    static getItem(uuid) {
        return this.getInstance().storage.get(uuid) || null;
    }

    static removeItem(uuid) {
        this.getInstance().storage.delete(uuid);
    }

    static setItem(uuid, etag, value) {
        this.getInstance().storage.set(uuid, {etag, value});
    }

    static getAllKeys() {
        return new Array(this.getInstance().storage.length).fill('').map((_, index) => this.getInstance().storage.key(index) || '');
    }

    static reset() {
        this.getInstance().storage.clear();
    }
}

// 只有get和head方法可以缓存
function isCacheableMethod(config) {
    return ['GET', 'HEAD'].indexOf(config.method.toUpperCase()) !== -1;
}

// 请求的地址作为UUID
function getUUIDByAxiosConfig(config) {
    return config.url;
}

function getCacheByAxiosConfig(config) {
    return Cache.getItem(getUUIDByAxiosConfig(config));
}

// request拦截
function requestIntercepter(config) {
    if (isCacheableMethod(config)) {
        const uuid = getUUIDByAxiosConfig(config);
        // 最后一次缓存的结果
        const lastCachedResult = Cache.getItem(uuid);
        if (lastCachedResult) {
            config.headers = {
                ...config.headers,
                'If-None-Match': lastCachedResult.etag
            };
        }
    }
    return config;
}

// response拦截
function responseInterceptor(response) {
    if (isCacheableMethod(response.config)) {
        // 无法获取response全部的headers 需要后台设置
        const responseEtag = response.headers['etag'];
        if (responseEtag) {
            Cache.setItem(getUUIDByAxiosConfig(response.config), responseEtag, response.data);
        }
    }
    return response;
}

// response error拦截
function responseErrorInterceptor(error) {
    // 304 缓存
    if (error.response && error.response.status === 304) {
        const getCachedResult = getCacheByAxiosConfig(error.response.config);
        if (!getCachedResult) {
            return Promise.reject(error);
        }
        const newResponse = error.response;
        newResponse.status = 200;
        newResponse.data = getCachedResult.value;
        return Promise.resolve(newResponse);
    }
    return Promise.reject(error);
}

export {
    requestIntercepter,
    responseInterceptor,
    responseErrorInterceptor
}