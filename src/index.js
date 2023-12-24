import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import reportWebVitals from './reportWebVitals';
import TusionCharts from './components/Tusioncharts';
// import Record from 'neo4j-driver';
var Record =require('neo4j-driver');
var neo4j = require('neo4j-driver');
// import FusionCharts from './components/fusioncharts';


const URI = 'neo4j+s://ac4ba3f7.databases.neo4j.io'
const USER = 'neo4j'
const PASSWORD = 'AWKEeX3JP4VQaD5ch-O6Z_2kuu6ksfJWCUCwdIFJHR0'


// const URI = 'neo4j+s://b462de17.databases.neo4j.io'
// const USER = 'neo4j'
// const PASSWORD = 'VDjwtzYXuFnG5Sdnt6H5-jeCFbEvzqDazrJTlkduJd4'


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
     'MATCH (p)-[q]->(r) return p, q, r',
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
  
  const sampleData=[['from','to','weight']];
  //for relationships
  for(Record of records) {
    console.log(Record)
    sampleData.push([Record.get('p'),Record.get('r'),Record.get('q')])
  }
  // console.log(type(sampleData));
  console.log("------------------------------------------------------------------------------------------")
  console.log(sampleData);    
  
  


  async function getNodeById(id) {

    // let nodes=Record.get('p')
    for(Record of records)
    {
      let m=Record.get('p');
      let n=Record.get('r');
      if (m.identity.low==id)
      {
        return  Record.get('p');
        // return node;
      }
      
      else if(n.identity.low==id)
      {

        return Record.get('r')
      }

      // return node;
      
    }
 
  }


  ////////////////////
    const sampleData1=[['from','to','weight']];
  
  
  // let sum = 0;
  for(Record of records){
      let edge = Record.get('q');
      console.log(edge)
      // quantity
      console.log("++++++++++++++++++++")
      console.log(edge.properties)
      let q = edge.properties.quantity;
      q = (q != null||undefined) ? parseFloat(q) : 1;
      console.log(q)
      // end node's gwp_100
      console.log(edge.endNodeElementId)
      console.log(edge.end.low);
      let s=edge.end.low
      console.log("++++++++++++++++++++")
      console.log(s)

      
      const endNode = await getNodeById(edge.end.low).then((response)=> {
        return response;
      });
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
      console.log((endNode));



      console.log("++++++++++++++++++++")
      console.log(endNode)
      let gwp_100 = endNode.properties.gwp_100;
      gwp_100 = (gwp_100 == null) ? 0 : gwp_100;
      // sum += (gwp_100 * q);
      let r_gwp_100=gwp_100*q;
      sampleData1.push([Record.get('p').properties.uid,Record.get('r').properties.uid,r_gwp_100])
  }
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  console.log(sampleData1)

  await driver.close()
})();



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <HelloWorld /> */}
    <TusionCharts  />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
