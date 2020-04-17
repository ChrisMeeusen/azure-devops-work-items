import React, {useEffect} from 'react';
import './App.scss';
import 'jquery';
import 'foundation-sites/js/foundation.core';
import {useLocation} from 'react-router-dom';

import AppLayout from "./components/app-layout/AppLayout";


const App = () => {

  return (
  <div className="app">
    <AppLayout />
  </div>
  );
}

export default App;
