import React, { useState } from 'react';
import Neo4jKnowledgeGraph from './Neo4jKnowledgeGraph';
import Neo4jSankeyChart from './Neo4jSankeyChart';
import StackedBarChart from './StackedBarChart';
import { Tabs, Tab, Container, Paper, TextField, Button, Box, Typography } from '@mui/material';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('knowledgeGraph');
  const [neo4jConfig, setNeo4jConfig] = useState({
    username: 'neo4j',
    serverUrl: 'neo4j+s://ac4ba3f7.databases.neo4j.io',
    password: 'AWKEeX3JP4VQaD5ch-O6Z_2kuu6ksfJWCUCwdIFJHR0',
  });

  const handleTabChange = (event, tab) => {
    setSelectedTab(tab);
  };

  const handleNeo4jConfigChange = (event) => {
    const { name, value } = event.target;
    setNeo4jConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const handleApplyConfig = () => {
    // Pass the Neo4j configuration to the chart components
    // You can add additional validation or error handling here
  };

  return (
    <Container style={{ display: 'flex', height: '100vh', padding: 0 }}>
      <Paper style={{ width: '20%', borderRight: '1px solid #e0e0e0', padding: '16px', backgroundColor: '#f9f9f9', color: '#30323d' }}>
        <Tabs value={selectedTab} onChange={handleTabChange} orientation="vertical" textColor="primary" indicatorColor="primary">
          <Tab label="Knowledge Graph" value="knowledgeGraph" />
          <Tab label="Sankey Chart" value="sankeyChart" />
          <Tab label="Stacked Bar Chart" value="stackedBarChart" />
        </Tabs>

        <TextField
          fullWidth
          label="Neo4j Username"
          name="username"
          value={neo4jConfig.username}
          onChange={handleNeo4jConfigChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Neo4j Server URL"
          name="serverUrl"
          value={neo4jConfig.serverUrl}
          onChange={handleNeo4jConfigChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Neo4j Password"
          name="password"
          type="password"
          value={neo4jConfig.password}
          onChange={handleNeo4jConfigChange}
          margin="normal"
          variant="outlined"
        />
        <Box mt={2}>
          <Button variant="contained" color="secondary" onClick={handleApplyConfig}>
            Apply Configuration
          </Button>
        </Box>
      </Paper>

      <Container style={{ flex: 1, height: '100%', padding: '20px', backgroundColor: 'white' }}>
        {/* <Typography variant="h4" gutterBottom style={{ color: '#30323d' }}>
          Neo4j Dashboard
        </Typography> */}
        {selectedTab === 'knowledgeGraph' && <Neo4jKnowledgeGraph neo4jConfig={neo4jConfig} />}
        {selectedTab === 'sankeyChart' && <Neo4jSankeyChart neo4jConfig={neo4jConfig} />}
        {selectedTab === 'stackedBarChart' && <StackedBarChart neo4jConfig={neo4jConfig} />}
      </Container>
    </Container>
  );
};

export default Dashboard;
