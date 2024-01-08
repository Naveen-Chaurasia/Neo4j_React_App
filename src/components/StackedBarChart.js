import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import neo4j from 'neo4j-driver';
import { Paper, Typography, Grid } from '@mui/material';

const StackedBarChart = ({ neo4jConfig }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const driver = neo4j.driver(
        neo4jConfig.serverUrl,
        neo4j.auth.basic(neo4jConfig.username, neo4jConfig.password)
      );

      const session = driver.session();

      const query = `
        MATCH (parent:Option)-[:CONTAINS]->(child)
        RETURN parent, COLLECT(child) AS children
      `;
      const result = await session.run(query);

      if (!result.records) {
        console.error('No records found');
        return;
      }

      const data = {
        labels: [],
        datasets: [],
      };

      result.records.forEach(record => {
        const parent = record.get('parent');
        const children = record.get('children');

        data.labels.push(parent.properties.name);

        children.forEach(child => {
          const totalGwp = child.properties.gwp_100;

          if (!data.datasets[child.properties.name]) {
            data.datasets[child.properties.name] = {
              label: child.properties.name,
              data: [],
              backgroundColor: getRandomColor(),
            };
          }

          data.datasets[child.properties.name].data.push(totalGwp);
        });
      });

      setChartData(data);

      session.close();
      driver.close();
    };

    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    fetchData();
  }, [neo4jConfig]);

  useEffect(() => {
    if (chartData) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = document.getElementById('stacked-bar-chart').getContext('2d');

      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartData.labels,
          datasets: Object.values(chartData.datasets),
        },
        options: {
          scales: {
            x: { stacked: true },
            y: { stacked: true },
          },
        },
      });
    }
  }, [chartData]);

  return (
    <Paper elevation={3} style={{ height: '100%', padding: '16px' }}>
      <Typography variant="h6" gutterBottom>
        Stacked Bar Chart
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Stacked bar chart */}
          <canvas id="stacked-bar-chart" style={{ width: '100%', height: '200px' }} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StackedBarChart;
