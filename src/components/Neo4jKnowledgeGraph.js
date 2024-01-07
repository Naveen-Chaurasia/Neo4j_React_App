import React, { useEffect, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import neo4j from 'neo4j-driver';

const Neo4jKnowledgeGraph = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const driver = neo4j.driver(
        'neo4j+s://ac4ba3f7.databases.neo4j.io',
        neo4j.auth.basic('neo4j', 'AWKEeX3JP4VQaD5ch-O6Z_2kuu6ksfJWCUCwdIFJHR0')
      );

      const session = driver.session();

      const query = 'MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 50';
      const result = await session.run(query);

      if (!result.records) {
        console.error('No records found');
        return;
      }

      const newElements = [];

      result.records.forEach(record => {
        const source = record.get('n');
        const target = record.get('m');
        const relationship = record.get('r');

        newElements.push({
          group: 'nodes',
          data: { id: source.identity.toString(), label: source.properties.name },
          position: { x: Math.random() * 400, y: Math.random() * 400 },
          style: {
            'background-color': '#69b3a2',
            label: source.properties.name,
            'font-size': '10px',
          },
        });

        newElements.push({
          group: 'nodes',
          data: { id: target.identity.toString(), label: target.properties.name },
          position: { x: Math.random() * 400, y: Math.random() * 400 },
          style: {
            'background-color': 'red',
            label: target.properties.name,
            'font-size': '10px',
          },
        });

        newElements.push({
          group: 'edges',
          data: { source: source.identity.toString(), target: target.identity.toString() },
          label: relationship.type,
          style: {
            width: 1,
            'line-color': 'red',
          },
        });
      });

      console.log(newElements);
      setElements(newElements);

      session.close();
      driver.close();
    };

    fetchData();
  }, []);

  return (
    <div style={{ height: '100vh', border: '1px solid #ccc' }}>
      <CytoscapeComponent elements={elements} layout={{ name: 'cose-bilkent' }} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default Neo4jKnowledgeGraph;
