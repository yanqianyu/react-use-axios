import React from 'react';
import {useState,  useEffect} from 'react';
import axios from 'axios';

const useAxios = (config) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        setLoading(true);
        axios.request(config)
                .then(setData)
                .catch(setError)
                .finally(() => setLoading(false))
    }, [])

    return [{data, loading, error}];
};

export default useAxios;
