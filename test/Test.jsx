import React, {useEffect, useState} from 'react'

import useAxios from '../src';

const Test = () => {
    const [gender, setGender] = useState('');
    const [{ data, loading, error, isCancel}, refresh] = useAxios({
        url: `${gender === 'unknown' ? 'unknown' : ''}`,
        method: 'get'
      }, {
        trigger: false,
        cancelable: true
      })

      React.useEffect(() => {
        setTimeout(() => {
            refresh(`${gender === 'unknown' ? 'unknown' : ''}`);
            refresh(`${gender === 'unknown' ? 'unknown' : ''}`);
            console.log('refresh');
        })
        setTimeout(() => {
            refresh(`${gender === 'unknown' ? 'unknown' : ''}`);
            console.log('refresh');
        })
      }, [])
      
      console.log(data, loading, error, isCancel);
      if (error) {
        return <div>{JSON.stringify(error)}</div>
      }

      if (loading) {
        return (
          <div>Loading...</div>
        )
      }
      return (
        <div>{JSON.stringify(data)}</div>
      )
}

export default Test;