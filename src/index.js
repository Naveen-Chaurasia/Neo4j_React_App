import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
var neo4j = require('neo4j-driver');
// import Record from 'neo4j-driver/lib/record.js'


const URI = 'neo4j+s://ac4ba3f7.databases.neo4j.io'
const USER = 'neo4j'
const PASSWORD = 'AWKEeX3JP4VQaD5ch-O6Z_2kuu6ksfJWCUCwdIFJHR0'

function HelloWorld() {
  
  return <h1 className="greeting">Hello, world!</h1>;

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
    'MATCH (p)-[q]->(r) return q',
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
     console.log(records[i]) 

  // for(Record of records) {
  //   console.log(Record.get('name'))
  // }
  
  }


  // Use the driver to run queries

  await driver.close()


})();



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelloWorld />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
