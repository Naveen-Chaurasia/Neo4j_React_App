import React, { useEffect } from 'react';
import neo4j from 'neo4j-driver';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.candy';
import PowerCharts from 'fusioncharts/fusioncharts.powercharts';
import ReactFC from 'react-fusioncharts';
import * as d3 from 'd3'; // Import D3.js
ReactFC.fcRoot(FusionCharts, PowerCharts, FusionTheme);

Charts(FusionCharts);
FusionTheme(FusionCharts);

const Neo4jSankeyChart1 = () => {
  useEffect(() => {
    // const URI = 'neo4j+s://dd0a8c98.databases.neo4j.io';
    // const USER = 'neo4j';
    // const PASSWORD = 'ka4impFnMI18nKDVIl_Ln7q9ZtBXHDQD8opLmRMU4tU';


    //Tunnel
    const URI = 'neo4j+s://ac4ba3f7.databases.neo4j.io';
    const USER = 'neo4j';
    const PASSWORD = 'AWKEeX3JP4VQaD5ch-O6Z_2kuu6ksfJWCUCwdIFJHR0';


    const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

    const sessionNodes = driver.session({ database: 'neo4j' });
    const queryNodes = 'MATCH (n) RETURN n.uid';

    const nodes = [];

    sessionNodes.run(queryNodes)
      .then(result => {
        const records = result.records;
        const summary = result.summary;

        console.log(
          `>> Nodes query ${summary.query.text} ` +
          `returned ${records.length} records ` +
          `in ${summary.resultAvailableAfter} ms.`
        );
        console.log('>> Nodes Results');

        records.forEach(record => {
          const label = record.get('n.uid');
          nodes.push({ "label": label });
        });

        console.log(nodes);
        console.log('************************');

        const sessionLinks = driver.session({ database: 'neo4j' });
        const queryLinks = 'MATCH (p)-[q]->(r) RETURN p.uid, q.quantity, r.uid, r.gwp_100';

        const links = [['from', 'to', 'weight']];

        sessionLinks.run(queryLinks)
          .then(result => {
            const records = result.records;
            const summary = result.summary;

            console.log(
              `>> Links query ${summary.query.text} ` +
              `returned ${records.length} records ` +
              `in ${summary.resultAvailableAfter} ms.`
            );
            console.log('>> Links Results');

            records.forEach(record => {
              let quantity = record.get('q.quantity');
              quantity = (quantity != null || undefined) ? parseFloat(quantity) : 1;

              links.push({
                'from': record.get('p.uid'),
                'to': record.get('r.uid'),
                'value': quantity * record.get('r.gwp_100')
              });
            });

            console.log('------------------------------------------------------------------------------------------');
            console.log(links);

            FusionCharts.ready(function () {
              const dataSource = {
                chart: {
                  caption: "",
                  subcaption: "A Horizontal Sankey with options to configure the flow representation",
                  theme: "candy",
                  orientation: "horizontal",
                  linkalpha: 30,
                  linkhoveralpha: 60,
                  nodelabelposition: "start"
                },
                "nodes": nodes,
                "links": links
              };

              const myChart = new FusionCharts({
                type: "sankey",
                renderAt: "chart-container",
                width: "100%",
                height: "100%",
                dataFormat: "json",
                dataSource: dataSource
              }).render();

              // Add D3 interaction
              const svg = d3.select("#chart-container svg");
              const link = svg.selectAll(".link");
              const node = svg.selectAll(".node");

              link.on("click", function (d) {
                // Highlight related nodes or perform custom action on link click
                console.log("Link clicked:", d);
              });

              node.on("click", function (d) {
                // Highlight related links or perform custom action on node click
                console.log("Node clicked:", d);
              });
            });

          })
          .catch(error => {
            console.error('Error executing links query:', error);
          })
          .finally(() => {
            sessionLinks.close();
            driver.close();
          });

      })
      .catch(error => {
        console.error('Error executing nodes query:', error);
      })
      .finally(() => {
        sessionNodes.close();
      });
  }, []);

  return (
    <div>
      <style>
        {`
          #chart-container {
            width: 100%;
            height: 100vh;
            margin: 20px 0;
          }
        `}
      </style>
      <div id="chart-container"></div>
    </div>
  );
}

export default Neo4jSankeyChart1;
