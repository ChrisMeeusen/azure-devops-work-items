import React from 'react';
import './App.scss';
import 'jquery';
import 'foundation-sites/js/foundation.core';


import AppLayout from "./components/app-layout/AppLayout";


const App = () => {

  return (
  <div className="app">
    <AppLayout />
  </div>
  );
}

export default App;
