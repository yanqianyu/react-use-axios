import React, {useRef, useEffect} from 'react'
import axios from 'axios';

export const AxiosContext = React.createContext(null);

const AxiosConfig = (props) => {
    const {config} = props;
    const axiosInstanceRef = useRef();

    if (config) {
        axiosInstanceRef.current = axios.create(config);
    }
    else {
        axiosInstanceRef.current = axios.create();
    }

    return <AxiosContext.Provider value={{axiosInstance: axiosInstanceRef.current}}>{props.children}</AxiosContext.Provider>
}

export default AxiosConfig;