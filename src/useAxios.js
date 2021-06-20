import React from 'react';
import {useState,  useEffect, useContext, useRef, useReducer} from 'react';
import axios from 'axios';
import { AxiosContext } from './AxiosConfig';
import { initResps, actions, responseReducer } from './reducers';
import Storage, { requestIntercepter, responseErrorInterceptor, responseInterceptor } from './Storage';

const cache = new Storage();

const useAxios = (config, options) => {
    const globalConfig = useContext(AxiosContext) || {};
    const cancelable = options.cancelable || false;
    const cancelSource = useRef();

    const axiosInstance = globalConfig.axiosInstance || axios.create();

    axiosInstance.interceptors.request.use(requestIntercepter);
    axiosInstance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

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
