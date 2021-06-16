import React, { useState } from 'react';

import useAxios from '../src';
import Test from '../test/Test';
import AxiosConfig from '../src/AxiosConfig';

export default function App() {
      const GlobalConfig = () => {
        return <AxiosConfig config={{baseURL: 'https://randomuser.me/api/'}}>
          <Test/>
        </AxiosConfig>
      }
      return <GlobalConfig/>
}