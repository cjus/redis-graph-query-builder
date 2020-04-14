/**
 * @name QueryBuilder
 * @description Redis Graph Query Builder
 */
class QueryBuilder {
  constructor() {
    this.q = [];
  }

  /**
  * @name add
  * @summary Adds a partial query statement.
  * @param {string / array} partial - query fragment
  */
  add(partial) {
    if (partial.constructor === Array) {
      partial.forEach((element) => {
        this.add(element);
      });
      return;
    }
    this.q.push(partial);
  }

  /**
  * @name toString
  * @summary Returns the full query as a string.
  * @return {string} value - full query as a string
  */
  toString() {
    return this.q.join(' ').
      replace(/\s\s+/g, ' ').
      replace(/(?:\r\n|\r|\n|\t)/g,'').
      trim();
  }

  /**
  * @name toProps
  * @summary Convert an object of properties to a property query string.
  * @param {object} obj - object which will be converted to string of key/values
  * @return {string} string of neo4j cypher compatible key / values
  */
  toProps(obj) {
    let ret = [];
    let objKeys = Object.keys(obj);
    objKeys.forEach((k) => {
      if (typeof(obj[k]) === 'string') {
        ret.push(`${k}:"${obj[k]}"`);
      } else if (typeof(obj[k]) === 'number') {
        ret.push(`${k}:${obj[k]}`);
      } else if (typeof(obj[k]) === 'boolean') {
        ret.push(`${k}:${obj[k]}`);
      } else if (typeof(obj[k]) === 'array') {
        ret.push(`${k}:[]`);
      } else {
        throw new Error('property type not supported');
      }
    });
    return ret.join(', ');
  }

  /**
    * @name toNamedProps
    * @summary Converts a named object to a cypher compatible key / value pair.
    * @param {string} name - name of object
    * @param {object} obj - object which will be converted to string of key/values
    * @return {string} string of neo4j cypher compatible key / values
    */
  toNamedProps(name, obj) {
    let ret = [];
    let objKeys = Object.keys(obj);
    objKeys.forEach((k) => {
      ret.push(`${k}:{${name}}.${k}`);
    });
    return ret.join(', ');
  }

  /**
  * @name toSets
  * @summary Convert an object of properties to a group of set statements
  * @param {string} v - query varible
  * @param {string} objName - query param object name
  * @param {object} obj - object which will be converted
  * @note creates string in this format: "SET e.eid = {event}.eid"
  *       query must pass param object named event in the example above
  * @return {string} string of neo4j cypher compatible set statements
  */
  toSets(v, objName, obj) {
    let ret = [];
    let objKeys = Object.keys(obj);
    ret.push('\n');
    objKeys.forEach((k) => {
      ret.push(`  SET ${v}.${k} = {${objName}}.${k}`)
    });
    return ret.join('\n');
  }
}

module.exports = QueryBuilder;
