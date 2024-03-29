/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const graphTypes = require('./graphTypes');

const types = require('./types');

const util = require('./util'); // constants


const {
  // RDF,
  RDF_LIST,
  RDF_FIRST,
  RDF_REST,
  RDF_NIL,
  RDF_TYPE,
  // RDF_PLAIN_LITERAL,
  // RDF_XML_LITERAL,
  // RDF_OBJECT,
  // RDF_LANGSTRING,
  // XSD,
  XSD_BOOLEAN,
  XSD_DOUBLE,
  XSD_INTEGER,
  XSD_STRING
} = require('./constants');

const api = {};
module.exports = api;
/**
 * Converts an RDF dataset to JSON-LD.
 *
 * @param dataset the RDF dataset.
 * @param options the RDF serialization options.
 *
 * @return a Promise that resolves to the JSON-LD output.
 */

api.fromRDF =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (dataset, {
    useRdfType = false,
    useNativeTypes = false
  }) {
    const defaultGraph = {};
    const graphMap = {
      '@default': defaultGraph
    };
    const referencedOnce = {};

    for (const quad of dataset) {
      // TODO: change 'name' to 'graph'
      const name = quad.graph.termType === 'DefaultGraph' ? '@default' : quad.graph.value;

      if (!(name in graphMap)) {
        graphMap[name] = {};
      }

      if (name !== '@default' && !(name in defaultGraph)) {
        defaultGraph[name] = {
          '@id': name
        };
      }

      const nodeMap = graphMap[name]; // get subject, predicate, object

      const s = quad.subject.value;
      const p = quad.predicate.value;
      const o = quad.object;

      if (!(s in nodeMap)) {
        nodeMap[s] = {
          '@id': s
        };
      }

      const node = nodeMap[s];
      const objectIsNode = o.termType.endsWith('Node');

      if (objectIsNode && !(o.value in nodeMap)) {
        nodeMap[o.value] = {
          '@id': o.value
        };
      }

      if (p === RDF_TYPE && !useRdfType && objectIsNode) {
        util.addValue(node, '@type', o.value, {
          propertyIsArray: true
        });
        continue;
      }

      const value = _RDFToObject(o, useNativeTypes);

      util.addValue(node, p, value, {
        propertyIsArray: true
      }); // object may be an RDF list/partial list node but we can't know easily
      // until all triples are read

      if (objectIsNode) {
        if (o.value === RDF_NIL) {
          // track rdf:nil uniquely per graph
          const object = nodeMap[o.value];

          if (!('usages' in object)) {
            object.usages = [];
          }

          object.usages.push({
            node,
            property: p,
            value
          });
        } else if (o.value in referencedOnce) {
          // object referenced more than once
          referencedOnce[o.value] = false;
        } else {
          // keep track of single reference
          referencedOnce[o.value] = {
            node,
            property: p,
            value
          };
        }
      }
    }
    /*
    for(let name in dataset) {
      const graph = dataset[name];
      if(!(name in graphMap)) {
        graphMap[name] = {};
      }
      if(name !== '@default' && !(name in defaultGraph)) {
        defaultGraph[name] = {'@id': name};
      }
      const nodeMap = graphMap[name];
      for(let ti = 0; ti < graph.length; ++ti) {
        const triple = graph[ti];
         // get subject, predicate, object
        const s = triple.subject.value;
        const p = triple.predicate.value;
        const o = triple.object;
         if(!(s in nodeMap)) {
          nodeMap[s] = {'@id': s};
        }
        const node = nodeMap[s];
         const objectIsId = (o.type === 'IRI' || o.type === 'blank node');
        if(objectIsId && !(o.value in nodeMap)) {
          nodeMap[o.value] = {'@id': o.value};
        }
         if(p === RDF_TYPE && !useRdfType && objectIsId) {
          util.addValue(node, '@type', o.value, {propertyIsArray: true});
          continue;
        }
         const value = _RDFToObject(o, useNativeTypes);
        util.addValue(node, p, value, {propertyIsArray: true});
         // object may be an RDF list/partial list node but we can't know easily
        // until all triples are read
        if(objectIsId) {
          if(o.value === RDF_NIL) {
            // track rdf:nil uniquely per graph
            const object = nodeMap[o.value];
            if(!('usages' in object)) {
              object.usages = [];
            }
            object.usages.push({
              node: node,
              property: p,
              value: value
            });
          } else if(o.value in referencedOnce) {
            // object referenced more than once
            referencedOnce[o.value] = false;
          } else {
            // keep track of single reference
            referencedOnce[o.value] = {
              node: node,
              property: p,
              value: value
            };
          }
        }
      }
    }*/
    // convert linked lists to @list arrays


    for (const name in graphMap) {
      const graphObject = graphMap[name]; // no @lists to be converted, continue

      if (!(RDF_NIL in graphObject)) {
        continue;
      } // iterate backwards through each RDF list


      const nil = graphObject[RDF_NIL];

      if (!nil.usages) {
        continue;
      }

      for (let usage of nil.usages) {
        let node = usage.node;
        let property = usage.property;
        let head = usage.value;
        const list = [];
        const listNodes = []; // ensure node is a well-formed list node; it must:
        // 1. Be referenced only once.
        // 2. Have an array for rdf:first that has 1 item.
        // 3. Have an array for rdf:rest that has 1 item.
        // 4. Have no keys other than: @id, rdf:first, rdf:rest, and,
        //   optionally, @type where the value is rdf:List.

        let nodeKeyCount = Object.keys(node).length;

        while (property === RDF_REST && types.isObject(referencedOnce[node['@id']]) && types.isArray(node[RDF_FIRST]) && node[RDF_FIRST].length === 1 && types.isArray(node[RDF_REST]) && node[RDF_REST].length === 1 && (nodeKeyCount === 3 || nodeKeyCount === 4 && types.isArray(node['@type']) && node['@type'].length === 1 && node['@type'][0] === RDF_LIST)) {
          list.push(node[RDF_FIRST][0]);
          listNodes.push(node['@id']); // get next node, moving backwards through list

          usage = referencedOnce[node['@id']];
          node = usage.node;
          property = usage.property;
          head = usage.value;
          nodeKeyCount = Object.keys(node).length; // if node is not a blank node, then list head found

          if (!graphTypes.isBlankNode(node)) {
            break;
          }
        } // the list is nested in another list


        if (property === RDF_FIRST) {
          // empty list
          if (node['@id'] === RDF_NIL) {
            // can't convert rdf:nil to a @list object because it would
            // result in a list of lists which isn't supported
            continue;
          } // preserve list head


          if (RDF_REST in graphObject[head['@id']]) {
            head = graphObject[head['@id']][RDF_REST][0];
          }

          list.pop();
          listNodes.pop();
        } // transform list into @list object


        delete head['@id'];
        head['@list'] = list.reverse();

        for (const listNode of listNodes) {
          delete graphObject[listNode];
        }
      }

      delete nil.usages;
    }

    const result = [];
    const subjects = Object.keys(defaultGraph).sort();

    for (const subject of subjects) {
      const node = defaultGraph[subject];

      if (subject in graphMap) {
        const graph = node['@graph'] = [];
        const graphObject = graphMap[subject];
        const graphSubjects = Object.keys(graphObject).sort();

        for (const graphSubject of graphSubjects) {
          const node = graphObject[graphSubject]; // only add full subjects to top-level

          if (!graphTypes.isSubjectReference(node)) {
            graph.push(node);
          }
        }
      } // only add full subjects to top-level


      if (!graphTypes.isSubjectReference(node)) {
        result.push(node);
      }
    }

    return result;
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Converts an RDF triple object to a JSON-LD object.
 *
 * @param o the RDF triple object to convert.
 * @param useNativeTypes true to output native types, false not to.
 *
 * @return the JSON-LD object.
 */


function _RDFToObject(o, useNativeTypes) {
  // convert NamedNode/BlankNode object to JSON-LD
  if (o.termType.endsWith('Node')) {
    return {
      '@id': o.value
    };
  } // convert literal to JSON-LD


  const rval = {
    '@value': o.value
  }; // add language

  if (o.language) {
    rval['@language'] = o.language;
  } else {
    let type = o.datatype.value;

    if (!type) {
      type = XSD_STRING;
    } // use native types for certain xsd types


    if (useNativeTypes) {
      if (type === XSD_BOOLEAN) {
        if (rval['@value'] === 'true') {
          rval['@value'] = true;
        } else if (rval['@value'] === 'false') {
          rval['@value'] = false;
        }
      } else if (types.isNumeric(rval['@value'])) {
        if (type === XSD_INTEGER) {
          const i = parseInt(rval['@value'], 10);

          if (i.toFixed(0) === rval['@value']) {
            rval['@value'] = i;
          }
        } else if (type === XSD_DOUBLE) {
          rval['@value'] = parseFloat(rval['@value']);
        }
      } // do not add native type


      if (![XSD_BOOLEAN, XSD_INTEGER, XSD_DOUBLE, XSD_STRING].includes(type)) {
        rval['@type'] = type;
      }
    } else if (type !== XSD_STRING) {
      rval['@type'] = type;
    }
  }

  return rval;
}