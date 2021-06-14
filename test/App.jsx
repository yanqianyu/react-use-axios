import React, { useState } from 'react';

import useAxios from '../src';
export default function App() {
    const [flag, setFlag] = React.useState(false)
      const [{ response, loading, error }] = useAxios({
        url: 'https://www.mxnzp.com/api/lottery/ssq/aim_lottery?expect=2018135'
      }, [flag])
      
      console.log(response, loading, error)
      if (error) {
        return <div>{JSON.stringify(error)}</div>
      }
      return loading ? <div>Loading...</div> : (<div>{JSON.stringify(response)}</div>)
}