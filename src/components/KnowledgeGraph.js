import React, { useEffect } from 'react';
import * as d3 from 'd3';
import neo4j from 'neo4j-driver';

const KnowledgeGraph = () => {
  useEffect(() => {
    const fetchData = async () => {
      const driver = neo4j.driver(
        'neo4j+s://ac4ba3f7.databases.neo4j.io',
        neo4j.auth.basic('neo4j', 'AWKEeX3JP4VQaD5ch-O6Z_2kuu6ksfJWCUCwdIFJHR0')
      );

      const session = driver.session();

      const query = 'MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 50';
      const result = await session.run(query);

      const nodes = [];
      const links = [];

      result.records.forEach(record => {
        const source = record.get('n');
        const target = record.get('m');
        const relationship = record.get('r');

        nodes.push({ id: source.identity.toString(), label: source.properties.name });
        nodes.push({ id: target.identity.toString(), label: target.properties.name });

        links.push({
          source: source.identity.toString(),
          target: target.identity.toString(),
          type: relationship.type,
        });
      });

      session.close();
      driver.close();

      visualizeGraph(nodes, links);
    };

    fetchData();
  }, []);

  const visualizeGraph = (nodes, links) => {
    const width = 1400;
    const height = 600;

    const svg = d3.select('#graph-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 1);

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', 8)
      .attr('fill', '#69b3a2')
      .attr('stroke', '#666')
      .attr('stroke-width', 1);

    node.append('text')
      .text(d => d.label)
      .attr('x', 12)
      .attr('dy', '0.35em')
      .style('font-size', '12px');

    simulation
      .nodes(nodes)
      .on('tick', ticked);

    simulation.force('link')
      .links(links);

    function ticked() {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  return (
    <div>
      <style>
        {`
          #graph-container {
            width: 100%;
            height: 100vh;
            margin: 20px 0;
          }

          text {
            font-family: 'Arial', sans-serif;
          }
        `}
      </style>
      <div id="graph-container"></div>
    </div>
  );
};

export default KnowledgeGraph;
