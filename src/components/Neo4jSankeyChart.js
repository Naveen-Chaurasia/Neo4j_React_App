import React, { useEffect } from 'react';
import neo4j from 'neo4j-driver';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

// Add necessary FusionCharts modules and theme
Charts(FusionCharts);
FusionTheme(FusionCharts);

const Neo4jSankeyChart = () => {
  useEffect(() => {
    const URI = 'neo4j+s://ac4ba3f7.databases.neo4j.io';
    const USER = 'neo4j';
    const PASSWORD = 'AWKEeX3JP4VQaD5ch-O6Z_2kuu6ksfJWCUCwdIFJHR0';

    // Create a driver
    const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

    // Fetch Nodes
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

        // Process records
        records.forEach(record => {
          console.log(record);

          const label = record.get('n.uid');
          nodes.push({ "label": label });
        });

        console.log(nodes);
        console.log('************************');

        // Fetch Links
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

            // Process records
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

            // Create FusionCharts
            FusionCharts.ready(function () {
              const dataSource = {
                chart: {
                  caption: "Bilateral Trade Volume, 2013",
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

              var myChart = new FusionCharts({
                type: "sankey",
                renderAt: "chart-container",
                width: "100%",
                height: "100%",
                dataFormat: "json",
                dataSource: dataSource
              }).render();
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
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div>
      FusionCharts XT will load here!
      <div id="chart-container"></div>
    </div>
  );
}

export default Neo4jSankeyChart;
