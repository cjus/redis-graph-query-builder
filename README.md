# redis-graph-query-builder
RedisGraph Query Builder

A light-weight module to aid in building Redis Graph database queries using the Cypher graph language.

This module has been tested with the official Redis Graph JavaScript module:

https://github.com/RedisGraph/redisgraph.js

This is a work in progress - do not use this release.

## Installation

```shell
$ npm install redis-graph-query-builder --save
```

## Demonstration program
```js
/**
 * @name Test
 * @description Sample program showing QueryBuilder in action
 */
(async () => {
  const QueryBuilder = require('./index');
  let document = {
    "type": "article",
    "title": "Coronavirus disease 2019",
    "URL": "https://en.wikipedia.org/wiki/Coronavirus_disease_2020"
  };

  let node = {
    "Type": "node",
    "ScientificArticleTitle": "",
    "ScientificLink": "",
    "text": "Like other coronaviruses, SARS-CoV-2 particles are spherical and have proteins called spikes protruding from their surface. These spikes latch onto human cells, then undergo a structural change that allows the viral membrane to fuse with the cell membrane. The viral genes can then enter the host cell to be copied, producing more viruses. Recent work shows that, like the virus that caused the 2002 SARS outbreak, SARS-CoV-2 spikes bind to receptors on the human cell surface called angiotensin-converting enzyme 2 (ACE2).", "key": "Spike protein"
  };

  // Build query using ES6 string interpolation
  // The toNamedProps function uses an object (document) to build a list of props
  // The toValueProps function uses an object (node) to add both keys and values
  let qb = new QueryBuilder();
  qb.add(`
    MATCH (d:Disease {type: "covid-19"})
    CREATE (dc:Document {${qb.toNamedProps(document)}})
    CREATE (n:Node {${qb.toValueProps(node)}})
    MERGE (d)-[:RelatesTo]->(n)
    MERGE (n)-[:Documents]->(dc)
    RETURN d;
  `);
  console.log(qb.toString());

  // Build query using multiple adds - useful when enumerating a
  // data structure and building a query base on query fragments
  qb = new QueryBuilder();
  qb.add(`MATCH (d:Disease {type: "covid-19"})`);
  qb.add(`CREATE (dc:Document {${qb.toNamedProps(document)}})`);
  qb.add(`CREATE (n:Node {${qb.toValueProps(node)}})`);
  qb.add(`MERGE (d)-[:RelatesTo]->(n)`);
  qb.add(`MERGE (n)-[:Documents]->(dc)`);
  qb.add(`RETURN d;`);
  console.log(qb.toString());

  // Build query using an array of strings
  // multiple arrays can be joined using multiple add operations
  qb = new QueryBuilder();
  qb.add([
    `MATCH (d:Disease {type: "covid-19"})`,
    `CREATE (dc:Document {${qb.toNamedProps(document)}})`,
    `CREATE (n:Node {${qb.toValueProps(node)}})`,
    `MERGE (d)-[:RelatesTo]->(n)`,
    `MERGE (n)-[:Documents]->(dc)`,
    `RETURN d;`
  ]);
  console.log(qb.toString());

  // Demonstration of adding SET operations based on the contents of an object
  qb = new QueryBuilder();
  qb.add(`
    MATCH (d:Disease {type: "covid-19"})
      ${qb.toSets('d', node)}
    RETURN d;
  `);
  console.log(qb.toString());
})();
```
