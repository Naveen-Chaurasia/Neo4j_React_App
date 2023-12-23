import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import reportWebVitals from './reportWebVitals';
import FusionCharts from './components/fusioncharts';
// import Record from 'neo4j-driver';
var Record =require('neo4j-driver');
var neo4j = require('neo4j-driver');
// import FusionCharts from './components/fusioncharts';


// const URI = 'neo4j+s://ac4ba3f7.databases.neo4j.io'
// const USER = 'neo4j'
// const PASSWORD = 'AWKEeX3JP4VQaD5ch-O6Z_2kuu6ksfJWCUCwdIFJHR0'


const URI = 'neo4j+s://b462de17.databases.neo4j.io'
const USER = 'neo4j'
const PASSWORD = 'VDjwtzYXuFnG5Sdnt6H5-jeCFbEvzqDazrJTlkduJd4'


function HelloWorld() {
  
  return <h1 className="greeting">
    {/* <FusionCharts  /> */}
    Hello, world!</h1>;

}




(async () => {
  var neo4j = require('neo4j-driver')

  let driver

  try {
    driver = neo4j.driver(URI,  neo4j.auth.basic(USER, PASSWORD))
    const serverInfo = await driver.getServerInfo()
    console.log('Connection estabilished')
    console.log(serverInfo)
  } catch(err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    await driver.close()
    return
  }
  const { records, summary, keys } = await driver.executeQuery(
    // 'MATCH (n) RETURN n.name AS name',
     'MATCH (p)-[q]->(r) return p.uid, q.quantity, r.uid, r.gwp_100',
    { age: 42 },
    { database: 'neo4j' }

  )
  
  // Summary information
  console.log(
    `>> The query ${summary.query.text} ` +
    `returned ${records.length} records ` +
    `in ${summary.resultAvailableAfter} ms.`
  )
  console.log('>> Results')
  for( let i=0; i<records.length;i++) {
    //  console.log(records[i]) 

    //for nodes
  // for(Record of records) {
  //   console.log(Record.get('name'))
  // }
  const sampleData=[['from','to','weight']];
  //for relationships
  for(Record of records) {
    console.log(Record)
    sampleData.push([Record.get('p.uid'),Record.get('r.uid'),Record.get('q.quantity')])
  }
  // console.log(type(sampleData));
  console.log("------------------------------------------------------------------------------------------")
  console.log(sampleData);    


    // let sum = 0;
    // for(let i=0; i<edges.length; i++){
    //     let edge = edges[i];
    //     // quantity
    //     let q = edge.data.quantity;
    //     q = (q != null) ? parseFloat(q) : 1;
    //     // end node's gwp_100
    //     let endNode = Model.getNodeById(edge.data.target);
    //     let gwp_100 = endNode.data.gwp_100;
    //     gwp_100 = (gwp_100 == null) ? 0 : gwp_100;
    //     sum += (gwp_100 * q);
    // }
    // return (sum == 0) ? '' : sum;
  
  }


  // Use the driver to run queries

  await driver.close()


})();



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <HelloWorld /> */}
    <FusionCharts  />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
