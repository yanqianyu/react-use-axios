import React, {useEffect, useState} from 'react'

import useAxios from '../src';

const Test = () => {
    const [gender, setGender] = useState('');
    const [{ data, loading, error }, refresh] = useAxios({
        url: `${gender === 'unknown' ? 'unknown' : ''}`,
        method: 'get'
      }, {
        trigger: false
      })

      React.useEffect(() => {
        setTimeout(() => {
          refresh(`${gender === 'unknown' ? 'unknown' : ''}`);
          console.log('refresh');
        }, 2000)
      }, [])
      
      console.log(data, loading, error);
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