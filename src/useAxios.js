import React from 'react';
import {useState,  useEffect, useContext, useRef} from 'react';
import axios from 'axios';
import { AxiosContext } from './AxiosConfig';

const useAxios = (config, options) => {
    const globalConfig = useContext(AxiosContext) || {};
    const cancelable = options.cancelable || false;
    const cancelSource = useRef();

    const axiosInstance = globalConfig.axiosInstance || axios.create();

    const [output, setOutput] = useState({data: undefined, loading: false, error: undefined, isCancel: false});

    const refresh = (overwriteConfig) => {
        if (cancelSource.current) {
            cancelSource.current.cancel();
            setOutput({...output, isCancel: true});
        }
        cancelSource.current = cancelable ? axios.CancelToken.source() : undefined;
        setOutput({...output, loading: true});
        return axiosInstance.request({...config, overwriteConfig, CancelToken: (cancelSource.current || {}).token})
                .then(data => setOutput({...output, data, loading: false}))
                .catch(error => setOutput({...output, error, loading: false}))
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
