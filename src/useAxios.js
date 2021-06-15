import React from 'react';
import {useState,  useEffect} from 'react';
import axios from 'axios';

const useAxios = (config, options) => {
    const [output, setOutput] = useState({data: undefined, loading: false, error: undefined});

    const refresh = (overwriteConfig) => {
        setOutput({...output, loading: true});
        return axios.request(config)
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
