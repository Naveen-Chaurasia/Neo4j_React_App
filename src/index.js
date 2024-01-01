import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Neo4jSankeyChart from './components/Neo4jSankeyChart';

import reportWebVitals from './reportWebVitals';
import TusionCharts from './components/Tusioncharts';
// import Record from 'neo4j-driver';
var Record =require('neo4j-driver');
var neo4j = require('neo4j-driver');
// import FusionCharts from './components/fusioncharts';


const URI = 'neo4j+s://ac4ba3f7.databases.neo4j.io'
const USER = 'neo4j'
const PASSWORD = 'AWKEeX3JP4VQaD5ch-O6Z_2kuu6ksfJWCUCwdIFJHR0'




function HelloWorld() {
  
  return <h1 className="greeting">
   {/* <Neo4jSankeyChart /> */}
    Hello, world!</h1>;

}





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <HelloWorld /> */}
    <Neo4jSankeyChart />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
