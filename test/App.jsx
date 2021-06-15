import React, { useState } from 'react';

import useAxios from '../src';
export default function App() {
      const [gender, setGender] = useState('');
      const [{ data, loading, error }, refresh] = useAxios({
        url: `https://randomuser.me/api/${gender === 'unknown' ? 'unknown' : ''}`,
        method: 'get'
      }, {
        trigger: false
      })

      React.useEffect(() => {
        setTimeout(() => {
          refresh('https://www.mxnzp.com/api/holiday/single/20181121');
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