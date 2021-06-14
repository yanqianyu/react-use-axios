import React from 'react';
import {useState,  useEffect} from 'react';
import axios from 'axios';

const useAxios = (config, dependencies) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        // setLoading(true);
        axios.request(config)
                .then(() => console.log())
                .catch((error) => console.log(error))
                // .finally(() => setLoading(false))
    }, [dependencies])

    return [{data, loading, error}];
};

export default useAxios;
