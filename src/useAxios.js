import React from 'react';
import {useState,  useEffect, useContext, useRef, useReducer} from 'react';
import axios from 'axios';
import { AxiosContext } from './AxiosConfig';
import { initResps, actions, responseReducer } from './reducers';
import Storage from './Storage';
import { encrypt } from './secret';

const cache = new Storage();

const useAxios = (config, options) => {
    const globalConfig = useContext(AxiosContext) || {};
    const cancelable = options.cancelable || false;
    const cancelSource = useRef();

    const axiosInstance = globalConfig.axiosInstance || axios.create();

    // request 拦截
    axiosInstance.interceptors.request.use((config) => {
        const source = cancelable ? axios.CancelToken.source() : undefined; // 可能是undefined
        // 获取缓存数据
        const data = cache.getItem(encrypt(
            config.url + JSON.stringify(config.data) + (config.method || '')
        ));

        // 判断是否命中 是否过期
        if (data && (Date.now() <= data.expires)) {
            console.log(`接口：${config.url}缓存命中 -- ${Date.now()} -- ${data.expires}`);
            // 缓存的数据通过cancel方法回传
            source.cancel(JSON.stringify({
                type: 'CACHE',
                data: data.data
            }))
        }
        return config;
    })

    // response 拦截
    axiosInstance.interceptors.response.use((res) => {
        if (res.data) {
            if (res.config.data) {
                const dataParse = JSON.parse(res.config.data);
                if (dataParse.cache) {
                    if (!dataParse.cacheTime) {
                        dataParse.cacheTime = 1000 * 60 * 3;
                    }

                    cache.setItem(encrypt(res.config.url + res.config.data + (res.config.method || '')), {
                        data: res.data,
                        expires: Date.now() + dataParse.cacheTime
                    });

                    console.log(`接口：${res.config.url} 设置缓存，缓存时间：${dataParse.cacheTime}`);
                }
            }
            return res;
        }
        else {
            return Promise.reject('接口报错');
        }
    })

    const [output, dispatch] = useReducer(responseReducer, initResps);
    
    const refresh = (overwriteConfig) => {
        if (cancelSource.current) {
            cancelSource.current.cancel();
            dispatch({type: actions.init});
        }
        cancelSource.current = cancelable ? axios.CancelToken.source() : undefined;
        dispatch({type: actions.init});

        return axiosInstance.request({...config, overwriteConfig, CancelToken: (cancelSource.current || {}).token})
                .then(data => {
                    dispatch({type: actions.success, payload: data});
                })
                .catch(error => {
                    dispatch({type: actions.fail, payload: error});
                })
    }

    useEffect(() => {
        if (options.trigger) {
            refresh();
        }
        // async function fetchData() {
        //     const data = await axios(config);
        //     setOutput({...output, data, loading: false});
        // }
        //  fetchData();
    }, [])

    return [output, refresh];
};

export default useAxios;
